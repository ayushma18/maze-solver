import React, { useState } from "react";
import "./App.css";
import GraphMaze from "./components/GraphMaze";
import Controls from "./components/Controls";

function App() {
  const [algorithm, setAlgorithm] = useState("bfs");
  const [speed, setSpeed] = useState("fast");

  return (
    <div className="App">
      <nav className="navbar">
        <h1>Graph Maze Solver</h1>
        <Controls 
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          speed={speed}
          setSpeed={setSpeed}
        />
      </nav>
      <main className="main-content">
        <div className="sidebar">
          <div className="instructions">
            <h2>How to Use</h2>
            <p>Click a node to set start point (green)</p>
            <p>Click another node to set end point (red)</p>
            <p>Choose your preferred algorithm and speed</p>
            <p>Click "Solve" to visualize path finding</p>
            <p>Use "Reset" to start over</p>
          </div>
          <div className="legend">
            <h2>Color Guide</h2>
            <div className="legend-item">
              <span className="legend-box start"></span>
              <span>Starting Point</span>
            </div>
            <div className="legend-item">
              <span className="legend-box end"></span>
              <span>Destination</span>
            </div>
            <div className="legend-item">
              <span className="legend-box path"></span>
              <span>Shortest Path Found</span>
            </div>
          </div>
        </div>
        <div className="maze-container">
          <GraphMaze algorithm={algorithm} speed={speed} />
        </div>
      </main>
    </div>
  );
}

export default App;
