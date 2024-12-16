import { rawSampleInput, sampleSolutions } from "./sampleInput.ts";
import { parseInput as _parseInput } from "../utils/parseInput.ts";

const rawInput = Deno.readTextFileSync(`${import.meta.dirname}/input.txt`);
function parseInput(input: string) {
  return _parseInput(input).map((line) => {
    const [p, v] = line.split(" ");

    const parseCoordinate = (coord: string) => {
      const [_, x, y] = coord.match(/(-?\d+),(-?\d+)/)!;
      return [parseInt(x), parseInt(y)];
    };

    const [px, py] = parseCoordinate(p);
    const [vx, vy] = parseCoordinate(v);

    return { px, py, vx, vy };
  });
}

type ParsedInput = ReturnType<typeof parseInput>;
type Robot = ParsedInput[number];

const parsedInput = parseInput(rawInput);
const parsedSampleInput = parseInput(rawSampleInput);

function moveRobot(robot: Robot, gridWidth: number, gridHeight: number): Robot {
  let newPx = (robot.px + robot.vx) % gridWidth;
  let newPy = (robot.py + robot.vy) % gridHeight;

  if (newPx < 0) newPx += gridWidth;
  if (newPy < 0) newPy += gridHeight;

  return { ...robot, px: newPx, py: newPy };
}

function runSimulation(
  robots: Robot[],
  gridWidth: number,
  gridHeight: number,
): Robot[] {
  let currentRobots = [...robots];

  for (let i = 0; i < 100; i++) {
    currentRobots = currentRobots.map((robot) =>
      moveRobot(robot, gridWidth, gridHeight),
    );
  }

  return currentRobots;
}

function calculateQuadrantScores(
  robots: Robot[],
  gridHeight: number,
  gridWidth: number,
) {
  const centerRow = Math.floor(gridHeight / 2);
  const centerCol = Math.floor(gridWidth / 2);

  let topLeft = 0;
  let topRight = 0;
  let bottomLeft = 0;
  let bottomRight = 0;

  for (const { px, py } of robots) {
    if (px === centerCol || py === centerRow) {
      continue;
    }

    if (px < centerCol && py < centerRow) {
      topLeft += 1;
    } else if (px >= centerCol && py < centerRow) {
      topRight += 1;
    } else if (px < centerCol && py >= centerRow) {
      bottomLeft += 1;
    } else if (px >= centerCol && py >= centerRow) {
      bottomRight += 1;
    }
  }

  return [topLeft, topRight, bottomLeft, bottomRight].reduce(
    (acc, val) => acc * val,
    1,
  );
}

function solvePart1(input: ParsedInput, gridHeight = 7, gridWidth = 11) {
  return calculateQuadrantScores(
    runSimulation(input, gridWidth, gridHeight),
    gridHeight,
    gridWidth,
  );
}
function solvePart2(input: ParsedInput) {
  return input;
}

/** Your puzzle answer was 229868730. */
export function part1() {
  if (solvePart1(parsedSampleInput) === sampleSolutions.part1) {
    return solvePart1(parsedInput, 103, 101);
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
