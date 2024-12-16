import { rawSampleInput, sampleSolutions } from "./sampleInput.ts";

const rawInput = Deno.readTextFileSync(`${import.meta.dirname}/input.txt`);
function parseInput(input: string) {
  const machines = [];
  const lines = input.trim().split("\n\n");

  for (const block of lines) {
    const [aLine, bLine, prizeLine] = block.split("\n");

    const parseMovement = (line: string) => {
      const [_, x, y] = line.match(/X\+(-?\d+), Y\+(-?\d+)/) || [];
      return { x: parseInt(x), y: parseInt(y) };
    };

    const parsePrize = (line: string) => {
      const [_, x, y] = line.match(/X=(-?\d+), Y=(-?\d+)/) || [];
      return { x: parseInt(x), y: parseInt(y) };
    };

    machines.push({
      a: parseMovement(aLine),
      b: parseMovement(bLine),
      prize: parsePrize(prizeLine),
    });
  }

  return machines;
}
type ParsedInput = ReturnType<typeof parseInput>;

const parsedInput = parseInput(rawInput);
const parsedSampleInput = parseInput(rawSampleInput);

function findMinCost(machine: ParsedInput[number]) {
  const { a, b, prize } = machine;
  let minCost: number | null = null;
  const maxPresses = 100;

  for (let aPresses = 0; aPresses <= maxPresses; aPresses++) {
    const xRemaining = prize.x - aPresses * a.x;
    const yRemaining = prize.y - aPresses * a.y;

    if (xRemaining % b.x !== 0 || yRemaining % b.y !== 0) {
      continue;
    }

    const bPresses = xRemaining / b.x;

    if (bPresses < 0 || !Number.isInteger(bPresses)) {
      continue;
    }
    if (aPresses * a.y + bPresses * b.y !== prize.y) {
      continue;
    }

    const cost = 3 * aPresses + bPresses;
    if (minCost === null || cost < minCost) {
      minCost = cost;
    }
  }

  return minCost;
}

function processMachines(machines: ParsedInput) {
  let totalCost = 0;
  let prizes = 0;

  for (const machine of machines) {
    const cost = findMinCost(machine);
    if (cost !== null) {
      prizes++;
      totalCost += cost;
    }
  }

  return totalCost;
}

function solvePart1(input: ParsedInput) {
  return processMachines(input);
}
function solvePart2(input: ParsedInput) {
  return;
}

/** Your puzzle answer was 29201. */
export function part1() {
  if (solvePart1(parsedSampleInput) === sampleSolutions.part1) {
    return solvePart1(parsedInput);
  }

  return "nop";
}

/** Your puzzle answer was . */
export function part2() {
  if (solvePart2(parsedSampleInput) !== sampleSolutions.part2) {
    return solvePart2(parsedInput);
  }

  return "nop";
}
