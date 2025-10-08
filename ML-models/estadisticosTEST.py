import numpy as np
import pandas as pd
from scipy.stats import friedmanchisquare, wilcoxon
import scikit_posthocs as sp

# DataFrame con los resultados
df_scores = pd.DataFrame({
    'LogisticRegression': lr_scores,
    'RandomForest': rf_scores,
    'SVM': svm_scores,
    'MLP': mlp_scores
})

# 1. Test de Friedman (comparación global)
stat, p = friedmanchisquare(lr_scores, rf_scores, svm_scores, mlp_scores)
print(f'Friedman Test: stat={stat:.3f}, p={p:.3f}')

# 2. Test de Nemenyi (post-hoc)
# scikit-posthocs espera un array de scores (n_models x n_folds)
scores_matrix = df_scores.values.T  # Cada fila es un modelo, cada columna un fold
p_values = sp.posthoc_nemenyi_friedman(scores_matrix)
print('\nNemenyi Test (p-values):')
print(pd.DataFrame(p_values, index=df_scores.columns, columns=df_scores.columns))

# 3. Test de Wilcoxon (comparación por pares, ejemplo entre RandomForest y Redes Neuronales)
stat, p = wilcoxon(rf_scores, lr_scores)
print(f'\nWilcoxon Test (RandomForest vs RedesNeuronales): stat={stat:.3f}, p={p:.3f}')
