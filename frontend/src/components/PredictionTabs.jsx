import { Tabs, TabList, Tab, TabPanel } from "react-tabs"
import "react-tabs/style/react-tabs.css"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import React from "react" 

const monthlyData = [
  { name: "Jan", aqi: 50 },
  { name: "Feb", aqi: 55 },
  { name: "Mar", aqi: 60 },
  { name: "Apr", aqi: 65 },
  { name: "May", aqi: 70 },
  { name: "Jun", aqi: 75 },
]

const weeklyData = [
  { name: "Mon", aqi: 45 },
  { name: "Tue", aqi: 50 },
  { name: "Wed", aqi: 55 },
  { name: "Thu", aqi: 60 },
  { name: "Fri", aqi: 65 },
  { name: "Sat", aqi: 70 },
  { name: "Sun", aqi: 75 },
]

const yearlyData = [
  { name: "2020", aqi: 60 },
  { name: "2021", aqi: 65 },
  { name: "2022", aqi: 70 },
  { name: "2023", aqi: 75 },
  { name: "2024", aqi: 80 },
  { name: "2025", aqi: 85 },
]

function PredictionChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="aqi" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default function PredictionTabs() {
  return (
    <div className="h-full bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">AQI Predictions</h2>
      <Tabs>
        <TabList>
          <Tab>Monthly</Tab>
          <Tab>Weekly</Tab>
          <Tab>Yearly</Tab>
        </TabList>

        <TabPanel>
          <PredictionChart data={monthlyData} />
        </TabPanel>
        <TabPanel>
          <PredictionChart data={weeklyData} />
        </TabPanel>
        <TabPanel>
          <PredictionChart data={yearlyData} />
        </TabPanel>
      </Tabs>
    </div>
  )
}

