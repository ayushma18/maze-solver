import React, { useState } from 'react';
import './Controls.css';

const Controls = ({ algorithm, setAlgorithm, speed, setSpeed }) => {
  const [isAlgorithmOpen, setIsAlgorithmOpen] = useState(false);
  const [isSpeedOpen, setIsSpeedOpen] = useState(false);
  const [displayAlgorithm, setDisplayAlgorithm] = useState('Select Algorithm');
  const [displaySpeed, setDisplaySpeed] = useState('Select Speed');

  const handleAlgorithmSelect = (algo, name) => {
    setAlgorithm(algo);
    setDisplayAlgorithm(name);
    setIsAlgorithmOpen(false);
  };

  const handleSpeedSelect = (spd, name) => {
    setSpeed(spd);
    setDisplaySpeed(name);
    setIsSpeedOpen(false);
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setIsAlgorithmOpen(false);
      setIsSpeedOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Prevent closing when clicking inside the controls
  const handleControlsClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="controls" onClick={handleControlsClick}>
      <div className="button-wrapper">
        <button 
          className={`control-button ${isAlgorithmOpen ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsAlgorithmOpen(!isAlgorithmOpen);
            setIsSpeedOpen(false);
          }}
          type="button"
        >
          {displayAlgorithm}
          <span className={`arrow ${isAlgorithmOpen ? 'up' : 'down'}`}>▼</span>
        </button>
        {isAlgorithmOpen && (
          <div className="dropdown-content">
            <div 
              className={`dropdown-item ${algorithm === 'astar' ? 'selected' : ''}`}
              onClick={() => handleAlgorithmSelect('astar', 'A* Algorithm')}
            >
              A* Algorithm
            </div>
            <div 
              className={`dropdown-item ${algorithm === 'dfs' ? 'selected' : ''}`}
              onClick={() => handleAlgorithmSelect('dfs', 'Depth First Search')}
            >
              Depth First Search
            </div>
            <div 
              className={`dropdown-item ${algorithm === 'bfs' ? 'selected' : ''}`}
              onClick={() => handleAlgorithmSelect('bfs', 'Breadth First Search')}
            >
              Breadth First Search
            </div>
            <div 
              className={`dropdown-item ${algorithm === 'dijkstra' ? 'selected' : ''}`}
              onClick={() => handleAlgorithmSelect('dijkstra', 'Dijkstra\'s Algorithm')}
            >
              Dijkstra's Algorithm
            </div>
          </div>
        )}
      </div>

      <div className="button-wrapper">
        <button 
          className={`control-button ${isSpeedOpen ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsSpeedOpen(!isSpeedOpen);
            setIsAlgorithmOpen(false);
          }}
          type="button"
        >
          {displaySpeed}
          <span className={`arrow ${isSpeedOpen ? 'up' : 'down'}`}>▼</span>
        </button>
        {isSpeedOpen && (
          <div className="dropdown-content">
            <div 
              className={`dropdown-item ${speed === 'slow' ? 'selected' : ''}`}
              onClick={() => handleSpeedSelect('slow', 'Slow')}
            >
              Slow
            </div>
            <div 
              className={`dropdown-item ${speed === 'medium' ? 'selected' : ''}`}
              onClick={() => handleSpeedSelect('medium', 'Medium')}
            >
              Medium
            </div>
            <div 
              className={`dropdown-item ${speed === 'fast' ? 'selected' : ''}`}
              onClick={() => handleSpeedSelect('fast', 'Fast')}
            >
              Fast
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Controls;