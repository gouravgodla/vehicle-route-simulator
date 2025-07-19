import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import { useVehicleSimulation } from "./hooks/useVehicleSimulation";
import initialRouteData from "./data/dummy-route.json";
import { Dashboard } from "./components/Dashboard";
import { VehicleMarker } from "./components/VehicleMarker";
import { MapAutoCenter } from "./components/MapAutoCenter";
import CustomLocationModal from "./components/CustomLocationModal";
import { LatLngExpression } from "leaflet";
import { RouteData } from "./types";

function App() {
  const [route, setRoute] = useState<RouteData>(initialRouteData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationName, setLocationName] = useState("Default Route");

  const coordinates = useMemo<LatLngExpression[]>(() => 
    route.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]),
    [route]
  );
  
  const {
    vehiclePosition,
    currentSpeed,
    distanceTraveled,
    simulationStatus,
    totalDistance,
    timers,
    startSimulation,
    pauseSimulation,
    resetSimulation,
  } = useVehicleSimulation(coordinates);

  const handleSetCustomRoute = (newRouteData: RouteData) => {
    setRoute(newRouteData);
    setLocationName("Custom Route Loaded");
    resetSimulation();
    setIsModalOpen(false);
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex relative overflow-hidden">
      <CustomLocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSetCustomRoute}
      />
      <MapContainer
        center={[20.0076, 73.7634]}
        zoom={15}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Polyline pathOptions={{ color: 'green', weight: 6, opacity: 0.7 }} positions={coordinates} />
        {vehiclePosition && <VehicleMarker position={vehiclePosition} />}
        {vehiclePosition && <MapAutoCenter position={vehiclePosition} />}
      </MapContainer>
      <Dashboard
        status={simulationStatus}
        speed={currentSpeed}
        distance={distanceTraveled}
        totalDistance={totalDistance}
        locationName={locationName}
        timers={timers}
        onPlayPause={simulationStatus === 'Running' ? pauseSimulation : startSimulation}
        onReset={resetSimulation}
        onAddLocation={() => setIsModalOpen(true)}
      />
    </div>
  );
}

export default App;