const fs = require("node:fs");
const args = process.argv.slice(2);

const coordinate = {
  up: [-1, 0],
  down: [1, 0],
  right: [0, 1],
  left: [0, -1],
};

const directionMap = {
  up: {
    ".": ["up"],
    "|": ["up"],
    "/": ["right"],
    "\\": ["left"],
    "-": ["left", "right"],
  },
  down: {
    ".": ["down"],
    "|": ["down"],
    "/": ["left"],
    "\\": ["right"],
    "-": ["left", "right"],
  },
  right: {
    ".": ["right"],
    "|": ["up", "down"],
    "/": ["up"],
    "\\": ["down"],
    "-": ["right"],
  },
  left: {
    ".": ["left"],
    "|": ["up", "down"],
    "/": ["down"],
    "\\": ["up"],
    "-": ["left"],
  },
};

function countEnergizedCells(grid, line, col, direction, counter) {
  const queue = [[line, col, direction]];

  while (queue.length > 0) {
    const [line, col, direction] = queue.shift();
    const index = `${line},${col}`;

    if (counter.get(index)?.includes(direction)) {
      continue;
    }

    if (line < 0 || line >= grid.length || col < 0 || col >= grid[0].length) {
      continue;
    }

    if (counter.has(index)) {
      counter.get(index).push(direction);
    } else {
      counter.set(index, [direction]);
    }

    const cell = grid[line].charAt(col);
    const newDir = directionMap[direction][cell];

    for (let dir of newDir) {
      const [lineOffset, colOffset] = coordinate[dir];
      queue.push([line + lineOffset, col + colOffset, dir]);
    }
  }
}

function main(file) {
  const grid = fs.readFileSync(file, "utf8").split("\n");
  const counter = new Map();

  countEnergizedCells(grid, 0, 0, "right", counter);

  return counter.size;
}

const result = main(args[0] ?? "./input/day16/1.test.txt");
console.log(result);
