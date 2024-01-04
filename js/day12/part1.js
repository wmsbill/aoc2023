const fs = require("node:fs");
const args = process.argv.slice(2);

function parse(fileContent) {
  return fileContent.map((line) => {
    const [map, config] = line.split(" ");
    return [map, config];
  });
}

function isMatch(map, config) {
  let currentConfig = [];
  let damagedCount = 0;

  for (const char of map) {
    if (char === "#") {
      damagedCount++;
    }

    if (char === "." && damagedCount > 0) {
      currentConfig.push(damagedCount.toString());
      damagedCount = 0;
    }
  }

  if (damagedCount > 0) {
    currentConfig.push(damagedCount.toString());
  }

  return currentConfig.join() === config;
}

function getPermutations(map, config) {
  if (map.indexOf("?") > -1) {
    return (
      getPermutations(map.replace("?", "#"), config) +
      getPermutations(map.replace("?", "."), config)
    );
  }

  return isMatch(map, config) ? 1 : 0;
}

function mapArrangements([map, config]) {
  return getPermutations(map, config);
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split("\n");
  const damagedMapList = parse(fileContent);

  return damagedMapList.map(mapArrangements).reduce((a, b) => a + b, 0);
}

const result = main(args[0] ?? "./input/day12/1.test.txt");
console.log(result);
