export function generateRandomMaze(grid) {
  const newGrid = grid.slice();

  for (let row = 0; row < newGrid.length; row++) {
    for (let col = 0; col < newGrid[0].length; col++) {
      const node = newGrid[row][col];

      if (!node.isStart && !node.isEnd) {
        if (Math.random() < 0.25) {
          node.isWall = true;
        }
      }
    }
  }

  return newGrid;
}
