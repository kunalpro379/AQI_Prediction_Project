import React, { useState, useEffect } from "react";

export default function RealTimeAQI() {
  const [aqiData, setAqiData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAQI = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/current-aqi");
        if (!response.ok) throw new Error("Failed to fetch AQI data");

        const data = await response.json();
        setAqiData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAQI();
    const interval = setInterval(fetchAQI, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md text-center">
      <h2 className="text-lg font-semibold">Real-Time AQI</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : aqiData ? (
        <div>
          <p>CO₂ Level: {aqiData.co2} ppm</p>
          <p>AQI: {aqiData.aqi} ({aqiData.category})</p>
          <p>Temperature: {aqiData.temperature}°C</p>
          <p>Humidity: {aqiData.humidity}%</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
