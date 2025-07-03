export function dfs(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const visited = new Set();

  function dfsVisit(node) {
    if (!node || visited.has(`${node.row}-${node.col}`) || node.isWall) return false;

    visited.add(`${node.row}-${node.col}`);
    visitedNodesInOrder.push(node);

    if (node === endNode) return true;

    const neighbors = getNeighbors(node, grid);
    for (const neighbor of neighbors) {
      neighbor.previousNode = node;
      if (dfsVisit(neighbor)) return true;
    }

    return false;
  }

  dfsVisit(startNode);
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
