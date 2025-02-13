import pickle
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load the saved model
with open(r"C:\Users\Vinit Solanki\OneDrive\Documents\VESIT Files\AQI_Prediction\ml_model\aqi_model.pkl", "rb") as file:
    model = pickle.load(file)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json  # Get JSON input from request
    
    # Extract feature values from JSON request
    features = np.array([[data["pm25"], data["pm10"], data["co"], data["no2"], data["so2"], data["o3"]]])

    # Make Prediction
    predicted_aqi = model.predict(features)[0]

    return jsonify({"aqi": round(predicted_aqi, 2)})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
