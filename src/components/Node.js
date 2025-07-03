import React from 'react';
import './Node.css';

function Node({
  row,
  col,
  isWall,
  isStart,
  isEnd,
  isVisited,
  isPath,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) {
  let className = 'node';

  if (isStart) className += ' node-start';
  else if (isEnd) className += ' node-end';
  else if (isWall) className += ' node-wall';
  else if (isPath) className += ' node-path';
  else if (isVisited) className += ' node-visited';

  return (
    <div
      id={`node-${row}-${col}`}
      className={className}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
      title={`Row: ${row}, Col: ${col}`}
    ></div>
  );
}

export default Node;
