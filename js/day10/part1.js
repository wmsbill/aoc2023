const fs = require("node:fs");
const args = process.argv.slice(2);

function findStartPosition(lines) {
  let line, col;

  for (line = 0; line < lines.length; line++) {
    col = lines[line].indexOf("S");
    if (col !== -1) {
      return [line, col];
    }
  }
}

function parse(fileContent) {
  const start = findStartPosition(fileContent);
  const maze = fileContent.map((line) => line.split(""));

  return [start, maze];
}

const startNavigation = {
  U: new Set(["|", 7, "F"]),
  D: new Set(["|", "L", "J"]),
  R: new Set(["-", "7", "J"]),
  L: new Set(["-", "F", "L"]),
};

function getStartNodes(start, maze) {
  const [line, col] = start;
  const startNodes = [];

  for (const [direction, navigation] of Object.entries(startNavigation)) {
    const [lineDelta, colDelta] =
      direction === "U"
        ? [-1, 0]
        : direction === "D"
        ? [1, 0]
        : direction === "R"
        ? [0, 1]
        : [-1, 0];
    const [newLine, newCol] = [line + lineDelta, col + colDelta];
    const newChar = maze[newLine]?.[newCol] ?? "";

    if (navigation.has(newChar)) {
      startNodes.push([newLine, newCol, direction]);
    }
  }

  return startNodes;
}

const commands = {
  U: {
    "|": "U",
    7: "L",
    F: "R",
  },
  D: {
    "|": "D",
    L: "R",
    J: "L",
  },
  R: {
    "-": "R",
    7: "D",
    J: "U",
  },
  L: {
    "-": "L",
    F: "D",
    L: "U",
  },
};

const navigation = {
  U: [-1, 0],
  D: [1, 0],
  R: [0, 1],
  L: [0, -1],
};

function findLoopLength(start, maze, direction) {
  let position = start;
  let pipe;
  let steps = 0;
  let command = direction;

  while (command) {
    const [line, col] = position;

    steps++;
    pipe = maze[line][col];
    maze[line][col] = "x";
    command = commands?.[command]?.[pipe] ?? "";

    if (!command) {
      break;
    }

    const [lineDelta, colDelta] = navigation[command];
    const [newLine, newCol] = [line + lineDelta, col + colDelta];

    position = [newLine, newCol];
  }

  return pipe === "S" ? steps : -1;
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split("\n");
  const [start, maze] = parse(fileContent);

  const startNodes = getStartNodes(start, maze);
  const pathLengths = startNodes.map(([line, col, direction]) =>
    findLoopLength([line, col], maze, direction)
  );

  return Math.floor(Math.max(...pathLengths) / 2);
}

//357;

const result = main(args[0] ?? "./input/day10/1.test.txt");
console.log(result);
