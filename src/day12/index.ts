import * as path from "https://deno.land/std@0.188.0/path/mod.ts";
import { rawSampleInput, sampleSolutions } from "./sampleInput.ts";
import { parseInput as _parseInput } from "../utils/parseInput.ts";
import { directions } from "../utils/constants.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

const rawInput = Deno.readTextFileSync(`${__dirname}/input.txt`);
function parseInput(input: string) {
  return _parseInput(input).map((line) => line.split(""));
}
type ParsedInput = ReturnType<typeof parseInput>;

const parsedInput: ParsedInput = parseInput(rawInput);
const parsedSampleInput: ParsedInput = parseInput(rawSampleInput);

function findRegions(grid: string[][]): { area: number; perimeter: number }[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const regions: { area: number; perimeter: number }[] = [];

  function floodFill(
    startRow: number,
    startCol: number,
    type: string,
  ): { area: number; perimeter: number } {
    const stack = [[startRow, startCol]];
    let area = 0;
    let perimeter = 0;

    while (stack.length > 0) {
      const [currentRow, currentCol] = stack.pop()!;
      if (visited[currentRow][currentCol]) {
        continue;
      }

      visited[currentRow][currentCol] = true;
      area++;

      for (const [directionRow, directionCol] of directions) {
        const neighborRow = currentRow + directionRow;
        const neighborCol = currentCol + directionCol;

        if (
          neighborRow < 0 ||
          neighborCol < 0 ||
          neighborRow >= rows ||
          neighborCol >= cols ||
          grid[neighborRow][neighborCol] !== type
        ) {
          perimeter++;
        } else if (!visited[neighborRow][neighborCol]) {
          stack.push([neighborRow, neighborCol]);
        }
      }
    }

    return { area, perimeter };
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!visited[row][col]) {
        regions.push(floodFill(row, col, grid[row][col]));
      }
    }
  }

  return regions;
}

function calculateTotalCost(
  regions: { area: number; perimeter: number }[],
): number {
  let totalCost = 0;
  for (const region of regions) {
    totalCost += region.area * region.perimeter;
  }
  return totalCost;
}

function solvePart1(input: ParsedInput) {
  const regions = findRegions(input);
  return calculateTotalCost(regions);
}
function solvePart2(input: ParsedInput) {
  return 1;
}

/** Your puzzle answer was 1483212. */
export function part1() {
  if (solvePart1(parsedSampleInput) === sampleSolutions.part1) {
    return solvePart1(parsedInput);
  }

  return "nop";
}

/** Your puzzle answer was 252442982856820. */
export function part2() {
  if (solvePart2(parsedSampleInput) === sampleSolutions.part2) {
    return solvePart2(parsedInput);
  }

  return "nop";
}
