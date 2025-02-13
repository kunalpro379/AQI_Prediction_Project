import streamlit as st
import numpy as np
import requests

# Title
st.title("Real-Time AQI Prediction System")

# User Input for Sensor Data
st.sidebar.header("Enter Sensor Data")
pm25 = st.sidebar.number_input("PM2.5 (µg/m³)", min_value=0.0, step=0.1)
pm10 = st.sidebar.number_input("PM10 (µg/m³)", min_value=0.0, step=0.1)
co = st.sidebar.number_input("CO (mg/m³)", min_value=0.0, step=0.1)
no2 = st.sidebar.number_input("NO2 (µg/m³)", min_value=0.0, step=0.1)
so2 = st.sidebar.number_input("SO2 (µg/m³)", min_value=0.0, step=0.1)
o3 = st.sidebar.number_input("O3 (µg/m³)", min_value=0.0, step=0.1)

# Function to categorize AQI
def classify_aqi(aqi):
    if aqi <= 50:
        return "Good (Green)"
    elif aqi <= 100:
        return "Moderate (Yellow)"
    elif aqi <= 150:
        return "Unhealthy for Sensitive Groups (Orange)"
    elif aqi <= 200:
        return "Unhealthy (Red)"
    elif aqi <= 300:
        return "Very Unhealthy (Purple)"
    else:
        return "Hazardous (Maroon)"

# Button to Predict
if st.sidebar.button("Predict AQI"):
    # Send input data to backend API for model inference
    data = {"pm25": pm25, "pm10": pm10, "co": co, "no2": no2, "so2": so2, "o3": o3}
    response = requests.post("http://127.0.0.1:5000/predict", json=data)  # Adjust API URL
    
    if response.status_code == 200:
        predicted_aqi = response.json()["aqi"]
        category = classify_aqi(predicted_aqi)
        
        # Display Prediction
        st.subheader(f"Predicted AQI: {predicted_aqi}")
        st.markdown(f"### AQI Category: **{category}**")
    else:
        st.error("Error: Could not fetch AQI prediction.")

# Run with: streamlit run app.py
