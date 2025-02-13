import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { MapPinIcon } from "@heroicons/react/24/solid";
import "leaflet/dist/leaflet.css";

function AQIMarker({ position, aqi }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Marker
      position={position}
      eventHandlers={{
        mouseover: () => setIsHovered(true),
        mouseout: () => setIsHovered(false),
      }}
    >
      {isHovered && (
        <Popup>
          <div className="flex items-center space-x-2">
            <MapPinIcon className="h-5 w-5 text-red-500" />
            <span>AQI: {aqi}</span>
          </div>
        </Popup>
      )}
    </Marker>
  );
}

function MapEvents({ onMove }) {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      onMove(center.lat, center.lng);
    },
  });
  return null;
}

export default function Map() {
  const [aqiData, setAqiData] = useState([]);
  const [center, setCenter] = useState([51.505, -0.09]);

  const fetchAQIData = async (lat, lng) => {
    try {
      const response = await fetch(`http://localhost:5000/predict?lat=${lat}&lng=${lng}`);
      const data = await response.json();
      setAqiData(data);
    } catch (error) {
      console.error("Error fetching AQI data:", error);
    }
  };

  useEffect(() => {
    fetchAQIData(center[0], center[1]);
  }, [center]);

  return (
    <div className="h-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer center={center} zoom={13} className="h-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {aqiData.map((data, index) => (
          <AQIMarker key={index} position={[data.latitude, data.longitude]} aqi={data.aqi} />
        ))}
        <MapEvents onMove={(lat, lng) => setCenter([lat, lng])} />
      </MapContainer>
    </div>
  );
}