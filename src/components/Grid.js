import React, { useState, useEffect } from "react";
import "../style/grid.css";

const Grid = ({ algorithm, speed }) => {
    const [grid, setGrid] = useState([]);
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [isVisualizing, setIsVisualizing] = useState(false);

    // Speed settings in milliseconds
    const speeds = {
        slow: 100,
        medium: 50,
        fast: 20
    };

    useEffect(() => {
        initializeGrid();
    }, []);

    function initializeGrid() {
        const rows = 15;
        const cols = 25;
        const newGrid = [];
        for (let row = 0; row < rows; row++) {
            const currentRow = [];
            for (let col = 0; col < cols; col++) {
                currentRow.push({
                    row,
                    col,
                    isWall: false,
                    isStart: false,
                    isEnd: false,
                    isVisited: false,
                    isPath: false
                });
            }
            newGrid.push(currentRow);
        }
        setGrid(newGrid);
        setStart(null);
        setEnd(null);
    }

    function handleCellClick(row, col) {
        if (isVisualizing) return;
        
        const newGrid = grid.map(row => [...row]);
        const cell = newGrid[row][col];

        if (!start) {
            cell.isStart = true;
            setStart({ row, col });
        } else if (!end) {
            cell.isEnd = true;
            setEnd({ row, col });
        } else {
            cell.isWall = !cell.isWall;
        }
        setGrid(newGrid);
    }

    async function visualize(visitedNodes, path) {
        for (let node of visitedNodes) {
            if (!node.isStart && !node.isEnd) {
                await new Promise(resolve => setTimeout(resolve, speeds[speed]));
                const newGrid = grid.map(row => [...row]);
                newGrid[node.row][node.col].isVisited = true;
                setGrid(newGrid);
            }
        }

        for (let node of path) {
            if (!node.isStart && !node.isEnd) {
                await new Promise(resolve => setTimeout(resolve, speeds[speed]));
                const newGrid = grid.map(row => [...row]);
                newGrid[node.row][node.col].isPath = true;
                setGrid(newGrid);
            }
        }
        setIsVisualizing(false);
    }

    function getCellClassName(cell) {
        if (cell.isStart) return 'cell start';
        if (cell.isEnd) return 'cell end';
        if (cell.isPath) return 'cell path';
        if (cell.isVisited) return 'cell visited';
        if (cell.isWall) return 'cell wall';
        return 'cell';
    }

    async function solveMaze() {
        if (!start || !end || isVisualizing) return;
        setIsVisualizing(true);
        
        const visitedNodes = [];
        const path = [];
        
        // Reset visualization
        const resetGrid = grid.map(row =>
            row.map(cell => ({
                ...cell,
                isVisited: false,
                isPath: false
            }))
        );
        setGrid(resetGrid);

        // Run selected algorithm
        switch (algorithm) {
            case 'dfs':
                dfs(start, new Set(), visitedNodes, path);
                break;
            case 'bfs':
                bfs(start, visitedNodes, path);
                break;
            default:
                dfs(start, new Set(), visitedNodes, path);
        }

        await visualize(visitedNodes, path.reverse());
    }

    function dfs(cell, visited, visitedNodes, path) {
        if (cell.row === end.row && cell.col === end.col) {
            path.push(cell);
            return true;
        }

        visited.add(`${cell.row}-${cell.col}`);
        visitedNodes.push(cell);

        const neighbors = getNeighbors(cell);
        for (const neighbor of neighbors) {
            if (!visited.has(`${neighbor.row}-${neighbor.col}`) && !neighbor.isWall) {
                if (dfs(neighbor, visited, visitedNodes, path)) {
                    path.push(cell);
                    return true;
                }
            }
        }
        return false;
    }

    function bfs(start, visitedNodes, path) {
        const queue = [start];
        const visited = new Set([`${start.row}-${start.col}`]);
        const parent = new Map();

        while (queue.length > 0) {
            const current = queue.shift();
            visitedNodes.push(current);

            if (current.row === end.row && current.col === end.col) {
                let curr = current;
                while (curr) {
                    path.push(curr);
                    curr = parent.get(`${curr.row}-${curr.col}`);
                }
                return true;
            }

            const neighbors = getNeighbors(current);
            for (const neighbor of neighbors) {
                const key = `${neighbor.row}-${neighbor.col}`;
                if (!visited.has(key) && !neighbor.isWall) {
                    visited.add(key);
                    parent.set(key, current);
                    queue.push(neighbor);
                }
            }
        }
        return false;
    }

    function getNeighbors(cell) {
        const neighbors = [];
        const { row, col } = cell;
        if (row > 0) neighbors.push(grid[row - 1][col]);
        if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
        if (col > 0) neighbors.push(grid[row][col - 1]);
        if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
        return neighbors;
    }

    return (
        <div className="grid-container">
            <div className="button-container">
                <button 
                    onClick={solveMaze} 
                    disabled={!start || !end || isVisualizing}
                    className="solve-button"
                >
                    {isVisualizing ? 'Visualizing...' : 'Solve Maze'}
                </button>
                <button 
                    onClick={initializeGrid}
                    disabled={isVisualizing}
                    className="reset-button"
                >
                    Reset Grid
                </button>
            </div>
            <div className="grid">
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid-row">
                        {row.map((cell, cellIndex) => (
                            <div
                                key={`${rowIndex}-${cellIndex}`}
                                className={getCellClassName(cell)}
                                onClick={() => handleCellClick(cell.row, cell.col)}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Grid;
