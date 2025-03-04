export const bfs = (graph) => {
  const startNode = graph.getStartNode();
  const endNode = graph.getEndNode();
  
  if (!startNode || !endNode) return { path: [], visited: [] };

  const queue = [[startNode]];  // Queue of paths
  const visited = new Set([startNode]);
  const visitedOrder = [startNode];  // Order of visited nodes for visualization

  while (queue.length > 0) {
    const currentPath = queue.shift();
    const currentNode = currentPath[currentPath.length - 1];

    if (currentNode === endNode) {
      return {
        path: currentPath,
        visited: visitedOrder
      };
    }

    const connections = graph.getConnections(currentNode);
    for (const neighbor of connections) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        visitedOrder.push(neighbor);
        queue.push([...currentPath, neighbor]);
      }
    }
  }

  return { path: [], visited: visitedOrder };
};