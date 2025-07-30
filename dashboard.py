import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# Load CSV
df = pd.read_csv('brawl_data.csv')
print(df)

# Plot 1: Trophies per Player
sns.barplot(x='Player', y='Trophies', data=df)
plt.title('Trophies per Player')
plt.show()

# Plot 2: Win Rate
sns.barplot(x='Player', y='WinRate', data=df)
plt.title('Win Rate % per Player')
plt.show()
