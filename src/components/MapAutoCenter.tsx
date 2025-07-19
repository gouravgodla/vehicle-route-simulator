import { useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { useEffect } from "react";

interface MapAutoCenterProps {
  position: LatLngExpression;
}

export const MapAutoCenter = ({ position }: MapAutoCenterProps) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position);
  }, [position, map]);
  return null;
};
