class Graph {
  constructor() {
    this.nodes = new Map();  // Map of node ID to {x, y, connections}
    this.weights = new Map(); // Map of "node1-node2" to weight
  }

  addNode(id, x, y) {
    if (!this.nodes.has(id)) {
      this.nodes.set(id, {
        id,
        x,
        y,
        connections: new Set(),
        isStart: false,
        isEnd: false,
        isBlocked: false
      });
    }
    return this;
  }

  addConnection(id1, id2, weight = 1) {
    if (this.nodes.has(id1) && this.nodes.has(id2)) {
      this.nodes.get(id1).connections.add(id2);
      this.nodes.get(id2).connections.add(id1);
      
      // Store weight for both directions
      this.weights.set(`${id1}-${id2}`, weight);
      this.weights.set(`${id2}-${id1}`, weight);
    }
    return this;
  }

  getWeight(id1, id2) {
    return this.weights.get(`${id1}-${id2}`) || 1;
  }

  setStart(id) {
    if (this.nodes.has(id)) {
      // Clear any existing start node
      for (let [_, node] of this.nodes) {
        node.isStart = false;
      }
      this.nodes.get(id).isStart = true;
    }
    return this;
  }

  setEnd(id) {
    if (this.nodes.has(id)) {
      // Clear any existing end node
      for (let [_, node] of this.nodes) {
        node.isEnd = false;
      }
      this.nodes.get(id).isEnd = true;
    }
    return this;
  }

  getConnections(id) {
    return this.nodes.has(id) ? Array.from(this.nodes.get(id).connections) : [];
  }

  getStartNode() {
    for (let [_, node] of this.nodes) {
      if (node.isStart) return node;
    }
    return null;
  }

  getEndNode() {
    for (let [_, node] of this.nodes) {
      if (node.isEnd) return node;
    }
    return null;
  }

  calculateDistance(id1, id2) {
    const node1 = this.nodes.get(id1);
    const node2 = this.nodes.get(id2);
    if (!node1 || !node2) return 0;
    
    // Calculate Euclidean distance
    const dx = node2.x - node1.x;
    const dy = node2.y - node1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

export default Graph;