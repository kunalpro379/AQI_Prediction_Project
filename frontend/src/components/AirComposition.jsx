import { useEffect, useState } from "react";
import { CloudIcon, FireIcon, SparklesIcon, BeakerIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import React from "react";

const AIR_POLLUTION_API = "https://api.openweathermap.org/data/2.5/air_pollution";
const API_KEY = "facfb070af760b2507aafa8f75c47464"; // Replace with your actual API key

export default function AirComposition() {
  const [airData, setAirData] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchAirQuality = async () => {
      try {
        const response = await fetch(
          `${AIR_POLLUTION_API}?lat=19.0760&lon=72.8777&appid=${API_KEY}`
        );
        const data = await response.json();

        if (data.list && data.list.length > 0) {
          const components = data.list[0].components;
          setAirData([
            { name: "PM2.5", value: components.pm2_5, icon: CloudIcon, color: "bg-blue-500" },
            { name: "PM10", value: components.pm10, icon: SparklesIcon, color: "bg-green-500" },
            { name: "CO", value: components.co, icon: SparklesIcon, color: "bg-green-500" },
            { name: "NO", value: components.no, icon: BeakerIcon, color: "bg-purple-500" },
            { name: "NO2", value: components.no2, icon: FireIcon, color: "bg-red-500" },
            { name: "O3", value: components.o3, icon: FireIcon, color: "bg-red-500" },
            { name: "SO2", value: components.so2, icon: BeakerIcon, color: "bg-purple-500" },
            { name: "NH3", value: components.nh3, icon: CloudIcon, color: "bg-blue-500" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching air quality data:", error);
      }
    };

    fetchAirQuality();
  }, []);

  const toggleExpanded = () => setExpanded(!expanded);
  const displayedGases = expanded ? airData : airData.slice(0, 5);

  return (
    <div className="h-auto bg-white rounded-lg shadow-lg p-4 overflow-auto">
      <h2 className="text-xl font-bold mb-4">Air Composition</h2>
      {airData.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {displayedGases.map((gas) => (
            <div key={gas.name} className="bg-gray-100 rounded-lg p-4 flex items-center space-x-4">
              <div className={`p-3 rounded-full ${gas.color}`}>
                <gas.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">{gas.name}</h3>
                <p className="text-gray-600">{gas.value} µg/m³</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Loading air composition data...</p>
      )}
      <button onClick={toggleExpanded} className="mt-4 text-blue-500 hover:underline focus:outline-none">
        {expanded ? "Show Less" : "Show More"}
      </button>
    </div>
  );
}
