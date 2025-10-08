from django.utils.timezone import now
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
import joblib
import os
import json
import numpy as np

from .models import Vaca, CustomUser
from .serializers import VacaSerializer, UserSerializer, RegisterSerializer, CustomTokenObtainPairSerializer
from .permissions import IsRoleAdmin


class VacaViewSet(viewsets.ModelViewSet):
    queryset = Vaca.objects.all().order_by('-fecha')
    serializer_class = VacaSerializer

    @action(detail=True, methods=['put'], permission_classes=[IsAuthenticated])
    def actualizar_estado(self, request, pk=None):
        vaca = self.get_object()
        data = request.data

        inseminada = data.get('inseminada')
        gestante = data.get('gestante')

        if inseminada is not None:
            vaca.inseminada = inseminada
            if inseminada and not vaca.fecha_inseminacion:
                vaca.fecha_inseminacion = now()
            elif not inseminada:
                vaca.fecha_inseminacion = None

        if gestante is not None:
            vaca.gestante = gestante
            if gestante and not vaca.fecha_gestacion:
                vaca.fecha_gestacion = now()
            elif not gestante:
                vaca.fecha_gestacion = None

        vaca.save()
        serializer = self.get_serializer(vaca)
        return Response(serializer.data, status=status.HTTP_200_OK)
    @action(detail=True, methods=['put'], permission_classes=[IsAuthenticated])
    def reevaluar(self, request, pk=None):
        vaca = self.get_object()
        serializer = self.get_serializer(vaca, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Cargar modelo y columnas para predicción
        modelo_path = os.path.join(os.path.dirname(__file__), 'modelo_celo_posparto_rf.pkl')
        columnas_path = os.path.join(os.path.dirname(__file__), 'columnas_rf.json')
        modelo = joblib.load(modelo_path)
        with open(columnas_path, 'r') as f:
            columnas = json.load(f)

        # Preparar datos para predicción (one-hot encoding de raza)
        datos_input = {
            'actividad': vaca.actividad,
            'temperatura': vaca.temperatura,
            'dias_posparto': vaca.dias_posparto,
            'condicion': vaca.condicion,
            'parto_asistido': int(vaca.parto_asistido),
        }
        for code, raza_nombre in Vaca.RAZAS:
            datos_input[f'raza_{raza_nombre}'] = 1 if vaca.raza == code else 0

        X = np.array([[datos_input.get(col, 0) for col in columnas]])

        # Calcular nueva predicción
        probabilidad = modelo.predict_proba(X)[0][1] * 100
        probabilidad = min(probabilidad, 96.0)

        # Actualizar predicción y fecha
        vaca.prediccion = probabilidad
        vaca.fecha = now()
        vaca.save()

        return Response(self.get_serializer(vaca).data, status=status.HTTP_200_OK)

class PrediccionCeloAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        datos = request.data
        try:
            nombre = datos['nombre']
            actividad = int(datos['actividad'])
            temperatura = float(datos['temperatura'])
            dias_posparto = int(datos['dias_posparto'])
            condicion = float(datos['condicion'])
            raza = datos['raza']  # Debe ser uno de los códigos de RAZAS
            parto_asistido = bool(int(datos.get('parto_asistido', 0)))  # 0 o 1

            # Carga el modelo y las columnas usadas en el entrenamiento
            modelo_path = os.path.join(os.path.dirname(__file__), 'modelo_celo_posparto_rf.pkl')
            columnas_path = os.path.join(os.path.dirname(__file__), 'columnas_rf.json')
            modelo = joblib.load(modelo_path)
            with open(columnas_path, 'r') as f:
                columnas = json.load(f)

            # One-hot encoding de la raza
            datos_input = {
                'actividad': actividad,
                'temperatura': temperatura,
                'dias_posparto': dias_posparto,
                'condicion': condicion,
                'parto_asistido': int(parto_asistido),
            }
            for code, raza_nombre in Vaca.RAZAS:
                datos_input[f'raza_{raza_nombre}'] = 1 if raza == code else 0

            # Ordena los datos según las columnas del modelo
            X = np.array([[datos_input.get(col, 0) for col in columnas]])

            # Realiza la predicción
            probabilidad = modelo.predict_proba(X)[0][1] * 100
            probabilidad = min(probabilidad, 96.0)

            # Guarda el registro en la base de datos
            vaca = Vaca.objects.create(
                nombre=nombre,
                actividad=actividad,
                temperatura=temperatura,
                dias_posparto=dias_posparto,
                condicion=condicion,
                raza=raza,
                parto_asistido=parto_asistido,
                prediccion=probabilidad
            )
            serializer = VacaSerializer(vaca)
            return Response({'prediccion': probabilidad, 'registro': serializer.data}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(generics.CreateAPIView):
    permission_classes = [IsRoleAdmin]
    serializer_class = RegisterSerializer


class UserListView(generics.ListCreateAPIView):
    permission_classes = [IsRoleAdmin]
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsRoleAdmin]
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
