import React, { useState, useEffect } from 'react';
import Graph from '../utils/graph';
import { dijkstra } from '../algorithms/dijkstra';
import './GraphMaze.css';

const GraphMaze = ({ algorithm, speed }) => {
  const [graph] = useState(() => {
    const g = new Graph();
    
    // Define node positions in a more complex layout
    const positions = [
      { x: 100, y: 250 },   // 0: far left
      { x: 250, y: 100 },   // 1: top left
      { x: 250, y: 400 },   // 2: bottom left
      { x: 400, y: 250 },   // 3: center
      { x: 550, y: 100 },   // 4: top right
      { x: 550, y: 400 },   // 5: bottom right
      { x: 700, y: 250 },   // 6: far right
      { x: 400, y: 500 },   // 7: bottom center
      { x: 400, y: 50 },    // 8: top center
      { x: 250, y: 250 },   // 9: middle left
      { x: 550, y: 250 },   // 10: middle right
      { x: 325, y: 175 },   // 11: upper middle
      { x: 325, y: 325 },   // 12: lower middle
      { x: 475, y: 175 },   // 13: upper middle right
      { x: 475, y: 325 },   // 14: lower middle right
    ];
    
    positions.forEach((pos, i) => {
      g.addNode(i, pos.x, pos.y);
    });

    // Add connections with weights based on distance
    const addEdgeWithWeight = (id1, id2) => {
      const weight = Math.round(g.calculateDistance(id1, id2) / 10);
      g.addConnection(id1, id2, weight);
    };

    // Add more complex connections with multiple possible paths
    addEdgeWithWeight(0, 9);    // Left side connections
    addEdgeWithWeight(0, 1);
    addEdgeWithWeight(0, 2);
    addEdgeWithWeight(1, 9);
    addEdgeWithWeight(2, 9);
    addEdgeWithWeight(9, 11);   // Middle-left to center connections
    addEdgeWithWeight(9, 12);
    addEdgeWithWeight(11, 3);
    addEdgeWithWeight(12, 3);
    addEdgeWithWeight(3, 13);   // Center to middle-right connections
    addEdgeWithWeight(3, 14);
    addEdgeWithWeight(13, 10);
    addEdgeWithWeight(14, 10);
    addEdgeWithWeight(10, 4);   // Right side connections
    addEdgeWithWeight(10, 5);
    addEdgeWithWeight(10, 6);
    addEdgeWithWeight(4, 6);
    addEdgeWithWeight(5, 6);
    addEdgeWithWeight(1, 8);    // Top cross connections
    addEdgeWithWeight(8, 4);
    addEdgeWithWeight(8, 11);
    addEdgeWithWeight(8, 13);
    addEdgeWithWeight(2, 7);    // Bottom cross connections
    addEdgeWithWeight(7, 5);
    addEdgeWithWeight(7, 12);
    addEdgeWithWeight(7, 14);
    addEdgeWithWeight(11, 13);  // Center box connections
    addEdgeWithWeight(13, 14);
    addEdgeWithWeight(14, 12);
    addEdgeWithWeight(12, 11);
    addEdgeWithWeight(9, 3);    // Additional diagonal connections
    addEdgeWithWeight(3, 10);
    addEdgeWithWeight(1, 11);
    addEdgeWithWeight(4, 13);
    addEdgeWithWeight(2, 12);
    addEdgeWithWeight(5, 14);

    return g;
  });

  const [path, setPath] = useState([]);
  const [visited, setVisited] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNodeClick = (id) => {
    if (isAnimating) return;

    const clickedNode = graph.nodes.get(id);
    const hasStart = !!graph.getStartNode();
    const hasEnd = !!graph.getEndNode();

    if (!hasStart) {
      // First click - set start node
      graph.setStart(id);
    } else if (!hasEnd && !clickedNode.isStart) {
      // Second click - set end node if it's not the start node
      graph.setEnd(id);
    }

    setPath([]);
    setVisited([]);
    setTotalCost(0);
  };

  const resetMaze = () => {
    if (isAnimating) return;
    
    for (let [id, node] of graph.nodes) {
      node.isStart = false;
      node.isEnd = false;
    }
    
    setPath([]);
    setVisited([]);
    setTotalCost(0);
  };

  const solveMaze = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setPath([]);
    setVisited([]);
    setTotalCost(0);

    const result = dijkstra(graph);
    
    const delays = {
      fast: 100,
      medium: 300,
      slow: 500
    };

    for (let i = 0; i < result.visited.length; i++) {
      await new Promise(resolve => setTimeout(resolve, delays[speed]));
      setVisited(result.visited.slice(0, i + 1));
    }

    for (let i = 0; i < result.path.length; i++) {
      await new Promise(resolve => setTimeout(resolve, delays[speed]));
      setPath(result.path.slice(0, i + 1));
    }

    setTotalCost(result.cost);
    setIsAnimating(false);
  };

  const hasStart = !!graph.getStartNode();
  const hasEnd = !!graph.getEndNode();

  return (
    <div className="graph-maze">
      <div className="button-container">
        <button 
          className="solve-button"
          onClick={solveMaze}
          disabled={!hasStart || !hasEnd || isAnimating}
        >
          {isAnimating ? 'Solving...' : 'Solve'}
        </button>
        <button 
          className="reset-button"
          onClick={resetMaze}
          disabled={isAnimating}
        >
          Reset Maze
        </button>
      </div>
      <div className="status-message">
        {!hasStart ? "Select starting node" : !hasEnd ? "Select ending node" : totalCost > 0 ? `Shortest path cost: ${totalCost}` : "Click Solve to find path"}
      </div>
      <svg width="800" height="600">
        {/* Draw connections */}
        {Array.from(graph.nodes.entries()).map(([id, node]) => (
          node.connections.size > 0 && Array.from(node.connections).map(targetId => {
            const target = graph.nodes.get(targetId);
            const isInPath = path.length >= 2 && 
              path.some((p, i) => i < path.length - 1 && 
                ((p === id && path[i + 1] === targetId) || 
                 (p === targetId && path[i + 1] === id)));

            // Calculate midpoint for weight label
            const midX = (node.x + target.x) / 2;
            const midY = (node.y + target.y) / 2;
            const weight = graph.getWeight(id, targetId);

            return (
              <g key={`${id}-${targetId}`}>
                <line
                  x1={node.x}
                  y1={node.y}
                  x2={target.x}
                  y2={target.y}
                  className={isInPath ? 'path-line' : 'connection-line'}
                />
                <text
                  x={midX}
                  y={midY}
                  className="edge-weight"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  dy="-8"
                >
                  {weight}
                </text>
              </g>
            );
          })
        ))}
        
        {/* Draw nodes with labels */}
        {Array.from(graph.nodes.entries()).map(([id, node]) => (
          <g key={id} onClick={() => handleNodeClick(id)} className="node-group">
            <rect
              x={node.x - 25}
              y={node.y - 25}
              width="50"
              height="50"
              rx="5"
              ry="5"
              className={`node ${
                node.isStart ? 'start' : 
                node.isEnd ? 'end' :
                path.includes(parseInt(id)) ? 'in-path' :
                visited.includes(parseInt(id)) ? 'visited' :
                ''
              }`}
            />
            <text
              x={node.x}
              y={node.y + 6}
              className="node-label"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {id}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default GraphMaze;