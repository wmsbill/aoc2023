const fs = require("node:fs");
const args = process.argv.slice(2);

function parse(fileContent) {
  return fileContent.map((grid) => grid.split("\n"));
}

function stringDiff(a, b) {
  let count = 0;

  if (!b) return a.length;

  if (a === b) return count;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) count++;
  }

  return count;
}

function isMirrored(grid, index) {
  let smudgeFixed = false;
  let start = index - 1;
  let finish = index;

  while (finish < grid.length && start >= 0) {
    let diff = stringDiff(grid[start], grid[finish]);

    if (diff > 1 || (smudgeFixed && diff > 0)) {
      return false;
    }

    if (diff === 1) {
      smudgeFixed = true;
    }

    start--;
    finish++;
  }

  return smudgeFixed;
}

function getMirrorIndex(grid) {
  let indexes = [];

  for (let [index, line] of grid.entries()) {
    let diff = stringDiff(line, grid[index + 1]);

    if (diff <= 1) {
      indexes.push(index + 1);
    }
  }

  indexes = indexes.filter((i) => isMirrored(grid, i));

  return indexes.length ? indexes[0] : 0;
}

function transpose(grid) {
  return grid[0].split("").map((_, i) => grid.map((line) => line[i]).join(""));
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split("\n\n");
  const grids = parse(fileContent);

  const horizontal = grids
    .map(getMirrorIndex)
    .map((i) => i * 100)
    .reduce((a, b) => a + b, 0);

  const vertical = grids
    .map(transpose)
    .map(getMirrorIndex)
    .reduce((a, b) => a + b, 0);

  return horizontal + vertical;
}

const result = main(args[0] ?? "./input/day13/1.test.txt");
console.log(result);
