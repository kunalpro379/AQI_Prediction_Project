import { CalendarIcon, ClockIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./PredictionCards.css";

const aqiCategories = [
  { label: "Good", color: "bg-green-500", range: [0, 50] },
  { label: "Moderate", color: "bg-yellow-500", range: [51, 100] },
  { label: "Poor", color: "bg-orange-500", range: [101, 150] },
  { label: "Unhealthy", color: "bg-red-500", range: [151, 200] },
  { label: "Severe", color: "bg-purple-600", range: [201, 250] },
  { label: "Hazardous", color: "bg-gray-800", range: [251, 300] },
  { label: "Extremely Hazardous", color: "bg-black", range: [301, Infinity] },
];

const predictions = [
  {
    type: "Daily",
    icon: ClockIcon,
    color: "bg-blue-500",
    aqi: 65,
    composition: { "PM2.5": 12, PM10: 35, NO2: 40, SO2: 20, CO: 0.8, O3: 60 },
  },
  {
    type: "Weekly",
    icon: CalendarIcon,
    color: "bg-green-500",
    aqi: 150,
    composition: { "PM2.5": 15, PM10: 40, NO2: 45, SO2: 25, CO: 1.0, O3: 65 },
  },
];

function getAqiCategory(aqi) {
  return aqiCategories.find((category) => aqi >= category.range[0] && aqi <= category.range[1]);
}

function PredictionCard({ prediction }) {
  const { label, color } = getAqiCategory(prediction.aqi);
  return (
    <motion.div
      className="flex flex-col items-center bg-white rounded-xl shadow-md p-6 w-64 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Icon and Title */}
      <div className={`flex items-center gap-3 px-4 py-2 rounded-xl ${prediction.color}`}>
        <prediction.icon className="h-8 w-8 text-white" />
        <h3 className="text-white text-lg font-semibold">{prediction.type} Prediction</h3>
      </div>

      {/* AQI Value & Category */}
      <div className="flex flex-col justify-center items-center mt-5 text-center">
        <p className="text-4xl font-bold text-gray-800">{prediction.aqi}</p>
        <p className="text-gray-500 text-md">Air Quality Index</p>
        <span className={`mt-2 px-3 py-1 rounded-md text-white text-sm font-semibold ${color}`}>
          {label}
        </span>
      </div>
    </motion.div>
  );
}

export default function PredictionCards() {
  const [location, setLocation] = useState("Fetching location...");
  const [weather, setWeather] = useState({ temp: null, humidity: null });

  useEffect(() => {
    const fetchWeatherData = async (lat, lon) => {
      const apiKey = "facfb070af760b2507aafa8f75c47464";
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      setWeather({ temp: data.main.temp, humidity: data.main.humidity });
      setLocation(data.name);
    };

    const handleSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherData(latitude, longitude);
    };

    const handleError = () => {
      setLocation("Location access denied.");
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      setLocation("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <motion.div
      className="h-full bg-gray-100 rounded-lg shadow-lg p-4 space-y-4 overflow-auto flex-col md:lg:flex-row"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex w-full justify-between items-center p-1">
        <h2 className="text-xl font-bold ">{location}</h2>
      </div>
      <div className="flex flex-col gap-4 justify-center items-center md:lg:flex-row">
        {predictions.map((prediction) => (
          <PredictionCard key={prediction.type} prediction={prediction} />
        ))}
      </div>
    </motion.div>
  );
}
