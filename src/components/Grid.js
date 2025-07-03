import React, { useState, useEffect } from 'react';
import Node from './Node';
import './Grid.css';

import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';
import { dijkstra } from '../algorithms/dijkstra';
import { aStar } from '../algorithms/astar';
import { generateRandomMaze } from '../algorithms/mazeGenerator';
import { recursiveDivision } from '../algorithms/recursiveDivision';

import {
  START_NODE_ROW,
  START_NODE_COL,
  END_NODE_ROW,
  END_NODE_COL,
} from '../constants';

const NUM_ROWS = 20;
const NUM_COLS = 50;

function createInitialGrid() {
  const grid = [];
  for (let row = 0; row < NUM_ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < NUM_COLS; col++) {
      currentRow.push({
        row,
        col,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isEnd: row === END_NODE_ROW && col === END_NODE_COL,
        isWall: false,
        distance: Infinity,
        visited: false,
        previousNode: null,
        g: Infinity,
        f: Infinity,
      });
    }
    grid.push(currentRow);
  }
  return grid;
}

function cloneGrid(grid) {
  return grid.map(row =>
    row.map(node => ({
      ...node,
      visited: false,
      distance: Infinity,
      previousNode: null,
      g: Infinity,
      f: Infinity,
    }))
  );
}

function toggleWall(grid, row, col) {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  if (node.isStart || node.isEnd) return newGrid;
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
}

function Grid() {
  const [grid, setGrid] = useState([]);
  const [speed, setSpeed] = useState(10); // default 10ms delay
  const [mouseIsPressed, setMouseIsPressed] = useState(false);

  useEffect(() => {
    setGrid(createInitialGrid());
  }, []);

  function handleMouseDown(row, col) {
    const newGrid = toggleWall(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  }

  function handleMouseEnter(row, col) {
    if (!mouseIsPressed) return;
    const newGrid = toggleWall(grid, row, col);
    setGrid(newGrid);
  }

  function handleMouseUp() {
    setMouseIsPressed(false);
  }

  function generateMaze() {
    clearVisualStyles();
    const mazeGrid = generateRandomMaze(grid);
    setGrid(mazeGrid);
  }


  function visualizeBFS() {
    clearVisualStyles();
    const newGrid = cloneGrid(grid);
    const startNode = newGrid[START_NODE_ROW][START_NODE_COL];
    const endNode = newGrid[END_NODE_ROW][END_NODE_COL];
    const visitedNodesInOrder = bfs(newGrid, startNode, endNode);
    const shortestPathNodes = getShortestPath(endNode);
    animateTraversal(visitedNodesInOrder, shortestPathNodes);
  }

  function visualizeDFS() {
    clearVisualStyles();
    const newGrid = cloneGrid(grid);
    const startNode = newGrid[START_NODE_ROW][START_NODE_COL];
    const endNode = newGrid[END_NODE_ROW][END_NODE_COL];
    const visitedNodesInOrder = dfs(newGrid, startNode, endNode);
    const shortestPathNodes = getShortestPath(endNode);
    animateTraversal(visitedNodesInOrder, shortestPathNodes);
  }

  function visualizeDijkstra() {
    clearVisualStyles();
    const newGrid = cloneGrid(grid);
    const startNode = newGrid[START_NODE_ROW][START_NODE_COL];
    const endNode = newGrid[END_NODE_ROW][END_NODE_COL];
    const visitedNodesInOrder = dijkstra(newGrid, startNode, endNode);
    const shortestPathNodes = getShortestPath(endNode);
    animateTraversal(visitedNodesInOrder, shortestPathNodes);
  }

  function visualizeAStar() {
    clearVisualStyles();
    const newGrid = cloneGrid(grid);
    const startNode = newGrid[START_NODE_ROW][START_NODE_COL];
    const endNode = newGrid[END_NODE_ROW][END_NODE_COL];
    const visitedNodesInOrder = aStar(newGrid, startNode, endNode);
    const shortestPathNodes = getShortestPath(endNode);
    animateTraversal(visitedNodesInOrder, shortestPathNodes);
  }

  function animateTraversal(visitedNodesInOrder, shortestPathNodes) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(shortestPathNodes);
        }, speed * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (element && !node.isStart && !node.isEnd) {
          element.classList.add('node-visited');
        }
      }, speed * i);
    }
  }

  function animateShortestPath(nodesInPathOrder) {
    for (let i = 0; i < nodesInPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInPathOrder[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (element && !node.isStart && !node.isEnd) {
          element.classList.add('node-shortest-path');
        }
      }, (speed + 40) * i);
    }
  }

  function getShortestPath(endNode) {
    const path = [];
    let current = endNode;
    while (current !== null && current.previousNode) {
      path.unshift(current);
      current = current.previousNode;
    }
    return path;
  }

  function resetGrid() {
    clearVisualStyles();
    const freshGrid = createInitialGrid();
    setGrid(freshGrid);
  }

  function clearVisualStyles() {
    for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLS; col++) {
        const element = document.getElementById(`node-${row}-${col}`);
        if (element) {
          element.classList.remove('node-visited', 'node-shortest-path');
        }
      }
    }
  }

  function generateRecursiveMaze() {
    clearVisualStyles();
    const newGrid = cloneGrid(grid);
    const walls = [];
    recursiveDivision(newGrid, 0, NUM_ROWS - 1, 0, NUM_COLS - 1, 'horizontal', walls);

    let delay = 0;
    for (let i = 0; i < walls.length; i++) {
      const [row, col] = walls[i];
      if (
        (row === START_NODE_ROW && col === START_NODE_COL) ||
        (row === END_NODE_ROW && col === END_NODE_COL)
      )
        continue;

      setTimeout(() => {
        const node = newGrid[row][col];
        if (node) {
          node.isWall = true;
          const element = document.getElementById(`node-${row}-${col}`);
          if (element) element.classList.add('node-wall');
        }
      }, delay);
      delay += speed;
    }

    setTimeout(() => setGrid(newGrid), delay);
  }


  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Animation Speed: {speed}ms
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={visualizeBFS}>Visualize BFS</button>
        
        <button onClick={visualizeDijkstra}>Visualize Dijkstra</button>
        <button onClick={visualizeAStar}>Visualize A*</button>
        <button onClick={visualizeDFS}>Visualize DFS</button>
        
        <button onClick={generateMaze}>Generate Maze</button>
        <button onClick={generateRecursiveMaze}>Generate Recursive Maze</button>
        <button onClick={resetGrid}>Reset Grid</button>

      </div>

      <div className="grid">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="grid-row">
            {row.map((node, nodeIdx) => {
              const { row, col, isWall, isStart, isEnd } = node;
              return (
                <Node
                  key={nodeIdx}
                  row={row}
                  col={col}
                  isWall={isWall}
                  isStart={isStart}
                  isEnd={isEnd}
                  onMouseDown={handleMouseDown}
                  onMouseEnter={handleMouseEnter}
                  onMouseUp={handleMouseUp}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Grid;
