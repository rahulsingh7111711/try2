export function recursiveDivision(grid, startRow, endRow, startCol, endCol, orientation, walls) {
  const numRows = grid.length;
  const numCols = grid[0].length;

  if (endRow < startRow || endCol < startCol) return;

  if (orientation === 'horizontal') {
    const possibleRows = [];
    for (let i = startRow + 1; i <= endRow - 1; i += 2) {
      possibleRows.push(i);
    }

    if (possibleRows.length === 0) return;

    const row = possibleRows[Math.floor(Math.random() * possibleRows.length)];

    const possibleCols = [];
    for (let i = startCol; i <= endCol; i += 2) {
      possibleCols.push(i);
    }

    const hole = possibleCols[Math.floor(Math.random() * possibleCols.length)];

    for (let col = startCol; col <= endCol; col++) {
      if (col !== hole) {
        if (row >= 0 && row < numRows && col >= 0 && col < numCols) {
          walls.push([row, col]);
        }
      }
    }

    recursiveDivision(grid, startRow, row - 1, startCol, endCol, chooseOrientation(row - 1 - startRow, endCol - startCol), walls);
    recursiveDivision(grid, row + 1, endRow, startCol, endCol, chooseOrientation(endRow - (row + 1), endCol - startCol), walls);

  } else {
    const possibleCols = [];
    for (let i = startCol + 1; i <= endCol - 1; i += 2) {
      possibleCols.push(i);
    }

    if (possibleCols.length === 0) return;

    const col = possibleCols[Math.floor(Math.random() * possibleCols.length)];

    const possibleRows = [];
    for (let i = startRow; i <= endRow; i += 2) {
      possibleRows.push(i);
    }

    const hole = possibleRows[Math.floor(Math.random() * possibleRows.length)];

    for (let row = startRow; row <= endRow; row++) {
      if (row !== hole) {
        if (row >= 0 && row < numRows && col >= 0 && col < numCols) {
          walls.push([row, col]);
        }
      }
    }

    recursiveDivision(grid, startRow, endRow, startCol, col - 1, chooseOrientation(endRow - startRow, col - 1 - startCol), walls);
    recursiveDivision(grid, startRow, endRow, col + 1, endCol, chooseOrientation(endRow - startRow, endCol - (col + 1)), walls);
  }
}

function chooseOrientation(height, width) {
  if (width < height) return 'horizontal';
  if (height < width) return 'vertical';
  return Math.random() < 0.5 ? 'horizontal' : 'vertical';
}
