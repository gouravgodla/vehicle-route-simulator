import { useState } from "react";
import { RouteData } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RouteData) => void;
}

const CustomLocationModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleManualSubmit = () => {
    setError("");
    if (!jsonInput.trim()) {
      setError("Input cannot be empty.");
      return;
    }
    try {
      const data = JSON.parse(jsonInput);
      // Basic validation for GeoJSON structure
      if (data.type === 'FeatureCollection' && data.features?.[0]?.geometry?.type === 'LineString' && Array.isArray(data.features[0].geometry.coordinates)) {
        onSubmit(data);
        setJsonInput("");
        onClose();
      } else {
        setError("Invalid GeoJSON. Must be a FeatureCollection with a LineString.");
      }
    } catch (e) {
      setError("Invalid JSON format. Please check your input.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg w-11/12 max-w-xl shadow-xl flex flex-col">
        <div className="px-6 pt-4 pb-2 border-b">
            <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-800">Load Custom Route</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl font-light leading-none">&times;</button>
            </div>
        </div>
        
        <div className="p-6">
            <p className="text-gray-600 mb-4">
                Paste your route data below. It must be a valid GeoJSON `FeatureCollection` containing a single `LineString` feature.
            </p>
            <textarea
                className="w-full h-60 p-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{ "type": "FeatureCollection", "features": [{...}] }'
                aria-label="GeoJSON input"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="flex justify-end p-4 bg-gray-50 rounded-b-lg border-t">
          <button onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
          <button onClick={handleManualSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Submit Route</button>
        </div>
      </div>
    </div>
  );
};

export default CustomLocationModal;