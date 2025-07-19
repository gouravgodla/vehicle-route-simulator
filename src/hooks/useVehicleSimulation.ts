import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { LatLngExpression } from 'leaflet';
import { SimulationStatus, Timers } from '../types';
import { haversineDistance } from '../utils/helpers';

const SIMULATION_SPEED_MULTIPLIER = 5; // Higher value = faster simulation

export const useVehicleSimulation = (route: LatLngExpression[]) => {
  const [simulationStatus, setSimulationStatus] = useState<SimulationStatus>('Paused');
  const [vehiclePosition, setVehiclePosition] = useState<LatLngExpression | null>(route[0] || null);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  
  const totalDistance = useMemo(() => {
    let dist = 0;
    for (let i = 0; i < route.length - 1; i++) {
      dist += haversineDistance(route[i], route[i + 1]);
    }
    return dist;
  }, [route]);

  const [timers, setTimers] = useState<Timers>({ running: 0, stopped: 0, idle: 0, ignitionOn: 0 });

  const segmentIndex = useRef(0);
  const distanceInSegment = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const lastUpdateTime = useRef<number | null>(null);

  const resetState = useCallback(() => {
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    setSimulationStatus('Paused');
    setVehiclePosition(route[0] || null);
    setCurrentSpeed(0);
    setDistanceTraveled(0);
    setTimers({ running: 0, stopped: 0, idle: 0, ignitionOn: 0 });
    segmentIndex.current = 0;
    distanceInSegment.current = 0;
    lastUpdateTime.current = null;
  }, [route]);

  useEffect(() => {
    resetState();
  }, [route, resetState]);


  const update = useCallback((timestamp: number) => {
    if (lastUpdateTime.current === null) {
        lastUpdateTime.current = timestamp;
        animationFrameId.current = requestAnimationFrame(update);
        return;
    }

    const deltaTime = (timestamp - lastUpdateTime.current) / 1000; // in seconds
    lastUpdateTime.current = timestamp;

    const speedKps = 50 / 3600 * SIMULATION_SPEED_MULTIPLIER; // 50 km/h in km/s
    const distanceThisFrame = speedKps * deltaTime;
    
    distanceInSegment.current += distanceThisFrame;
    setDistanceTraveled(prev => prev + distanceThisFrame);

    let currentSegment = route.slice(segmentIndex.current, segmentIndex.current + 2);

    while(currentSegment.length === 2) {
        const segmentDistance = haversineDistance(currentSegment[0], currentSegment[1]);

        if (distanceInSegment.current < segmentDistance) {
            const fraction = distanceInSegment.current / segmentDistance;
            const start = Array.isArray(currentSegment[0]) ? currentSegment[0] : [currentSegment[0].lat, currentSegment[0].lng];
            const end = Array.isArray(currentSegment[1]) ? currentSegment[1] : [currentSegment[1].lat, currentSegment[1].lng];
            
            const newLat = start[0] + (end[0] - start[0]) * fraction;
            const newLng = start[1] + (end[1] - start[1]) * fraction;

            setVehiclePosition([newLat, newLng]);
            setCurrentSpeed(50 * SIMULATION_SPEED_MULTIPLIER);
            break;
        } else {
            distanceInSegment.current -= segmentDistance;
            segmentIndex.current++;
            currentSegment = route.slice(segmentIndex.current, segmentIndex.current + 2);

            if(currentSegment.length < 2) {
                setVehiclePosition(route[route.length - 1]);
                setSimulationStatus('Stopped');
                setCurrentSpeed(0);
                return; // End of route, stop updating
            }
        }
    }
    
    animationFrameId.current = requestAnimationFrame(update);

  }, [route]);

  useEffect(() => {
    if (simulationStatus === 'Running') {
      lastUpdateTime.current = performance.now();
      animationFrameId.current = requestAnimationFrame(update);
    } else {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      setCurrentSpeed(0);
    }

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [simulationStatus, update]);

  // Timer logic
  useEffect(() => {
    const timerInterval = setInterval(() => {
        setTimers(prev => {
            const newTimers = {...prev};
            if(simulationStatus === 'Running') {
                newTimers.running += 1;
                newTimers.ignitionOn +=1;
            } else if (simulationStatus === 'Paused') {
                newTimers.idle += 1;
                newTimers.ignitionOn +=1;
            } else { // Stopped
                newTimers.stopped += 1;
            }
            return newTimers;
        })
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [simulationStatus]);


  const startSimulation = () => setSimulationStatus('Running');
  const pauseSimulation = () => setSimulationStatus('Paused');
  const resetSimulation = () => resetState();

  return {
    vehiclePosition,
    currentSpeed,
    distanceTraveled,
    simulationStatus,
    totalDistance,
    timers,
    startSimulation,
    pauseSimulation,
    resetSimulation,
  };
};