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
  let startDirection = "";
  const [line, col] = start;
  const startNodes = [];
  const startCharMap = {
    DR: "F",
    RD: "F",
    DL: "7",
    LD: "7",
    UR: "L",
    RU: "L",
    UL: "J",
    LU: "J",
    LR: "-",
    RL: "-",
    UD: "|",
    DU: "|",
  };

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
      startDirection += "" + direction;
      startNodes.push([newLine, newCol, direction]);
    }
  }

  maze[line][col] = startCharMap[startDirection];

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

const cache = new Map();
function findLoopLength(start, maze, direction) {
  let position = start;
  let pipe;
  let steps = 0;
  let command = direction;

  while (command) {
    const [line, col] = position;

    steps++;
    pipe = maze[line][col];
    cache.set([line, col], pipe);
    maze[line][col] = "x";
    command = commands?.[command]?.[pipe] ?? "";

    if (!command) {
      break;
    }

    const [lineDelta, colDelta] = navigation[command];
    const [newLine, newCol] = [line + lineDelta, col + colDelta];

    position = [newLine, newCol];
  }
}

function cleanupMaze(maze) {
  const newMaze = maze.map((line) =>
    line.join("").replace(/[^x]/g, "0").split("")
  );

  for (const [key, value] of cache.entries()) {
    const [line, col] = key;
    newMaze[line][col] = value;
  }
  return newMaze;
}

function findEnclosedTiles(maze) {
  let enclosedTiles = 0;
  for (let line = 0; line < maze.length; line++) {
    for (let col = 0; col < maze[line].length; col++) {
      if (maze[line][col] === "0" && isEnclosed(line, col, maze)) {
        enclosedTiles++;
      }
    }
  }

  return enclosedTiles;
}

const curvedPipes = {
  J: "L",
  7: "F",
};
function isEnclosed(line, col, maze) {
  if (
    line === 0 ||
    col === 0 ||
    line === maze.length ||
    col === maze[line].length
  ) {
    maze[line][col] = " `";
    return false;
  }

  let pipes = 0;
  let lastCurvedPipe = "";

  for (let i = col; i < maze[line].length; i++) {
    if (maze[line][i] === "|") {
      pipes++;
    }

    if (maze[line][i] === "F") {
      lastCurvedPipe = "F";
      continue;
    }

    if (maze[line][i] === "L") {
      lastCurvedPipe = "L";
      continue;
    }

    if (maze[line][i] === "7" && lastCurvedPipe !== "F") {
      lastCurvedPipe = " ";
      pipes++;
    }

    if (maze[line][i] === "J" && lastCurvedPipe !== "L") {
      lastCurvedPipe = "";
      pipes++;
    }
  }

  if (pipes % 2) {
    maze[line][col] = "2";
    return true;
  } else {
    maze[line][col] = " ";
    return false;
  }
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split("\n");
  const [start, maze] = parse(fileContent);

  getStartNodes(start, maze).map(([line, col, direction]) =>
    findLoopLength([line, col], maze, direction)
  );

  const newMaze = cleanupMaze(maze);

  let amount = findEnclosedTiles(newMaze);

  console.info(newMaze.map((line) => line.join("")));

  return amount;
}

const result = main(args[0] ?? "./input/day10/2.test.txt");
console.log(result);
