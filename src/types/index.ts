export type SimulationStatus = 'Running' | 'Paused' | 'Stopped';

export interface RouteData {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    properties: {};
    geometry: {
      type: "LineString";
      coordinates: number[][];
    };
  }[];
}

export interface Timers {
    running: number;
    stopped: number;
    idle: number;
    ignitionOn: number;
}
