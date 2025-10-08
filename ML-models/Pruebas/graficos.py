import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import tkinter as tk
from tkinter.scrolledtext import ScrolledText
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

# Cargar y preparar datos (igual que antes)
df = pd.read_csv('datos_vacas2.csv')

Q1 = df['actividad_fisica'].quantile(0.25)
Q3 = df['actividad_fisica'].quantile(0.75)
IQR = Q3 - Q1
df = df[(df['actividad_fisica'] >= Q1 - 1.5*IQR) & (df['actividad_fisica'] <= Q3 + 1.5*IQR)]

df = pd.get_dummies(df, columns=['raza'], drop_first=True)

scaler = StandardScaler()
features = ['actividad_fisica', 'temperatura_corporal', 'dias_posparto', 'condicion_corporal']
df[features] = scaler.fit_transform(df[features])

X = df.drop('celo', axis=1)
y = df['celo']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)

model = RandomForestClassifier(n_estimators=150, max_depth=5, class_weight='balanced', random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

# Funciones para mostrar resultados en ventanas separadas
def mostrar_texto(titulo, texto):
    ventana = tk.Toplevel(root)
    ventana.title(titulo)
    ventana.geometry("800x400")
    st = ScrolledText(ventana, wrap=tk.WORD, font=("Consolas", 12))
    st.pack(expand=True, fill='both')
    st.insert(tk.END, texto)
    st.config(state='disabled')

def mostrar_grafico(titulo, fig):
    ventana = tk.Toplevel(root)
    ventana.title(titulo)
    ventana.geometry("900x600")
    canvas = FigureCanvasTkAgg(fig, master=ventana)
    canvas.draw()
    canvas.get_tk_widget().pack(expand=True, fill='both')

# Crear gráficos para mostrar cuando se pulse el botón
def grafico_matriz_confusion():
    fig, ax = plt.subplots(figsize=(6,4))
    sns.heatmap(confusion_matrix(y_test, y_pred), annot=True, fmt='d', cmap='Blues', cbar=False, ax=ax)
    ax.set_title('Matriz de Confusión')
    ax.set_xlabel('Predicho')
    ax.set_ylabel('Real')
    mostrar_grafico("Matriz de Confusión", fig)

def grafico_importancia_variables():
    importancia = pd.Series(model.feature_importances_, index=X.columns).sort_values(ascending=True)
    fig, ax = plt.subplots(figsize=(8,5))
    importancia.plot(kind='barh', ax=ax, color='teal')
    ax.set_title('Importancia de Variables para la Predicción')
    ax.set_xlabel('Importancia Relativa')
    mostrar_grafico("Importancia de Variables", fig)

def grafico_histograma_temp():
    fig, ax = plt.subplots(figsize=(8,5))
    sns.histplot(df['temperatura_corporal'], bins=15, kde=True, ax=ax)
    ax.set_title('Distribución de Temperatura Corporal')
    ax.set_xlabel('Temperatura (normalizada)')
    ax.set_ylabel('Frecuencia')
    mostrar_grafico("Histograma Temperatura Corporal", fig)

def grafico_boxplot_actividad():
    fig, ax = plt.subplots(figsize=(8,5))
    sns.boxplot(x=df['actividad_fisica'], color='skyblue', flierprops=dict(markerfacecolor='r', marker='D'), ax=ax)
    ax.set_title('Boxplot de Actividad Física')
    ax.set_xlabel('Actividad Física (normalizada)')
    mostrar_grafico("Boxplot Actividad Física", fig)

def grafico_scatter_dias_actividad():
    fig, ax = plt.subplots(figsize=(8,5))
    sns.scatterplot(x='dias_posparto', y='actividad_fisica', data=df, hue='celo', palette={0:'blue',1:'red'}, size='temperatura_corporal', sizes=(20,200), ax=ax)
    ax.set_title('Días Posparto vs Actividad Física')
    ax.set_xlabel('Días Posparto (normalizado)')
    ax.set_ylabel('Actividad Física (normalizada)')
    ax.legend(title='Celo Detectado', bbox_to_anchor=(1.05, 1), loc='upper left')
    mostrar_grafico("Scatterplot Días Posparto vs Actividad Física", fig)

def mostrar_reporte():
    reporte = classification_report(y_test, y_pred)
    mostrar_texto("Reporte de Clasificación", reporte)

# Ventana principal con botones
root = tk.Tk()
root.title("Resultados Predicción Celo Posparto")
root.geometry("400x400")

tk.Label(root, text="Seleccione el resultado a mostrar:", font=("Arial", 14)).pack(pady=10)

btn_reporte = tk.Button(root, text="Reporte de Clasificación", command=mostrar_reporte, width=30)
btn_reporte.pack(pady=5)

btn_matriz = tk.Button(root, text="Matriz de Confusión", command=grafico_matriz_confusion, width=30)
btn_matriz.pack(pady=5)

btn_importancia = tk.Button(root, text="Importancia de Variables", command=grafico_importancia_variables, width=30)
btn_importancia.pack(pady=5)

btn_histograma = tk.Button(root, text="Histograma Temperatura", command=grafico_histograma_temp, width=30)
btn_histograma.pack(pady=5)

btn_boxplot = tk.Button(root, text="Boxplot Actividad Física", command=grafico_boxplot_actividad, width=30)
btn_boxplot.pack(pady=5)

btn_scatter = tk.Button(root, text="Scatterplot Días vs Actividad", command=grafico_scatter_dias_actividad, width=30)
btn_scatter.pack(pady=5)

root.mainloop()
