import Map from "./components/Map.jsx";
import AirComposition from "./components/AirComposition.jsx";
import PredictionCards from "./components/PredictionCards.jsx";
import React from "react";
import PredictionTabs from "./components/PredictionTabs.jsx";

export default function App() {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100 p-6 space-y-6 md:space-y-0 md:space-x-6">
      
      {/* Left Section */}
      <div className="flex flex-col w-full bg-black/10 rounded-md p-4 md:w-1/2 space-y-6">
          <PredictionCards />
          <PredictionTabs />
      </div>

      {/* Right Section */}
      <div className="flex flex-col w-full md:w-1/2 space-y-6">
        {/* Map Section */}
        <div className="h-64 md:h-[250px] bg-white shadow-lg rounded-xl overflow-hidden">
          <Map />
        </div>

        {/* Air Composition */}
        <div className="bg-white shadow-lg rounded-xl p-6 backdrop-blur-lg">
          <AirComposition />
        </div>
      </div>
      
    </div>
  );
}
