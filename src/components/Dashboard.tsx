import {
  SpeedIcon,
  DistanceIcon,
  BatteryIcon,
  KeyIcon,
  SnowflakeIcon,
  DoorOpenIcon,
  EngineOilIcon,
  PlayIcon,
  PauseIcon,
  ResetIcon,
  PlusCircleIcon,
  LocationPinIcon,
} from "./Icons";
import { SimulationStatus, Timers } from "../types";
import { formatTime } from "../utils/helpers";
import clsx from "clsx";

interface DashboardProps {
  status: SimulationStatus;
  speed: number;
  distance: number;
  totalDistance: number;
  locationName: string;
  timers: Timers;
  onPlayPause: () => void;
  onReset: () => void;
  onAddLocation: () => void;
}

const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: JSX.Element;
  value: string;
  label: string;
}) => (
  <div className="flex flex-col items-center justify-center text-center">
    {icon}
    <p className="text-lg font-bold text-gray-800 mt-1">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-semibold text-gray-800">{value}</p>
  </div>
);

export const Dashboard = ({
  status,
  speed,
  distance,
  totalDistance,
  locationName,
  timers,
  onPlayPause,
  onReset,
  onAddLocation,
}: DashboardProps) => {
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[45vh] bg-white/80 backdrop-blur-sm rounded-t-lg shadow-2xl p-4 flex flex-col text-sm font-sans overflow-y-auto z-10 md:absolute md:top-4 md:right-4 md:bottom-4 md:left-auto md:h-auto md:w-full md:max-w-sm md:rounded-lg md:shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-md text-white">
            <KeyIcon className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-gray-800">WIRELESS</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-green-100 text-green-700 px-2 py-1 rounded-md font-semibold text-xs">
            {`${formattedDate}, ${formattedTime}`}
          </div>
          <button
            onClick={onAddLocation}
            className="text-gray-500 hover:text-gray-800"
          >
            <PlusCircleIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-start gap-2 mb-4 text-gray-700">
        <LocationPinIcon className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
        <p className="font-semibold">{locationName}</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 border-b pb-4">
        <StatCard
          icon={<SpeedIcon className="w-7 h-7 text-gray-600" />}
          value={`${speed.toFixed(2)}`}
          label="km/h"
        />
        <StatCard
          icon={<DistanceIcon className="w-7 h-7 text-purple-600" />}
          value={`${distance.toFixed(2)}`}
          label="km"
        />
        <StatCard
          icon={<BatteryIcon className="w-7 h-7 text-teal-500" />}
          value="16%"
          label="Battery"
        />
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4 text-left">
        <DetailRow
          label="Total Distance"
          value={`${totalDistance.toFixed(2)} km`}
        />
        <DetailRow label="Today Running" value={formatTime(timers.running)} />
        <DetailRow label="Today Stopped" value={formatTime(timers.stopped)} />
        <DetailRow label="Today Idle" value={formatTime(timers.idle)} />
        <DetailRow label="Current Status" value={status.toUpperCase()} />
        <DetailRow label="Today Max Speed" value="0.00 km/h" />
        <DetailRow
          label="Today Ignition On"
          value={formatTime(timers.ignitionOn)}
        />
        <DetailRow label="Today Ignition Off" value="00h:00m" />
      </div>

      <div className="mt-auto">
        {/* Action Buttons */}
        <div className="flex justify-around items-center bg-gray-200/70 rounded-lg p-2 mb-4">
          <button className="p-2 rounded-full hover:bg-gray-300 transition-colors">
            <EngineOilIcon className="w-6 h-6 text-gray-700" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-300 transition-colors">
            <SnowflakeIcon className="w-6 h-6 text-gray-700" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-300 transition-colors">
            <DoorOpenIcon className="w-6 h-6 text-gray-700" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-300 transition-colors">
            <KeyIcon className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={onPlayPause}
            className={clsx(
              "p-3 rounded-full text-white transition-all duration-200 shadow-md flex items-center justify-center",
              status === "Running"
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-green-500 hover:bg-green-600"
            )}
          >
            {status === "Running" ? (
              <PauseIcon className="w-6 h-6" />
            ) : (
              <PlayIcon className="w-6 h-6" />
            )}
          </button>
          <button
            onClick={onReset}
            className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md"
          >
            <ResetIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
