export const dfs = (graph) => {
  const startNode = graph.getStartNode();
  const endNode = graph.getEndNode();
  
  if (!startNode || !endNode) return { path: [], visited: [], cost: 0 };

  const visited = [];
  const stack = [startNode.id];
  const parent = new Map();
  let totalCost = 0;

  while (stack.length > 0) {
    const currentId = stack.pop();
    const currentNode = graph.nodes.get(currentId);

    if (!visited.includes(currentId)) {
      visited.push(currentId);

      if (currentId === endNode.id) {
        break;
      }

      for (let neighborId of currentNode.connections) {
        const neighborNode = graph.nodes.get(neighborId);
        // Skip blocked nodes
        if (neighborNode.isBlocked) continue;
        
        if (!visited.includes(neighborId)) {
          stack.push(neighborId);
          if (!parent.has(neighborId)) {
            parent.set(neighborId, currentId);
          }
        }
      }
    }
  }

  // Build the path
  const path = [];
  let current = endNode.id;

  while (current !== undefined && current !== startNode.id) {
    path.unshift(current);
    current = parent.get(current);
    if (path.length > 0) {
      const prevNode = current;
      totalCost += graph.getWeight(prevNode, path[0]);
    }
  }

  if (current === startNode.id) {
    path.unshift(startNode.id);
  }

  return {
    path,
    visited,
    cost: totalCost
  };
};