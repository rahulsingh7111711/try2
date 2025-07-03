export function dijkstra(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const unvisitedNodes = getAllNodes(grid);

  startNode.distance = 0;

  while (unvisitedNodes.length) {
    // Sort nodes by distance
    unvisitedNodes.sort((a, b) => a.distance - b.distance);

    const closestNode = unvisitedNodes.shift();

    // Skip walls
    if (closestNode.isWall) continue;

    // If distance is Infinity, we can't reach remaining nodes
    if (closestNode.distance === Infinity) break;

    closestNode.visited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode === endNode) break;

    updateUnvisitedNeighbors(closestNode, grid);
  }

  return visitedNodesInOrder;
}

function updateUnvisitedNeighbors(node, grid) {
  const neighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of neighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

function getUnvisitedNeighbors(node, grid) {
  const { row, col } = node;
  const neighbors = [];

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter(n => !n.visited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      node.distance = Infinity;
      node.visited = false;
      node.previousNode = null;
      nodes.push(node);
    }
  }
  return nodes;
}
