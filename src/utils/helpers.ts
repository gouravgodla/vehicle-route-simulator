import { LatLngExpression } from "leaflet";

// Haversine formula to calculate distance between two lat/lng points in km
export const haversineDistance = (p1: LatLngExpression, p2: LatLngExpression): number => {
  const R = 6371; // Radius of the Earth in km
  const [lat1, lon1] = Array.isArray(p1) ? p1 : [p1.lat, p1.lng];
  const [lat2, lon2] = Array.isArray(p2) ? p2 : [p2.lat, p2.lng];

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Format seconds into hh:mm:ss string
export const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    // const seconds = totalSeconds % 60;
  
    const hStr = hours.toString().padStart(2, '0');
    const mStr = minutes.toString().padStart(2, '0');
    // const sStr = seconds.toString().padStart(2, '0');
  
    return `${hStr}h:${mStr}m`;
  };
  