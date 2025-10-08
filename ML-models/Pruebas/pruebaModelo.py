import tkinter as tk
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pandas as pd
import numpy as np

# Función para cargar datos
def cargar_datos(ruta):
    try:
        datos = pd.read_csv(ruta)
        return datos
    except FileNotFoundError:
        print("El archivo no existe en la ruta especificada.")
        return None
    except pd.errors.EmptyDataError:
        print("El archivo está vacío.")
        return None

# Función para validar datos
def validar_datos(datos):
    # Verificar que los datos no estén vacíos
    if datos.empty:
        print("No hay datos para procesar.")
        return False
    
    # Verificar que las columnas necesarias existan
    columnas_necesarias = ['actividad_fisica', 'temperatura_corporal', 'humedad', 'edad', 'celo']
    if not all(col in datos.columns for col in columnas_necesarias):
        print("Faltan columnas necesarias en los datos.")
        return False
    
    # Verificar que los datos sean numéricos donde corresponda
    for col in ['actividad_fisica', 'temperatura_corporal', 'humedad', 'edad']:
        if not pd.api.types.is_numeric_dtype(datos[col]):
            print(f"La columna '{col}' debe ser numérica.")
            return False
    
    return True

# Función para entrenar el modelo
def entrenar_modelo(datos):
    if not validar_datos(datos):
        return None
    
    # Preparar los datos para el entrenamiento
    X = datos.drop(['celo'], axis=1)
    y = datos['celo']
    
    # Dividir los datos en entrenamiento y prueba
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Entrenar el modelo
    modelo = RandomForestClassifier()
    modelo.fit(X_train, y_train)
    
    return modelo

# Interfaz de usuario
def crear_interfaz(modelo):
    ventana = tk.Tk()
    ventana.title("Predicción de Celos")
    
    # Entradas para los datos
    tk.Label(ventana, text="Actividad Física").grid(row=0)
    tk.Label(ventana, text="Temperatura Corporal").grid(row=1)
    tk.Label(ventana, text="Humedad").grid(row=2)
    tk.Label(ventana, text="Edad").grid(row=3)
    
    actividad_fisica = tk.Entry(ventana)
    temperatura_corporal = tk.Entry(ventana)
    humedad = tk.Entry(ventana)
    edad = tk.Entry(ventana)
    
    actividad_fisica.grid(row=0, column=1)
    temperatura_corporal.grid(row=1, column=1)
    humedad.grid(row=2, column=1)
    edad.grid(row=3, column=1)
    
    # Botón para predecir
    def predecir_celo():
        try:
            # Obtener los valores de las entradas
            actividad = float(actividad_fisica.get())
            temperatura = float(temperatura_corporal.get())
            humedad_val = float(humedad.get())
            edad_val = float(edad.get())
            
            # Preparar los datos para la predicción
            datos_prediccion = pd.DataFrame({
                'actividad_fisica': [actividad],
                'temperatura_corporal': [temperatura],
                'humedad': [humedad_val],
                'edad': [edad_val]
            })
            
            # Realizar la predicción
            resultado = modelo.predict(datos_prediccion)
            
            # Mostrar el resultado
            resultado_label = tk.Label(ventana, text=f"Predicción: {resultado[0]}")
            resultado_label.grid(row=5, column=1)
        except ValueError:
            print("Por favor, ingrese valores numéricos.")
    
    tk.Button(ventana, text="Predecir Celos", command=predecir_celo).grid(row=4, column=1)
    
    ventana.mainloop()

