import * as path from "https://deno.land/std@0.188.0/path/mod.ts";
import { parseInput } from "../utils/parseInput.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

const rawInput = Deno.readTextFileSync(`${__dirname}/input.txt`);

const parsedInput = parseInput(rawInput).map((line) => line.split(""));

type Position = { x: number; y: number };

const directions = [
  { dx: 0, dy: -1 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
] as const;

function findGuardPosition(map: string[][]): Position | null {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === "^") {
        return { x, y };
      }
    }
  }
  return null;
}

function getIsOutOfBounds(x: number, y: number, grid: string[][]): boolean {
  return y < 0 || y >= grid.length || x < 0 || x >= grid[0].length;
}

let direction = 0;
function patrol(): number {
  const visited = new Set<string>();
  direction = 0;
  let { x, y } = findGuardPosition(parsedInput)!;

  visited.add(`${x},${y}`);

  let isInsideGrid = true;

  while (isInsideGrid) {
    const nextX = x + directions[direction].dx;
    const nextY = y + directions[direction].dy;

    const isOutOfBounds = getIsOutOfBounds(nextX, nextY, parsedInput);
    const isObstacle = parsedInput[nextY]?.[nextX] === "#";

    if (isObstacle || isOutOfBounds) {
      direction = (direction + 1) % 4;
    } else {
      x = nextX;
      y = nextY;

      visited.add(`${x},${y}`);
    }

    isInsideGrid = !isOutOfBounds;
  }

  return visited.size;
}

const memo = new Map<string, boolean>();

function simulatePatrol(
  startX: number,
  startY: number,
  obstacleX: number,
  obstacleY: number,
): boolean {
  const key = `${startX}|${startY}|${obstacleX}|${obstacleY}`;
  if (memo.has(key)) return memo.get(key)!;

  const encodeState = (x: number, y: number, direction: number) =>
    (x << 20) | (y << 10) | direction;
  const visited = new Set<number>();
  let x = startX,
    y = startY,
    direction = 0;

  visited.add(encodeState(x, y, direction));

  while (true) {
    const nextX = x + directions[direction].dx;
    const nextY = y + directions[direction].dy;

    const isOutOfBounds =
      nextY < 0 ||
      nextX < 0 ||
      nextY >= parsedInput.length ||
      nextX >= parsedInput[nextY].length;
    const isObstacle =
      (nextX === obstacleX && nextY === obstacleY) ||
      parsedInput[nextY]?.[nextX] === "#";

    if (isOutOfBounds) {
      memo.set(key, false);
      return false;
    }

    if (isObstacle) {
      direction = (direction + 1) % 4;
    } else {
      x = nextX;
      y = nextY;

      const state = encodeState(x, y, direction);
      if (visited.has(state)) {
        memo.set(key, true);
        return true;
      }
      visited.add(state);
    }
  }
}

function findLoopPositions(grid: string[][]) {
  const guardPosition = findGuardPosition(grid);
  if (!guardPosition) throw new Error("Guard not found in the grid.");

  const { x: startX, y: startY } = guardPosition;
  const loopPositions: { x: number; y: number }[] = [];

  const isWalkable = (x: number, y: number) => grid[y]?.[x] !== "#";

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (!isWalkable(x, y) || (x === startX && y === startY)) continue;

      if (simulatePatrol(startX, startY, x, y)) {
        loopPositions.push({ x, y });
      }
    }
  }

  return loopPositions.length;
}

/** Your puzzle answer was 5564. */
export function part1() {
  return patrol();
}

/** Your puzzle answer was 1976. */
export function part2() {
  return findLoopPositions(parsedInput);
}
