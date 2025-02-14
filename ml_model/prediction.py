import pandas as pd
import matplotlib.pyplot as plt
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import StandardScaler
import numpy as np

# Load the CSV data
csv_file_path = 'C:\\Users\\Admin\\Downloads\\AQI\\dump.csv'
print(f"Loading data from {csv_file_path}")
data = pd.read_csv(csv_file_path)
print("Data loaded successfully")

# Ensure the data has the necessary columns
if not {'CO2', 'humidity', 'temperature'}.issubset(data.columns):
    raise ValueError("CSV file must contain 'CO2', 'humidity', and 'temperature' columns")
print("Data contains necessary columns")

# Prepare data for BPNN model
features = data[['CO2', 'humidity', 'temperature']]
scaler = StandardScaler()
scaled_features = scaler.fit_transform(features)
print("Data scaled for BPNN model")

# Split data into training and testing sets
train_size = int(len(scaled_features) * 0.8)
train_features, test_features = scaled_features[:train_size], scaled_features[train_size:]
train_target, test_target = data['CO2'][:train_size], data['CO2'][train_size:]
print("Data split into training and testing sets")

# Apply BPNN model on CO2 prediction
print("Applying BPNN model on CO2 prediction")
bpnn_model = MLPRegressor(hidden_layer_sizes=(100,), max_iter=500)
bpnn_model.fit(train_features, train_target)
co2_forecast = bpnn_model.predict(test_features)
print("BPNN model applied successfully")

# Calculate AQI (simplified example)
def calculate_aqi(co2, humidity, temperature):
    return 0.5 * co2 + 0.3 * humidity + 0.2 * temperature

data['AQI'] = data.apply(lambda row: calculate_aqi(row['CO2'], row['humidity'], row['temperature']), axis=1)
print("AQI calculated")

# Visualize the results
plt.figure(figsize=(12, 6))

# Plot CO2 predictions
plt.subplot(2, 1, 1)
plt.plot(data.index, data['CO2'], label='Actual CO2')
plt.plot(data.index[-len(co2_forecast):], co2_forecast, label='BPNN CO2 Forecast', linestyle='--')
plt.legend()
plt.title('CO2 Predictions')

# Plot AQI
plt.subplot(2, 1, 2)
plt.plot(data.index, data['AQI'], label='AQI')
plt.legend()
plt.title('AQI')

plt.tight_layout()
plt.show()
print("Visualization complete")