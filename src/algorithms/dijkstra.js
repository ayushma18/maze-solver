class PriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(node, priority) {
    this.values.push({ node, priority });
    this.sort();
  }

  dequeue() {
    return this.values.shift();
  }

  sort() {
    this.values.sort((a, b) => a.priority - b.priority);
  }
}

export const dijkstra = (graph) => {
  const startNode = graph.getStartNode();
  const endNode = graph.getEndNode();
  
  if (!startNode || !endNode) return { path: [], visited: [], cost: 0 };

  const nodes = new Map();
  const visited = [];
  const queue = new PriorityQueue();

  // Initialize distances
  for (let [id, _] of graph.nodes) {
    nodes.set(id, {
      distance: Infinity,
      previous: null
    });
  }

  // Set start node distance to 0
  nodes.get(startNode.id).distance = 0;
  queue.enqueue(startNode.id, 0);

  while (queue.values.length > 0) {
    const { node: currentId } = queue.dequeue();
    const currentNode = graph.nodes.get(currentId);
    visited.push(currentId);

    // If we reached the end node, we're done
    if (currentId === endNode.id) break;

    // Check each neighbor
    for (let neighborId of currentNode.connections) {
      const weight = graph.getWeight(currentId, neighborId);
      const totalDistance = nodes.get(currentId).distance + weight;

      if (totalDistance < nodes.get(neighborId).distance) {
        nodes.get(neighborId).distance = totalDistance;
        nodes.get(neighborId).previous = currentId;
        queue.enqueue(neighborId, totalDistance);
      }
    }
  }

  // Build the shortest path
  const path = [];
  let current = endNode.id;
  let totalCost = nodes.get(endNode.id).distance;

  while (current !== null) {
    path.unshift(current);
    current = nodes.get(current).previous;
  }

  return {
    path,
    visited,
    cost: totalCost
  };
};