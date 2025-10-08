# PREDICCIÓN DE CELOS POSPARTO EN VACAS - MODELO FINAL
# =====================================================

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV
from sklearn.metrics import classification_report, confusion_matrix, roc_curve, auc, accuracy_score, recall_score, f1_score, roc_auc_score
from imblearn.pipeline import Pipeline
from imblearn.over_sampling import SMOTE
import joblib

# Configuración
sns.set_theme(style="whitegrid")
plt.rcParams['font.family'] = 'Arial'

# 1. Carga y validación de datos
def cargar_datos(ruta: str) -> pd.DataFrame:
    """Carga y verifica estructura básica del dataset."""
    try:
        df = pd.read_csv(ruta)
        required_cols = [
            'actividad_fisica', 'temperatura_corporal',
            'dias_posparto', 'condicion_corporal', 'raza', 'celo'
        ]
        
        if not all(col in df.columns for col in required_cols):
            missing = [col for col in required_cols if col not in df.columns]
            raise ValueError(f"Columnas faltantes: {missing}")
            
        # Verificación de balance mínimo
        class_counts = df['celo'].value_counts()
        if class_counts.min() < 10:
            raise ValueError(f"Muy pocas muestras: {class_counts.to_dict()}")
            
        return df
    except Exception as e:
        print(f"Error crítico: {str(e)}")
        exit()

df = cargar_datos('datos_vacas_limpios.csv')

# 2. Preprocesamiento
numeric_features = ['actividad_fisica', 'temperatura_corporal', 
                   'dias_posparto', 'condicion_corporal']
categorical_features = ['raza']

preprocessor = ColumnTransformer([
    ('num', StandardScaler(), numeric_features),
    ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
])

# 3. Pipeline con SMOTE dinámico
def get_safe_smote(y):
    """Ajusta automáticamente k_neighbors según las muestras disponibles"""
    min_class = y.value_counts().min()
    return SMOTE(
        k_neighbors=min(3, max(1, min_class - 1)),  # Máximo 3 vecinos
        random_state=42,
        sampling_strategy='minority'
    )

pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('smote', get_safe_smote(df['celo'])),
    ('model', LogisticRegression(
        class_weight='balanced',
        max_iter=5000,
        tol=1e-6,
        random_state=42
    ))
])

# 4. División estratificada
X = df.drop('celo', axis=1)
y = df['celo']
X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=0.2,  # 20% para test
    stratify=y,
    random_state=42
)

# 5. Búsqueda de hiperparámetros segura
param_grid = {
    'model__C': [0.01, 0.1, 1, 10],
    'model__penalty': ['l1', 'l2'],
    'model__solver': ['liblinear', 'saga']
}

grid_search = GridSearchCV(
    pipeline,
    param_grid,
    cv=StratifiedKFold(n_splits=3, shuffle=True, random_state=42),
    scoring='f1_macro',
    error_score='raise',
    n_jobs=-1
)

# 6. Entrenamiento con manejo de errores
try:
    grid_search.fit(X_train, y_train)
except Exception as e:
    print(f"Error durante el entrenamiento: {str(e)}")
    exit()

# 7. Evaluación del modelo
best_model = grid_search.best_estimator_
y_pred = best_model.predict(X_test)
y_proba = best_model.predict_proba(X_test)[:, 1]

# 8. Visualización profesional
def plot_confusion_matrix(y_true, y_pred):
    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(8,6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                annot_kws={'size':14, 'color':'white'}, 
                cbar=False,
                linewidths=0.5)
    plt.title('Matriz de Confusión', fontsize=16, pad=20)
    plt.xlabel('Predicho', fontsize=12, labelpad=15)
    plt.ylabel('Real', fontsize=12, labelpad=15)
    plt.xticks(fontsize=10)
    plt.yticks(fontsize=10)
    plt.show()

def plot_roc_curve(y_true, y_proba):
    fpr, tpr, _ = roc_curve(y_true, y_proba)
    roc_auc = auc(fpr, tpr)
    
    plt.figure(figsize=(8,6))
    plt.plot(fpr, tpr, color='#2ecc71', lw=3, 
             label=f'Curva ROC (AUC = {roc_auc:.2f})')
    plt.plot([0, 1], [0, 1], color='#e74c3c', lw=3, linestyle='--')
    plt.xlabel('Tasa de Falsos Positivos', fontsize=12, labelpad=15)
    plt.ylabel('Tasa de Verdaderos Positivos', fontsize=12, labelpad=15)
    plt.title('Curva ROC', fontsize=16, pad=20)
    plt.legend(loc="lower right", fontsize=12)
    plt.grid(alpha=0.3)
    plt.show()

# 9. Resultados
print("\n=== Mejores Parámetros ===")
print(grid_search.best_params_)

print("\n=== Reporte de Clasificación ===")
print(classification_report(y_test, y_pred, zero_division=1))

print("\n=== Métricas Clave ===")
print(f"- Precisión: {accuracy_score(y_test, y_pred):.2%}")
print(f"- Sensibilidad: {recall_score(y_test, y_pred):.2%}")
print(f"- Especificidad: {recall_score(y_test, y_pred, pos_label=0):.2%}")
print(f"- F1-Score: {f1_score(y_test, y_pred):.2%}")
print(f"- AUC-ROC: {roc_auc_score(y_test, y_proba):.2%}")

plot_confusion_matrix(y_test, y_pred)
plot_roc_curve(y_test, y_proba)

# 10. Exportar modelo
joblib.dump(best_model, 'modelo_celo_final.pkl')
print("\nModelo exportado como 'modelo_celo_final.pkl'")
