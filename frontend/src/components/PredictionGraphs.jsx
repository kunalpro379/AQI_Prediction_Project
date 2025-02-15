import { useEffect, useState } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import React from "react";

const PredictionGraphs = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/co2-forecast") // Update with your Flask API URL
      .then((response) => response.json())
      .then((result) => setData(result))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-center text-xl font-bold text-gray-800 mb-4">
        AQI & Environmental Factors (Next 7 Days)
      </h2>
      <div className="bg-gray-100 p-5 rounded-xl shadow-md">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
            <XAxis dataKey="date" stroke="#333" />
            <YAxis stroke="#333" />
            <Tooltip contentStyle={{ backgroundColor: "#f9fafb", borderColor: "#e5e7eb", color: "#333" }} />
            <Legend wrapperStyle={{ color: "#333" }} />
            <Line type="monotone" dataKey="aqi" stroke="#ff5733" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="co2" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="temperature" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="humidity" stroke="#facc15" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PredictionGraphs;
