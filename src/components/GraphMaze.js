import React, { useState } from 'react';
import Graph from '../utils/graph';
import './GraphMaze.css';
import { dijkstra } from '../algorithms/dijkstra';
import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';
import { astar } from '../algorithms/astar';

const algorithmMap = {
  'dijkstra': dijkstra,
  'bfs': bfs,
  'dfs': dfs,
  'astar': astar
};

const GraphMaze = ({ algorithm = 'dijkstra', speed }) => {
  const [graph] = useState(() => {
    const g = new Graph();
    
    // Define positions for 7 nodes (excluding center node)
    const positions = [
      { x: 200, y: 150 },   // 0: top-left
      { x: 400, y: 100 },   // 1: top
      { x: 600, y: 150 },   // 2: top-right
      { x: 150, y: 300 },   // 3: left
      { x: 650, y: 300 },   // 4: right (previously 5)
      { x: 250, y: 450 },   // 5: bottom-left (previously 6)
      { x: 550, y: 450 },   // 6: bottom-right (previously 7)
    ];
    
    positions.forEach((pos, i) => {
      g.addNode(i, pos.x, pos.y);
    });

    // Add connections with weights based on distance
    const addEdgeWithWeight = (id1, id2) => {
      const weight = Math.round(g.calculateDistance(id1, id2) / 10);
      g.addConnection(id1, id2, weight);
    };

    // Create connections between 7 nodes
    g.addConnection(0, 1, 20);  // top edge
    g.addConnection(1, 2, 20);  // top edge
    g.addConnection(0, 3, 15);  // left side
    g.addConnection(2, 4, 15);  // right side
    g.addConnection(3, 5, 20);  // left bottom
    g.addConnection(4, 6, 20);  // right bottom
    g.addConnection(5, 6, 30);  // bottom edge
    
    // Cross connections for alternate paths
    g.addConnection(0, 5, 35);  // left diagonal
    g.addConnection(2, 6, 35);  // right diagonal
    g.addConnection(1, 4, 40);  // top-right path
    g.addConnection(3, 6, 25);  // bottom diagonal

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

    const selectedAlgorithm = algorithmMap[algorithm] || dijkstra;
    const result = selectedAlgorithm(graph);
    
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
      <svg width="800" height="500" style={{ backgroundColor: '#f8f9fa' }}>
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
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