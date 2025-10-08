import tensorflow as tf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, roc_curve, auc, roc_auc_score

# 1. Cargar datos
df = pd.read_csv('datos_vacas_limpios.csv')

# 2. Preprocesamiento
X = pd.get_dummies(df.drop('celo', axis=1), columns=['raza'])
y = df['celo']

# 3. División de datos
X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=0.3, 
    stratify=y, 
    random_state=42
)

# 4. Escalado de características
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 5. Construcción del modelo
model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation='relu', input_shape=(X_train_scaled.shape[1],)),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

# 6. Compilación
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss='binary_crossentropy',
    metrics=[tf.keras.metrics.AUC(name='auc')]
)

# 7. Entrenamiento con early stopping
early_stop = tf.keras.callbacks.EarlyStopping(
    monitor='val_loss',
    patience=20,
    restore_best_weights=True
)

history = model.fit(
    X_train_scaled, y_train,
    epochs=500,
    batch_size=8,
    validation_split=0.2,
    callbacks=[early_stop],
    verbose=1
)

# 8. Evaluación
y_pred = (model.predict(X_test_scaled) > 0.5).astype("int32")
y_proba = model.predict(X_test_scaled)

print("\n=== Reporte de Clasificación ===")
print(classification_report(y_test, y_pred, target_names=['No Celo', 'Celo']))
print(f"AUC-ROC: {roc_auc_score(y_test, y_proba):.2%}")

# 9. Visualización del entrenamiento
plt.figure(figsize=(12, 4))
plt.subplot(1, 2, 1)
plt.plot(history.history['loss'], label='Entrenamiento')
plt.plot(history.history['val_loss'], label='Validación')
plt.title('Pérdida durante el Entrenamiento')
plt.xlabel('Época')
plt.ylabel('Pérdida')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(history.history['auc'], label='Entrenamiento')
plt.plot(history.history['val_auc'], label='Validación')
plt.title('AUC durante el Entrenamiento')
plt.xlabel('Época')
plt.ylabel('AUC')
plt.legend()
plt.tight_layout()
plt.show()

# 10. Matriz de Confusión
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(6,4))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=['No Celo', 'Celo'],
            yticklabels=['No Celo', 'Celo'])
plt.title("Matriz de Confusión - Red Neuronal")
plt.xlabel('Predicho')
plt.ylabel('Real')
plt.show()

# 11. Curva ROC
fpr, tpr, _ = roc_curve(y_test, y_proba)
roc_auc = auc(fpr, tpr)
plt.figure(figsize=(6,4))
plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'Curva ROC (AUC = {roc_auc:.2f})')
plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
plt.xlabel('Tasa de Falsos Positivos')
plt.ylabel('Tasa de Verdaderos Positivos')
plt.title('Curva ROC - Red Neuronal')
plt.legend()
plt.show()

# 12. Guardar modelo
model.save('modelo_red_neuronal.h5')
print("\nModelo guardado como 'modelo_red_neuronal.h5'")
