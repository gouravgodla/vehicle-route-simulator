import { FeatureCollection, LineString } from "geojson";

export type RouteData = FeatureCollection<LineString>;

export type SimulationStatus = 'Running' | 'Paused' | 'Stopped';

export interface Timers {
  running: number;
  stopped: number;
  idle: number;
  ignitionOn: number;
}
