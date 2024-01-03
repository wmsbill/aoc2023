const fs = require("node:fs");
const args = process.argv.slice(2);

function parse(fileContent) {
  const map = fileContent.map((line) => line.split(""));
  const lines = map.length;
  const columns = map[0].length;
  const emptyLines = new Set(Array.from({ length: lines }, (_, i) => i));
  const emptyColumns = new Set(Array.from({ length: columns }, (_, i) => i));

  for (let line = 0; line < lines; line++) {
    for (let column = 0; column < columns; column++) {
      if (map[line][column] === "#") {
        emptyLines.delete(line);
        emptyColumns.delete(column);
      }
    }
  }

  return [map, emptyLines, emptyColumns];
}

function expandMap(map, emptyLines, emptyColumns) {
  const expandedMap = map
    .flatMap((line, index) => (emptyLines.has(index) ? [line, line] : [line]))
    .map((line) =>
      line.flatMap((column, index) =>
        emptyColumns.has(index) ? [column, column] : [column]
      )
    );

  return expandedMap;
}

function getGalaxiesCoordinates(map) {
  const galaxiesCoordinates = [];

  for (let line = 0; line < map.length; line++) {
    for (let column = 0; column < map[0].length; column++) {
      if (map[line][column] === "#") {
        galaxiesCoordinates.push([line, column]);
      }
    }
  }

  return galaxiesCoordinates;
}

function getGalaxyDistances([line, col], index, galaxiesCoordinates) {
  const distances = [];

  for (let i = index; i < galaxiesCoordinates.length; i++) {
    const [line2, col2] = galaxiesCoordinates[i];
    const distance = Math.abs(line - line2) + Math.abs(col - col2);

    distances.push(distance);
  }

  return distances;
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split("\n");
  const [map, emptyLines, emptyColumns] = parse(fileContent);
  const expandedMap = expandMap(map, emptyLines, emptyColumns);

  return getGalaxiesCoordinates(expandedMap)
    .flatMap(getGalaxyDistances)
    .reduce((a, b) => a + b, 0);
}

const result = main(args[0] ?? "./input/day11/1.test.txt");
console.log(result);
