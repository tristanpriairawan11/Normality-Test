import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from services.statistics import calculate_normality, get_recommended_method

data = [12, 15, 18, 17, 22, 19, 21, 14, 16, 20]

methods = [
    "Jarque Bera", "Skewness Kurtosis", "Shapiro Wilk", "Lilliefors",
    "Cramer Von Mises", "Anderson Darling", "Kolmogorov Smirnov",
    "Ryan Joiner", "Shapiro Francia"
]

print("Recommended method for N=10:", get_recommended_method(len(data)))

for m in methods:
    stat, p, name = calculate_normality(data, m)
    print(f"{name}: stat={stat:.4f}, p={p:.4f}")
