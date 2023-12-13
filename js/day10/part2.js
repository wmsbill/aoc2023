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

function findLoop(start, maze, direction) {
  const [startLine, startCol] = start;
  const cache = [];

  let [line, col] = start;
  let pipe;
  let steps = 0;
  let command = direction;

  while (true) {
    pipe = maze[line][col];
    steps++;
    cache.push([line, col, pipe]);
    command = commands?.[command]?.[pipe] ?? "";

    const [lineDelta, colDelta] = navigation[command];
    [line, col] = [line + lineDelta, col + colDelta];

    if (Number.isNaN(line) || (line === startLine && col === startCol)) {
      break;
    }
  }

  return cache;
}

function recreatePipeMaze(lines, cols, cache) {
  const newMaze = Array.from({ length: lines }, () =>
    Array.from({ length: cols }, () => ".")
  );

  for (const [line, col, pipe] of cache) {
    newMaze[line][col] = pipe;
  }

  return newMaze;
}

function findEnclosedTiles(maze) {
  let enclosedTiles = 0;
  let lastCurve = "";

  for (let line = 0; line < maze.length; line++) {
    let isEnclosedTile = false;
    for (let col = 0; col < maze[line].length; col++) {
      if (maze[line][col] === "." && isEnclosedTile) {
        enclosedTiles++;
        maze[line][col] = "$";
      }

      if (maze[line][col] === "|") {
        isEnclosedTile = !isEnclosedTile;
      }

      if (maze[line][col] === "F") {
        lastCurve = "F";
      }

      if (maze[line][col] === "L") {
        lastCurve = "L";
      }

      if (maze[line][col] === "J" && lastCurve === "F") {
        lastCurve = "";
        isEnclosedTile = !isEnclosedTile;
      }

      if (maze[line][col] === "7" && lastCurve === "L") {
        lastCurve = "";
        isEnclosedTile = !isEnclosedTile;
      }
    }
  }

  return enclosedTiles;
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split("\n");
  const [start, maze] = parse(fileContent);
  const cols = maze[0].length;
  const lines = maze.length;
  const [line, col, direction] = getStartNodes(start, maze)[0];
  const cache = findLoop([line, col], maze, direction);
  const newMaze = recreatePipeMaze(lines, cols, cache);

  return findEnclosedTiles(newMaze);
}

const result = main(args[0] ?? "./input/day10/2.test.txt");
console.log(result);
