import * as path from "https://deno.land/std@0.188.0/path/mod.ts";
import { parseInput } from "../utils/parseInput.ts";
import { directions } from "../utils/constants.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

const rawInput = Deno.readTextFileSync(`${__dirname}/input.txt`);
const parsedInput = parseInput(rawInput).map((line) => line.split(""));

const gridHeight = parsedInput.length;
const gridWidth = parsedInput[0].length;

function isValidWord(x: number, y: number): boolean {
  return x >= 0 && y >= 0 && x < gridHeight && y < gridWidth;
}

function searchWord(x: number, y: number, dirX: number, dirY: number): boolean {
  const target = "XMAS";

  for (let i = 0; i < target.length; i++) {
    const newX = x + i * dirX;
    const newY = y + i * dirY;
    if (!isValidWord(newX, newY) || parsedInput[newX][newY] !== target[i]) {
      return false;
    }
  }
  return true;
}

function countOccurrences(): number {
  const xmasDirections = [...directions, [-1, -1], [-1, 1], [1, -1], [1, 1]];

  let count = 0;
  for (let x = 0; x < gridHeight; x++) {
    for (let y = 0; y < gridWidth; y++) {
      for (const [dirX, dirY] of xmasDirections) {
        if (searchWord(x, y, dirX, dirY)) {
          count++;
        }
      }
    }
  }

  return count;
}

function checkPatterns(
  topLeft: string,
  topRight: string,
  bottomLeft: string,
  bottomRight: string,
): boolean {
  const bottomLeftIsM = bottomLeft === "M";
  const bottomLeftIsS = bottomLeft === "S";
  const bottomRightIsM = bottomRight === "M";
  const bottomRightIsS = bottomRight === "S";
  const topLeftIsM = topLeft === "M";
  const topLeftIsS = topLeft === "S";
  const topRightIsM = topRight === "M";
  const topRightIsS = topRight === "S";

  if (
    (bottomLeftIsM && topRightIsM) ||
    (topLeftIsM && bottomRightIsM) ||
    (topLeftIsS && bottomRightIsS) ||
    (topRightIsS && bottomLeftIsS)
  ) {
    return false;
  }

  return (
    (topLeftIsM && topRightIsS && bottomLeftIsM && bottomRightIsS) ||
    (topLeftIsM && topRightIsM && bottomLeftIsS && bottomRightIsS) ||
    (topLeftIsS && topRightIsM && bottomLeftIsS && bottomRightIsM) ||
    (topLeftIsS && topRightIsS && bottomLeftIsM && bottomRightIsM)
  );
}

function countPatterns(): number {
  let count = 0;

  for (let i = 1; i < gridHeight - 1; i++) {
    for (let j = 1; j < gridWidth - 1; j++) {
      const center = parsedInput[i][j];

      if (!(center === "A")) {
        continue;
      }

      const up = i - 1;
      const down = i + 1;
      const left = j - 1;
      const right = j + 1;

      const topLeft = parsedInput[up][left];
      const topRight = parsedInput[up][right];
      const bottomLeft = parsedInput[down][left];
      const bottomRight = parsedInput[down][right];

      if (checkPatterns(topLeft, topRight, bottomLeft, bottomRight)) {
        count++;
      }
    }
  }

  return count;
}
/** Your puzzle answer was 2507. */
export function part1(): number {
  return countOccurrences();
}

/** Your puzzle answer was 1969. */
export function part2(): number {
  return countPatterns();
}
