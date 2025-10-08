# 🐄 CeloPredictor: Machine Learning for Postpartum Heat Detection in Dairy Cows

*Sistema informático de apoyo a la eficiencia reproductiva en vacas lecheras mediante inteligencia artificial*

## 📋 Descripción del Proyecto

**CeloPredictor** es una aplicación de escritorio desarrollada como trabajo de diploma que utiliza técnicas de inteligencia artificial para predecir la presentación de celo posparto en vacas lecheras. La solución está específicamente adaptada a las condiciones tecnológicas y productivas de la ganadería cubana, con énfasis en la provincia de Camagüey.

## 🎯 Características Principales

- ✅ **Modelo Predictivo Avanzado**: Random Forest con F1-Score de 0.85 ± 0.02
- ✅ **Arquitectura Full-Stack**: Django REST API + React Frontend + Electron Desktop
- ✅ **Funcionalidad Offline**: Aplicación de escritorio que no requiere conexión a internet
- ✅ **Gestión Completa**: Usuarios, vacas, historial reproductivo y predicciones
- ✅ **Interfaz Intuitiva**: Diseñada para productores ganaderos con diversa experiencia tecnológica
- ✅ **Validación Estadística Rigurosa**: Pruebas de Friedman, Nemenyi y Wilcoxon

## 🏆 Resultados del Modelo

| Métrica | Valor | Descripción |
|---------|-------|-------------|
| **F1-Score** | 0.85 ± 0.02 | Balance óptimo entre precisión y recall |
| **AUC-ROC** | 0.91 | Excelente capacidad discriminativa |
| **Precisión** | 87% | Efectividad en predicciones correctas |
| **Sensibilidad** | 89% | Detección de celos reales |
| **Especificidad** | 84% | Identificación de ausencia de celo |

## 🛠️ Stack Tecnológico

### **Backend & API**
- **Python 3.11** - Lenguaje principal
- **Django & Django REST Framework** - API RESTful
- **SQLite** - Base de datos local
- **Scikit-learn** - Algoritmos de Machine Learning
- **Pandas, NumPy** - Procesamiento de datos

### **Frontend & Desktop**
- **React.js** - Interfaz de usuario
- **Electron** - Empaquetado desktop
- **HTML5/CSS3/JavaScript** - Tecnologías web

### **Machine Learning**
- **Random Forest** - Algoritmo principal (F1-Score: 0.85)
- **Redes Neuronales** - Alternativa (F1-Score: 0.83)
- **SVM** - Comparación (F1-Score: 0.82)
- **Regresión Logística** - Baseline (F1-Score: 0.78)

## 📊 Dataset y Metodología

### **Estructura del Dataset Sintético**
- **2,000 registros** de ciclos reproductivos
- **Variables clave**: Actividad física, temperatura corporal, días posparto, condición corporal, raza, parto asistido
- **Balance de clases**: Técnica SMOTE aplicada
- **Validación**: 80% entrenamiento - 20% prueba con cross-validation

### **Proceso Científico**
1. **Análisis exploratorio** y preprocesamiento
2. **Comparación de algoritmos** con validación estadística
3. **Optimización de hiperparámetros**
4. **Validación cruzada estratificada** (5-folds)
5. **Pruebas estadísticas** (Friedman, Nemenyi, Wilcoxon)

## 🚀 Instalación y Uso

### **Prerrequisitos**
- Python 3.11
- Node.js 16+
- npm

### **Ejecución de la Aplicación**

```bash
# Backend Django
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend React
cd frontend
npm install
npm start

# Versión Desktop
npm run electron:dev
```

### **Entrenamiento del Modelo**
```bash
cd ml_model
python train_model.py
python evaluate_model.py
```

## 🏗️ Arquitectura del Sistema

```
CeloPredictor/
├── 📊 ml_model/           # Modelos de Machine Learning
├── 🚀 backend/            # Django REST API
├── 💻 frontend/           # React Application
├── 🖥️ electron/           # Configuración Desktop
└── 📚 docs/              # Documentación
```

### **Patrones de Diseño**
- **MVC (Modelo-Vista-Controlador)**
- **Cliente-Servidor** (comunicación local)
- **Singleton** para gestión de recursos
- **Fachada** para simplificación de API

## 📈 Funcionalidades Principales

### **Gestión de Usuarios**
- Autenticación y autorización por roles
- CRUD completo de usuarios (Admin/Productor)

### **Predicción de Celo**
- Formulario intuitivo para ingreso de datos
- Resultados en tiempo real con probabilidades
- Historial de predicciones por animal

### **Gestión de Animales**
- Registro de vacas y atributos zootécnicos
- Seguimiento de historial reproductivo
- Reevaluación de predicciones

### **Reportes y Análisis**
- Dashboard informativo
- Métricas de eficiencia reproductiva
- Exportación de datos

## 🔬 Validación Científica

### **Pruebas Estadísticas Aplicadas**
- **Test de Friedman**: χ² = 15.4 (p < 0.001)
- **Post-hoc Nemenyi**: Diferencias significativas entre algoritmos
- **Wilcoxon**: Superioridad estadística de Random Forest
- **Intervalos de Confianza 95%**: Robustez en resultados

### **Comparativa de Algoritmos**
| Algoritmo | F1-Score | AUC-ROC | Precisión |
|-----------|----------|---------|-----------|
| Random Forest | **0.85** | **0.91** | **87%** |
| Red Neuronal | 0.83 | 0.90 | 86% |
| SVM | 0.82 | 0.88 | 84% |
| Regresión Logística | 0.78 | 0.89 | 85% |

## 🌍 Contexto y Aplicación

### **Problema Resuelto**
- **Detección tradicional**: ≤65% de eficiencia
- **Celos silentes**: 34% en vacas Mambí de Cuba
- **Limitaciones tecnológicas**: Entornos rurales sin conectividad

### **Impacto Esperado**
- ✅ Reducción de días abiertos
- ✅ Mejora de tasa de preñez
- ✅ Optimización de inseminación artificial
- ✅ Modernización de la ganadería camagüeyana

## 🔮 Roadmap Futuro

- [ ] Integración con sensores IoT de bajo costo
- [ ] Aplicación móvil complementaria
- [ ] Modelos de series temporales
- [ ] Análisis predictivo avanzado
- [ ] Plataforma web para cooperativas

## 👨‍💻 Autor

**Fernando Javier García Estrada**  
*Trabajo de Diploma - Universidad de Camagüey "Ignacio Agramonte y Loynaz"*

### **Contacto**
- 📧 Email: fernandojavierge@gmail.com

---

**⭐ Si este proyecto te resulta útil para tu investigación o desarrollo, por favor considera darle una estrella en GitHub!**

---
*Desarrollado con Python 3.11, Django, React y Electron - 2025*  
