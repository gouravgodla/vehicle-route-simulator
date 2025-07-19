import { Marker } from "react-leaflet";
import { divIcon, LatLngExpression } from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { CarIcon } from "./Icons";

interface VehicleMarkerProps {
  position: LatLngExpression;
}

export const VehicleMarker = ({ position }: VehicleMarkerProps) => {
  const iconMarkup = renderToStaticMarkup(<CarIcon className="w-8 h-8 -rotate-90" />);
  const customMarkerIcon = divIcon({
    html: iconMarkup,
    className: 'dummy-class-to-avoid-default-leaflet-style', // Required to avoid default styles
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  return (
    <Marker position={position} icon={customMarkerIcon} />
  );
};
