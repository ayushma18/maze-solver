export function astar(graph) {
    const start = graph.getStartNode();
    const end = graph.getEndNode();
    
    if (!start || !end) return { path: [], visited: [], cost: 0 };

    // Priority queue to store nodes to visit
    // Each element is [nodeId, fScore]
    const openSet = [[start.id, 0]];
    const visited = [];
    
    // Track g scores (cost from start to node)
    const gScore = new Map();
    gScore.set(start.id, 0);
    
    // Track f scores (total estimated cost)
    const fScore = new Map();
    fScore.set(start.id, heuristic(graph, start.id, end.id));
    
    // Track path
    const cameFrom = new Map();
    
    while (openSet.length > 0) {
        // Sort by f score and get node with lowest score
        openSet.sort((a, b) => fScore.get(a[0]) - fScore.get(b[0]));
        const [current, _] = openSet.shift();
        visited.push(current);
        
        // Found the goal
        if (current === end.id) {
            return {
                path: reconstructPath(cameFrom, current),
                visited,
                cost: gScore.get(current)
            };
        }
        
        // Check all neighbors
        for (const neighbor of graph.nodes.get(current).connections) {
            const weight = graph.getWeight(current, neighbor);
            const tentativeGScore = gScore.get(current) + weight;
            
            // If this path is better than previous one
            if (!gScore.has(neighbor) || tentativeGScore < gScore.get(neighbor)) {
                // Update path
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentativeGScore);
                fScore.set(neighbor, tentativeGScore + heuristic(graph, neighbor, end.id));
                
                // Add to open set if not already there
                if (!openSet.some(([id, _]) => id === neighbor)) {
                    openSet.push([neighbor, fScore.get(neighbor)]);
                }
            }
        }
    }
    
    // No path found
    return { path: [], visited, cost: 0 };
}

// Heuristic function: Euclidean distance
function heuristic(graph, currentId, endId) {
    const current = graph.nodes.get(currentId);
    const end = graph.nodes.get(endId);
    const dx = end.x - current.x;
    const dy = end.y - current.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Reconstruct path from end to start
function reconstructPath(cameFrom, current) {
    const path = [current];
    while (cameFrom.has(current)) {
        current = cameFrom.get(current);
        path.unshift(current);
    }
    return path;
}