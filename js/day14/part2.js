const fs = require("node:fs");
const { get } = require("node:http");
const args = process.argv.slice(2);

function calculateWeigh(grid) {
  const length = grid.length;
  let weights = 0;

  for (let [line, row] of grid.entries()) {
    for (let char of row) {
      if (char === "O") {
        weights += length - line;
      }
    }
  }

  return weights;
}

function tilt(grid) {
  const pointers = Array.from({ length: grid[0].length }, () => 0);

  for (let [line, row] of grid.entries()) {
    for (let [col, char] of row.entries()) {
      if (char === "#") {
        pointers[col] = line + 1;
      }

      if (char === "O") {
        grid[line][col] = ".";
        grid[pointers[col]][col] = "O";
        pointers[col]++;
      }
    }
  }
}

function transpose(grid) {
  return grid[0].map((_, i) => grid.map((row) => row[i]).reverse());
}

function cycleDish(grid) {
  for (let i = 0; i < 4; i++) {
    tilt(grid);
    grid = transpose(grid);
  }

  return grid;
}

function main(file) {
  let grid = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((line) => line.split(""));

  const cache = new Map();

  let start,
    finish = 0;
  const weightList = [];

  for (let i = 0; i < 1e9; i++) {
    grid = cycleDish(grid);
    weightList.push(calculateWeigh(grid));
    const stringGrid = grid.map((row) => row.join("")).join("\n");

    if (cache.has(stringGrid)) {
      start = cache.get(stringGrid);
      finish = i;
      break;
    } else {
      cache.set(stringGrid, i);
    }
  }

  const index = ((1e9 - start - 1) % (finish - start)) + start;

  return weightList[index];
}

const result = main(args[0] ?? "./input/day14/1.test.txt");
console.log(result);
