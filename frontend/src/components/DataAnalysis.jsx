import React from "react";

export default function DataAnalysis() {
    return (
      <div className="w-full h-screen p-6">
        <iframe 
          src="/updated_test.html" 
          className="w-full h-full border-none rounded-lg shadow-lg"
          title="Data Analysis Report"
        />
      </div>
    );
  }
  