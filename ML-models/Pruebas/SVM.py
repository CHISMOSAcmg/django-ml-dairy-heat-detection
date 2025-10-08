import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, roc_curve, auc, roc_auc_score

# 1. Cargar datos
df = pd.read_csv('datos_vacas_limpios.csv')

# 2. Preprocesamiento: codificar variables categóricas
X = pd.get_dummies(df.drop('celo', axis=1), columns=['raza'])
y = df['celo']

# 3. División de datos
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# 4. Escalado de características
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 5. Entrenamiento del modelo SVM
model_svm = SVC(
    kernel='rbf',
    C=1.0,
    gamma='scale',
    class_weight='balanced',
    probability=True,
    random_state=42
)
model_svm.fit(X_train_scaled, y_train)

# 6. Evaluación
y_pred = model_svm.predict(X_test_scaled)
y_proba = model_svm.predict_proba(X_test_scaled)[:, 1]

print("=== Reporte de Clasificación ===")
print(classification_report(y_test, y_pred, target_names=['No Celo', 'Celo']))
print(f"AUC-ROC: {roc_auc_score(y_test, y_proba):.2%}")

# 7. Matriz de Confusión
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(6,4))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=['No Celo', 'Celo'],
            yticklabels=['No Celo', 'Celo'])
plt.title("Matriz de Confusión - SVM")
plt.xlabel('Predicho')
plt.ylabel('Real')
plt.show()

# 8. Curva ROC
fpr, tpr, _ = roc_curve(y_test, y_proba)
roc_auc = auc(fpr, tpr)
plt.figure(figsize=(6,4))
plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'Curva ROC (AUC = {roc_auc:.2f})')
plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
plt.xlabel('Tasa de Falsos Positivos')
plt.ylabel('Tasa de Verdaderos Positivos')
plt.title('Curva ROC - SVM')
plt.legend()
plt.show()

# 9. Validación cruzada (opcional)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(model_svm, scaler.fit_transform(X), y, cv=cv, scoring='f1_macro')
print(f"F1-Score (Validación Cruzada): {np.mean(cv_scores):.2%} ± {np.std(cv_scores):.2%}")
