from django.db import models
from django.contrib.auth.models import AbstractUser

class Vaca(models.Model):
    RAZAS = [
        ('SIB', 'Siboney de Cuba'),
        ('MAM', 'Mambi de Cuba'),
        ('TAI', 'Taino'),
        ('CRI', 'Criolla'),
        ('CEB', 'Cebu'),
        ('CRU', 'Cruzamiento'),
        ('CHA', 'Chacuba'),
        ('HOL', 'Holstein'),
    ]
    nombre = models.CharField(max_length=50, verbose_name="Nombre de la vaca")
    actividad = models.IntegerField(verbose_name="Actividad física (pasos/día)")
    temperatura = models.FloatField(verbose_name="Temperatura corporal (°C)")
    dias_posparto = models.IntegerField(verbose_name="Días posparto")
    condicion = models.FloatField(verbose_name="Condición corporal (1-5)")
    raza = models.CharField(max_length=3, choices=RAZAS)
    parto_asistido = models.BooleanField(verbose_name="¿Tuvo parto asistido previo?")
    prediccion = models.FloatField(verbose_name="Probabilidad de celo (%)")
    fecha = models.DateTimeField(auto_now_add=True)
    inseminada = models.BooleanField(default=False)
    fecha_inseminacion = models.DateTimeField(null=True, blank=True)
    gestante = models.BooleanField(default=False, verbose_name="¿Está gestante?")
    fecha_gestacion = models.DateTimeField(null=True, blank=True)


    def __str__(self):
        return f"Vaca {self.id} - {self.get_raza_display()} ({self.fecha.strftime('%d/%m/%Y %H:%M')})"

class CustomUser(AbstractUser):
    ROLES = (
        ('admin', 'Administrador'),
        ('user', 'Usuario Regular'),
    )
    role = models.CharField(max_length=20, choices=ROLES, default='user')
    farm = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
