import Map from "./components/Map.jsx";
import AirComposition from "./components/AirComposition.jsx";
import PredictionCards from "./components/PredictionCards.jsx";
import React from "react";
import PredictionTabs from "./components/PredictionTabs.jsx";
import DataAnalysis from "./components/DataAnalysis.jsx";
import RealTimeAQI from "./components/RealtimeAQI.jsx";
import PredictionGraphs from "./components/PredictionGraphs.jsx";

export default function App() {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100 p-6 space-y-6 md:space-y-0 md:space-x-6">
      
      {/* Left Section */}
      <div className="w-full h-full flex flex-col w-full bg-black/10 rounded-md p-4 md:w-1/2 space-y-6">
          <PredictionCards />
          <PredictionTabs />
      </div>

      {/* Right Section */}
      <div className="flex flex-col bg-black/10 rounded-md p-4 md:w-full space-y-6 w-full md:w-1/2 space-y-6 ">
          <RealTimeAQI /> {/* New component added here */}
          <AirComposition />
          <PredictionGraphs/>
      </div>
    </div>
  );
}
