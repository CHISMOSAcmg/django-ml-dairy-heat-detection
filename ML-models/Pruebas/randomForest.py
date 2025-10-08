import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Razas específicas para el dataset
razas = [
    'Siboney de Cuba',
    'Mambi de Cuba',
    'Taino',
    'Criolla',
    'Cebu',
    'Cruzamiento',
    'Chacuba',
    'Holstein'
]

N = 2000  # Número de muestras sintéticas

# Parámetros de generación
actividad_media = 100
actividad_std = 20

np.random.seed(42)
data = {
    'actividad': np.clip(np.random.normal(actividad_media, actividad_std, N), 60, 160),
    'temperatura': np.round(np.random.uniform(37.5, 40.5, N), 1),
    'dias_posparto': np.random.randint(20, 150, N),
    'condicion_corporal': np.round(np.random.uniform(1, 5, N), 1),
    'raza': np.random.choice(razas, N),
    'parto_asistido': np.random.choice([0, 1], N, p=[0.8, 0.2]),
}

df = pd.DataFrame(data)

# Lógica sintética para la presencia de celo posparto
def calcular_celo(row):
    score = 0
    if 38.0 <= row['temperatura'] <= 39.5:
        score += 1
    if 2.5 <= row['condicion_corporal'] <= 3.5:
        score += 1
    if row['actividad'] > 110:
        score += 1
    if row['dias_posparto'] > 40:
        score += 1
    if row['parto_asistido'] == 0:
        score += 1
    if row['raza'] in ['Holstein', 'Siboney de Cuba']:
        score += 0.5
    return int(score >= 3)

df['celo_posparto'] = df.apply(calcular_celo, axis=1)

# Validación de rangos
assert df['temperatura'].between(37.5, 40.5).all()
assert df['condicion_corporal'].between(1, 5).all()

# Preprocesamiento para el modelo
X = df[['actividad', 'temperatura', 'dias_posparto', 'condicion_corporal', 'raza', 'parto_asistido']]
y = df['celo_posparto']
X = pd.get_dummies(X, columns=['raza'])

# División en entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Entrenamiento Random Forest
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

# Evaluación
y_pred = rf.predict(X_test)
print(classification_report(y_test, y_pred))

# Guardar el modelo entrenado
import joblib
joblib.dump(rf, 'modelo_celo_posparto_rf.pkl')

