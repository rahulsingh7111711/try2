export function bfs(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const queue = [];
  const visited = new Set();

  queue.push(startNode);
  visited.add(`${startNode.row}-${startNode.col}`);

  while (queue.length > 0) {
    const current = queue.shift();

    if (current.isWall) continue;
    visitedNodesInOrder.push(current);

    if (current === endNode) return visitedNodesInOrder;

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      const key = `${neighbor.row}-${neighbor.col}`;
      if (!visited.has(key)) {
        neighbor.previousNode = current;
        visited.add(key);
        queue.push(neighbor);
      }
    }
  }

  return visitedNodesInOrder;
}

function getNeighbors(node, grid) {
  const { row, col } = node;
  const neighbors = [];

  if (row > 0) neighbors.push(grid[row - 1][col]); // up
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // down
  if (col > 0) neighbors.push(grid[row][col - 1]); // left
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // right

  return neighbors;
}
