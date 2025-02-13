import { CloudIcon, FireIcon, SparklesIcon, BeakerIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";

const airComposition = [
  { name: "PM2.5", value: 12, icon: CloudIcon, color: "bg-blue-500" },
  { name: "PM10", value: 35, icon: SparklesIcon, color: "bg-green-500" },
  { name: "NO", value: 25, icon: BeakerIcon, color: "bg-purple-500" },
  { name: "NO2", value: 40, icon: FireIcon, color: "bg-red-500" },
  { name: "NOx", value: 65, icon: QuestionMarkCircleIcon, color: "bg-gray-500" },
  { name: "NH3", value: 20, icon: CloudIcon, color: "bg-blue-500" },
  { name: "CO", value: 0.8, icon: SparklesIcon, color: "bg-green-500" },
  { name: "SO2", value: 20, icon: BeakerIcon, color: "bg-purple-500" },
  { name: "O3", value: 60, icon: FireIcon, color: "bg-red-500" },
  { name: "Benzene", value: 0.5, icon: QuestionMarkCircleIcon, color: "bg-gray-500" },
  { name: "Toluene", value: 0.3, icon: CloudIcon, color: "bg-blue-500" },
  { name: "Xylene", value: 0.2, icon: SparklesIcon, color: "bg-green-500" },
];

export default function AirComposition() {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const displayedGases = expanded ? airComposition : airComposition.slice(0, 5);

  return (
    <div className="h-auto bg-white rounded-lg shadow-lg p-4 overflow-auto">
      <h2 className="text-xl font-bold mb-4">Air Composition</h2>
      <div className="grid grid-cols-2 gap-4">
        {displayedGases.map((gas) => (
          <div key={gas.name} className="bg-gray-100 rounded-lg p-4 flex items-center space-x-4">
            <div className={`p-3 rounded-full ${gas.color}`}>
              <gas.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">{gas.name}</h3>
              <p className="text-gray-600">{gas.value}%</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={toggleExpanded}
        className="mt-4 text-blue-500 hover:underline focus:outline-none"
      >
        {expanded ? "Show Less" : "Show More"}
      </button>
    </div>
  );
}