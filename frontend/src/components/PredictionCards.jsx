import { CalendarIcon, ClockIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import React from "react";
import { motion } from "framer-motion";
import "./PredictionCards.css"; // Import the custom CSS

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
    aqi: 70,
    composition: { "PM2.5": 15, PM10: 40, NO2: 45, SO2: 25, CO: 1.0, O3: 65 },
  },
//   {
//     type: "Monthly",
//     icon: ChartBarIcon,
//     color: "bg-purple-500",
//     aqi: 75,
//     composition: { "PM2.5": 18, PM10: 45, NO2: 50, SO2: 30, CO: 1.2, O3: 70 },
//   },
];

function PredictionCard({ prediction }) {
  return (
    <motion.div
      className="flex justify-between items-center bg-white rounded-lg shadow-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center space-x-4 mb-4">
        <div className={`flex justify-center items-center gap-x-3 p-3 rounded-lg ${prediction.color}`}>
          <prediction.icon className="h-6 w-6 text-white" />
        <h3 className="text-lg font-semibold">{prediction.type} Prediction</h3>
        </div>
      <div className="mb-4">
        <p className="text-3xl font-bold">{prediction.aqi}</p>
        <p className="text-gray-600">AQI</p>
      </div>
      </div>
      <div className="flex flex-col">
        <h4 className="font-semibold mb-2">Gas Composition</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(prediction.composition).map(([gas, value]) => (
            <div key={gas} className="flex justify-between space-x-2">
              <span className="text-gray-600">{gas}:</span>
              <span className="font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function PredictionCards() {
  return (
    <motion.div
      className="h-full bg-gray-100 rounded-lg shadow-lg p-4 space-y-4 overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
        <div className="flex w-full justify-between items-center p-1">
      <h2 className="text-xl font-bold mb-4">AQI Predictions</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">User Location</button>
        </div>
      {predictions.map((prediction) => (
        <PredictionCard key={prediction.type} prediction={prediction} />
      ))}
    </motion.div>
  );
}