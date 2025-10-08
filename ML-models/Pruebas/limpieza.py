import pandas as pd
from sklearn.preprocessing import StandardScaler

# Cargar datos
df = pd.read_csv('datos_vacas2.csv')

# 1. Manejo de valores faltantes
# Imputar temperatura corporal con la media
df['temperatura_corporal'].fillna(df['temperatura_corporal'].mean(), inplace=True)
# Eliminar filas con valores faltantes críticos en actividad_fisica o celo
df.dropna(subset=['actividad_fisica', 'celo'], inplace=True)

# 2. Eliminación de duplicados
df.drop_duplicates(inplace=True)

# 3. Detección y tratamiento de valores atípicos (outliers) en actividad física
Q1 = df['actividad_fisica'].quantile(0.25)
Q3 = df['actividad_fisica'].quantile(0.75)
IQR = Q3 - Q1
df = df[(df['actividad_fisica'] >= Q1 - 1.5*IQR) & (df['actividad_fisica'] <= Q3 + 1.5*IQR)]

# 4. Estandarización de variables numéricas
scaler = StandardScaler()
numericas = ['actividad_fisica', 'temperatura_corporal', 'dias_posparto', 'condicion_corporal']
df[numericas] = scaler.fit_transform(df[numericas])

# 5. Codificación de variables categóricas (one-hot encoding)
if 'raza' in df.columns:
    df = pd.get_dummies(df, columns=['raza'], drop_first=True)

# 6. Validación del proceso de limpieza
print("Resumen del DataFrame después de la limpieza:\n")
print(df.info())
print("\nDescripción estadística:\n")
print(df.describe())
print("\nValores nulos por columna:\n")
print(df.isnull().sum())
print("\nPrimeras filas del DataFrame limpio:\n")
print(df.head())
