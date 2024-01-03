const fs = require("node:fs");
const args = process.argv.slice(2);

function parse(fileContent) {
  return fileContent.map((grid) => grid.split("\n"));
}

function isMirrored(grid, index) {
  let start = index - 1;
  let finish = index;
  while (finish < grid.length && start >= 0) {
    if (grid[start] !== grid[finish]) {
      return false;
    }

    start--;
    finish++;
  }

  return true;
}

function getMirrorIndex(grid) {
  let indexes = [];
  for (let [index, line] of grid.entries()) {
    if (line === grid[index + 1]) {
      indexes.push(index + 1);
    }
  }

  indexes = indexes.filter((i) => isMirrored(grid, i));

  return indexes.length ? indexes : [0];
}

function transpose(grid) {
  return grid[0].split("").map((_, i) => grid.map((line) => line[i]).join(""));
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split("\n\n");
  const grids = parse(fileContent);

  const horizontal = grids
    .flatMap(getMirrorIndex)
    .map((i) => i * 100)
    .reduce((a, b) => a + b, 0);

  const vertical = grids
    .map(transpose)
    .flatMap(getMirrorIndex)
    .reduce((a, b) => a + b, 0);

  return horizontal + vertical;
}

const result = main(args[0] ?? "./input/day13/1.test.txt");
console.log(result);
