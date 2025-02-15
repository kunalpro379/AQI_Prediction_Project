import React, { useState, useEffect, useCallback } from "react";

export default function RealTimeAQI() {
  const [aqiData, setAqiData] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAQI = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:5000/current-aqi");
      if (!response.ok) throw new Error("Failed to fetch AQI data");

      const data = await response.json();
      setAqiData(data);
      setLastUpdated(new Date().toLocaleTimeString()); // Store last updated time
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAQI();
    const interval = setInterval(fetchAQI, 60000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [fetchAQI]);

  // AQI Badge Colors
  const getAQIColor = (aqi) => {
    if (aqi <= 50) return "bg-green-500"; // Good
    if (aqi <= 100) return "bg-yellow-500"; // Moderate
    if (aqi <= 150) return "bg-orange-500"; // Poor
    if (aqi <= 200) return "bg-red-500"; // Unhealthy
    if (aqi <= 250) return "bg-purple-600"; // Severe
    return "bg-gray-900"; // Hazardous
  };

  return (
    <div className="w-full flex justify-center md:justify-start">
      <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-6 md:p-8 w-full max-w-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center md:text-left">
          🌍 Real-Time AQI
        </h2>

        {loading ? (
          <p className="text-gray-500 text-center md:text-left">Fetching data...</p>
        ) : error ? (
          <p className="text-red-400 font-medium text-center md:text-left">{error}</p>
        ) : aqiData ? (
          <div className="space-y-4">
            {/* AQI Value & Badge */}
            <div className="flex justify-center md:justify-start items-center gap-3">
              <span className={`p-3 text-white text-sm font-bold rounded-md ${getAQIColor(aqiData.aqi)}`}>
                AQI: {aqiData.aqi} ({aqiData.category})
              </span>
            </div>

            {/* Air Quality Info */}
            <div className="grid grid-cols-1 md:lg:grid-cols-3 gap-4 text-gray-700">
              <div className="flex flex-col items-center">
                <p className="text-lg font-semibold">{aqiData.co2} ppm</p>
                <p className="text-xs text-gray-500">CO₂ Level</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-lg font-semibold">{aqiData.temperature}°C</p>
                <p className="text-xs text-gray-500">Temperature</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-lg font-semibold">{aqiData.humidity}%</p>
                <p className="text-xs text-gray-500">Humidity</p>
              </div>
            </div>

            {/* Last Updated */}
            <p className="text-sm text-gray-500 text-center md:text-left">
              Last updated at: {lastUpdated}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
