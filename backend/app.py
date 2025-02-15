from flask import Flask, jsonify, request
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import firebase_admin
from firebase_admin import credentials, db
import joblib
import datetime
import json
from flask_cors import CORS
from firebase_admin import credentials, db

if not firebase_admin._apps:  # Ensure Firebase is initialized only once
    cred = credentials.Certificate(r"C:\Users\Vinit Solanki\OneDrive\Documents\VESIT Files\AQI_Prediction\backend\aqi-iot-1d315-firebase-adminsdk-fbsvc-e3649204b1.json")
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://aqi-iot-1d315-default-rtdb.firebaseio.com/'
    })
    print("Firebase initialized successfully")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize Firebase with error handling
try:
    cred = credentials.Certificate(r"C:\Users\Vinit Solanki\OneDrive\Documents\VESIT Files\AQI_Prediction\backend\aqi-iot-1d315-firebase-adminsdk-fbsvc-e3649204b1.json")
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://aqi-iot-1d315-default-rtdb.firebaseio.com/'
    })
    print("Firebase initialized successfully")
except Exception as e:
    print(f"Firebase initialization error: {str(e)}")

# Load the trained model
try:
    model = joblib.load('aqi_model.pkl')
    print("Model loaded successfully")
except Exception as e:
    print(f"Model loading error: {str(e)}")

def get_aqi_category(aqi):
    if aqi <= 50:
        return "Good"
    elif aqi <= 100:
        return "Moderate"
    elif aqi <= 150:
        return "Unhealthy for Sensitive Groups"
    elif aqi <= 200:
        return "Unhealthy"
    else:
        return "Hazardous"

@app.route('/current-aqi', methods=['GET'])
def get_current_aqi():
    try:
        # Get latest readings from Firebase
        ref = db.reference('SCD40_Data')
        snapshot = ref.get()
        
        if not snapshot:
            return jsonify({"error": "No data in Firebase"}), 404

        # Convert the numeric values
        try:
            co2 = float(snapshot.get('CO2', 0))
            humidity = float(snapshot.get('Humidity', 0))
            temperature = float(snapshot.get('Temperature', 0))
            timestamp = snapshot.get('timestamp', '')
        except (ValueError, TypeError) as e:
            print(f"Data conversion error: {e}")
            return jsonify({"error": "Invalid sensor data format"}), 500
        
        # Prepare data for prediction
        input_data = pd.DataFrame({
            'humidity': [humidity],
            'temperature': [temperature]
        })
        
        # Calculate AQI from CO2
        def co2_to_aqi(co2):
            if co2 < 400:
                return (co2 / 400) * 50
            elif co2 < 1000:
                return 50 + ((co2 - 400) / 600) * 50
            elif co2 < 2000:
                return 100 + ((co2 - 1000) / 1000) * 50
            elif co2 < 5000:
                return 150 + ((co2 - 2000) / 3000) * 50
            else:
                return 200 + ((co2 - 5000) / 5000) * 300

        # Calculate AQI
        aqi = co2_to_aqi(co2)
        category = get_aqi_category(aqi)
        
        response = {
            "timestamp": timestamp,
            "aqi": round(aqi, 2),
            "category": category,
            "humidity": round(humidity, 2),
            "temperature": round(temperature, 2),
            "co2": round(co2, 2)
        }
        
        print(f"Processed data: {json.dumps(response, indent=2)}")
        return jsonify(response)
        
    except Exception as e:
        print(f"Error in get_current_aqi: {str(e)}")
        return jsonify({"error": str(e)}), 500



@app.route('/forecast', methods=['GET'])
def get_forecast():
    try:
        # Get current sensor data
        ref = db.reference('SCD40_Data')
        snapshot = ref.get()
        
        if not snapshot:
            return jsonify({"error": "No data available for forecast"}), 404
        
        # Convert current values
        try:
            current_data = {
                'humidity': float(snapshot.get('Humidity', 0)),
                'temperature': float(snapshot.get('Temperature', 0)),
                'CO2': float(snapshot.get('CO2', 0))
            }
        except (ValueError, TypeError) as e:
            print(f"Data conversion error: {e}")
            return jsonify({"error": "Invalid sensor data format"}), 404
        
        # Generate 7 days of predictions
        forecasts = []
        for day in range(1, 8):  # 7 days
            # Generate future conditions with slight variations
            next_day = {
                'humidity': np.clip(current_data['humidity'] + np.random.normal(0, 2), 10, 60),
                'temperature': np.clip(current_data['temperature'] + np.random.normal(0, 2), 10, 30)
            }
            
            # Predict CO2 using the model
            input_data = pd.DataFrame({
                'humidity': [next_day['humidity']],
                'temperature': [next_day['temperature']]
            })
            predicted_co2 = float(model.predict(input_data)[0])
            
            # Calculate AQI from CO2
            def co2_to_aqi(co2):
                if co2 < 400:
                    return (co2 / 400) * 50
                elif co2 < 1000:
                    return 50 + ((co2 - 400) / 600) * 50
                elif co2 < 2000:
                    return 100 + ((co2 - 1000) / 1000) * 50
                elif co2 < 5000:
                    return 150 + ((co2 - 2000) / 3000) * 50
                else:
                    return 200 + ((co2 - 5000) / 5000) * 300

            # Calculate AQI and category
            aqi = co2_to_aqi(predicted_co2)
            category = get_aqi_category(aqi)
            
            # Add forecast for this day
            forecast_date = (datetime.datetime.now() + datetime.timedelta(days=day)).strftime('%Y-%m-%d')
            forecasts.append({
                "date": forecast_date,
                "aqi": round(aqi, 2),
                "co2": round(predicted_co2, 2),
                "category": category,
                "conditions": {
                    "humidity": round(next_day['humidity'], 2),
                    "temperature": round(next_day['temperature'], 2)
                }
            })
            
            # Update current_data for next iteration
            current_data['humidity'] = next_day['humidity']
            current_data['temperature'] = next_day['temperature']
            current_data['CO2'] = predicted_co2
        
        return jsonify({
            "current_conditions": {
                "humidity": round(float(snapshot.get('Humidity', 0)), 2),
                "temperature": round(float(snapshot.get('Temperature', 0)), 2),
                "co2": round(float(snapshot.get('CO2', 0)), 2)
            },
            "daily_forecasts": forecasts
        })
    
    except Exception as e:
        print(f"Error in forecast: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
