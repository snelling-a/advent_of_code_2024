import * as path from "https://deno.land/std@0.188.0/path/mod.ts";
import { parseInput as _parseInput } from "../utils/parseInput.ts";
import { rawSampleInput, sampleSolutions } from "./sampleInput.ts";
import { directions } from "../utils/constants.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

const rawInput = Deno.readTextFileSync(`${__dirname}/input.txt`);
function parseInput(input: string) {
  return _parseInput(input).map((line) => line.split("").map(Number));
}
type ParsedInput = ReturnType<typeof parseInput>;

const parsedInput: ParsedInput = parseInput(rawInput);
const parsedSampleInput: ParsedInput = parseInput(rawSampleInput);

function isValidMove(
  x: number,
  y: number,
  currentHeight: number,
  rows: number,
  cols: number,
  map: ParsedInput,
) {
  return (
    x >= 0 && x < rows && y >= 0 && y < cols && map[x][y] === currentHeight + 1
  );
}

function traverseTrailheads(
  map: ParsedInput,
  onTrailhead: (x: number, y: number) => number,
) {
  const gridHeight = map.length;
  const gridWidth = map[0].length;
  let total = 0;

  for (let x = 0; x < gridHeight; x++) {
    for (let y = 0; y < gridWidth; y++) {
      if (map[x][y] === 0) {
        total += onTrailhead(x, y);
      }
    }
  }

  return total;
}

function calculateTrailheadScores(map: ParsedInput) {
  const gridHeight = map.length;
  const gridWidth = map[0].length;

  return traverseTrailheads(map, (startX: number, startY: number) => {
    const queue: [number, number][] = [[startX, startY]];
    const visited = Array.from({ length: gridHeight }, () =>
      Array(gridWidth).fill(false),
    );
    visited[startX][startY] = true;

    const reachableNines = new Set<string>();

    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      const currentHeight = map[x][y];

      if (currentHeight === 9) {
        reachableNines.add(`${x},${y}`);
        continue;
      }

      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;

        if (
          isValidMove(nx, ny, currentHeight, gridHeight, gridWidth, map) &&
          !visited[nx][ny]
        ) {
          visited[nx][ny] = true;
          queue.push([nx, ny]);
        }
      }
    }

    return reachableNines.size;
  });
}

function calculateTrailheadRatings(map: ParsedInput) {
  const rows = map.length;
  const cols = map[0].length;

  function countTrails(x: number, y: number, currentHeight: number) {
    if (currentHeight === 9) return 1;

    let totalPaths = 0;
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (isValidMove(nx, ny, currentHeight, rows, cols, map)) {
        totalPaths += countTrails(nx, ny, currentHeight + 1);
      }
    }
    return totalPaths;
  }

  function dfsTrailheadRating(x: number, y: number) {
    return countTrails(x, y, 0);
  }

  return traverseTrailheads(map, dfsTrailheadRating);
}

function solvePart1(input: ParsedInput) {
  return calculateTrailheadScores(input);
}
function solvePart2(input: ParsedInput) {
  return calculateTrailheadRatings(input);
}

/** Your puzzle answer was 825. */
export function part1() {
  if (solvePart1(parsedSampleInput) === sampleSolutions.part1) {
    return solvePart1(parsedInput);
  }

  return "nop";
}

/** Your puzzle answer was 1805. */
export function part2() {
  if (solvePart2(parsedSampleInput) === sampleSolutions.part2) {
    return solvePart2(parsedInput);
  }

  return "nop";
}
