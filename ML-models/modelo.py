import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import OneHotEncoder

# 1. Cargar los datos
try:
    df = pd.read_csv('\Vacas_mejoradas.csv')
    print("Datos cargados correctamente.")
except FileNotFoundError:
    print("Error: El archivo 'vacas_mejoradas.csv' no se encuentra.")
    exit()  # Salir del script si el archivo no se encuentra

# 2. Visualizar los primeros registros
print(df.head())

# 3. Seleccionar solo las columnas numéricas para calcular la matriz de correlación
numerical_df = df.select_dtypes(include=['number'])

# Calcular la matriz de correlación (solo variables numéricas)
correlation_matrix = numerical_df.corr()

# Visualizar la matriz de correlación (solo variables numéricas)
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm')
plt.title('Matriz de Correlación (Solo Variables Numéricas)')
plt.show()

# 4. Si deseas incluir las categorías, aplica One-Hot Encoding
categorical_cols = df.select_dtypes(include=['object']).columns

if len(categorical_cols) > 0:
    # Aplicar One-Hot Encoding a las columnas categóricas
    one_hot_encoder = OneHotEncoder(handle_unknown='ignore', sparse=False)
    encoded_categorical = one_hot_encoder.fit_transform(df[categorical_cols])

    # Crear un DataFrame con las columnas codificadas
    encoded_df = pd.DataFrame(encoded_categorical, columns=one_hot_encoder.get_feature_names_out(categorical_cols))

    # Eliminar las columnas originales categóricas del DataFrame original
    df_numeric = df.drop(columns=categorical_cols)

    # Combinar el DataFrame original con las columnas codificadas
    df_numeric = pd.concat([df_numeric.reset_index(drop=True), encoded_df.reset_index(drop=True)], axis=1)

    # Calcular la matriz de correlación (incluyendo categorías codificadas)
    correlation_matrix_encoded = df_numeric.corr()

    # Visualizar la matriz de correlación (incluyendo categorías codificadas)
    sns.heatmap(correlation_matrix_encoded, annot=True, cmap='coolwarm')
    plt.title('Matriz de Correlación (Con Variables Codificadas)')
    plt.show()
