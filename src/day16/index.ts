import { rawSampleInput, sampleSolutions } from "./sampleInput.ts";
import { parseInput as _parseInput } from "../utils/parseInput.ts";

type Coordinate = { x: number; y: number };

const rawInput = Deno.readTextFileSync(`${import.meta.dirname}/input.txt`);
function parseInput(input: string) {
  return _parseInput(input);
}
type ParsedInput = ReturnType<typeof parseInput>;

const parsedInput = parseInput(rawInput);
const parsedSampleInput = parseInput(rawSampleInput);

function findLowestScore(input: ParsedInput): number {
  const height = input.length;
  const width = input[0].length;

  let start: Coordinate | null = null;
  let end: Coordinate | null = null;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (input[y][x] === "S") {
        start = { x, y };
      }
      if (input[y][x] === "E") {
        end = { x, y };
      }
    }
  }

  if (!start || !end) {
    throw new Error("Invalid grid: Missing S or E");
  }

  const positionQueue: (Coordinate & { dir: number; score: number })[] = [];
  positionQueue.push({ x: start.x, y: start.y, dir: 1, score: 0 });

  const visited = new Set<string>();

  while (positionQueue.length > 0) {
    positionQueue.sort((a, b) => a.score - b.score);
    const { x, y, dir, score } = positionQueue.shift()!;

    if (x === end.x && y === end.y) {
      return score;
    }

    const stateKey = `${x},${y},${dir}`;
    if (visited.has(stateKey)) {
      continue;
    }
    visited.add(stateKey);

    const directions = [
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
    ];

    const { dx, dy } = directions[dir];
    const nextX = x + dx;
    const nextY = y + dy;
    if (input[nextY]?.[nextX] !== "#") {
      positionQueue.push({ x: nextX, y: nextY, dir, score: score + 1 });
    }

    positionQueue.push({ x, y, dir: (dir + 1) % 4, score: score + 1000 });

    positionQueue.push({ x, y, dir: (dir + 3) % 4, score: score + 1000 });
  }

  throw new Error("No valid path found");
}

function solvePart1(input: ParsedInput) {
  return findLowestScore(input);
}
function solvePart2(input: ParsedInput) {
  return 1;
}

/** Your puzzle answer was 127520. */
export function part1() {
  if (solvePart1(parsedSampleInput) === sampleSolutions.part1) {
    return solvePart1(parsedInput);
  }

  return "nop";
}

/** Your puzzle answer was . */
export function part2() {
  if (solvePart2(parsedSampleInput) === sampleSolutions.part2) {
    return solvePart2(parsedInput);
  }

  return "nop";
}
