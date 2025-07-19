# Vehicle Route Simulator

This is a web-based vehicle tracking simulator built with React, Vite, and Leaflet maps. It displays a vehicle moving along a predefined route and provides a real-time dashboard with statistics like speed, distance, and current timestamp.

## Features

- **Interactive Map**: Visualizes the vehicle's journey on an OpenStreetMap tile layer.
- **Time-Based Simulation**: Vehicle movement is realistically simulated based on timestamps in the route data.
- **Real-time Dashboard**: Displays key metrics:
  - Current Speed (calculated from route data)
  - Distance Traveled
  - Current Timestamp
  - Timers for running, stopped, and idle states.
- **Simulation Controls**: Play, Pause, and Reset the vehicle simulation.
- **Custom Route Loading**: A '+' button opens a modal allowing you to paste your own GeoJSON route data.

## Tech Stack

- **Framework**: React
- **Build Tool**: Vite
- **Mapping**: Leaflet & React-Leaflet
- **Styling**: Tailwind CSS
- **Language**: TypeScript

---

## How to Run in VS Code

### 1. Install Dependencies

- Open the integrated terminal in VS Code (`View` -> `Terminal` or `Ctrl+\``).
- Run the following command to install all the necessary project dependencies from `package.json`:

  ```bash
  npm install
  ```

### 2. Run the Development Server

- After the installation is complete, run the following command in the same terminal:

  ```bash
  npm run dev
  ```

### 3. View the Application

- The terminal will display a local URL, typically `http://localhost:5173/`.
- Hold `Ctrl` (or `Cmd` on Mac) and click the link to open the application in your default web browser.

The vehicle route simulator should now be running! You can interact with the dashboard controls to play, pause, or reset the simulation.

# Load Custom Route

```
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [77.2090, 28.6139],
          [77.4500, 28.4000],
          [77.6000, 28.1500],
          [77.7500, 27.9500],
          [78.0081, 27.1767]
        ]
      },
      "properties": {
        "name": "New Delhi to Agra Sample Route (Approx. 100 KM)"
      }
    }
  ]
}
```
