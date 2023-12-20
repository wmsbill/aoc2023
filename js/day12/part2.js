const fs = require("node:fs");
const args = process.argv.slice(2);

function parse(fileContent) {
  return fileContent.map((line) => {
    const [map, config] = line.split(" ");
    let newMap = (map + "?").repeat(4) + map;
    let newConfig = (config + ",").repeat(4) + config;

    return [newMap + ".", newConfig.split(",").map(Number)];
  });
}

function mapArrangements([map, config]) {
  const cache = new Map();

  function getPermutations(i, groupCount, map, config) {
    const key = `${i},${groupCount}`;
    if (cache.has(key)) {
      return cache.get(key);
    }

    if (groupCount >= config.length) {
      return map.slice(i).indexOf("#") > -1 ? 0 : 1;
    }

    if (i == map.length) {
      return 0;
    }

    let result = 0;
    const amount = config[groupCount];
    const slice = map.slice(i);

    if ("?.".includes(map.charAt(i))) {
      result += getPermutations(i + 1, groupCount, map, config);
    }

    if (
      "#?".includes(map.charAt(i)) &&
      slice.slice(0, amount).indexOf(".") === -1 &&
      slice[amount] !== "#"
    ) {
      result += getPermutations(i + amount + 1, groupCount + 1, map, config);
    }

    cache.set(key, result);
    return result;
  }

  return getPermutations(0, 0, map, config);
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split("\n");
  const damagedMapList = parse(fileContent);

  return damagedMapList.map(mapArrangements).reduce((a, b) => a + b, 0);
}

const result = main(args[0] ?? "./input/day12/1.test.txt");
console.log(result);
