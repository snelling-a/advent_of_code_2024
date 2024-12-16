import { parseInput } from "../utils/parseInput.ts";

const rawInput = Deno.readTextFileSync(`${import.meta.dirname}/input.txt`);
const parsedInput = parseInput(rawInput).map((report) =>
  report.split(/\s+/).map(Number)
);

function isReportSafePt1(report: number[]): boolean {
  let safe = report.length > 0;
  const isIncreasing = report.slice(1).every((n, i) => n >= report[i]);
  const isDecreasing = report.slice(1).every((n, i) => n <= report[i]);

  if (!isIncreasing && !isDecreasing) {
    return false;
  }

  report.slice(1).forEach((n, i) => {
    const next = report[i];
    const diff = Math.abs(n - next);

    if (diff > 3 || diff < 1) {
      safe = false;
    }
  });

  return safe;
}

function getNewReport(report: number[], index: number): number[] {
  return report.slice(0, index).concat(report.slice(index + 1));
}

function isReportSafePt2(report: number[]): boolean {
  if (isReportSafePt1(report)) {
    return true;
  }

  for (let i = 0; i <= report.length; i++) {
    const newReport = getNewReport(report, i);
    if (isReportSafePt1(newReport)) {
      return true;
    }
  }

  return false;
}

/** Your puzzle answer was 631. */
export function part1(): number {
  return parsedInput.filter(isReportSafePt1).length;
}

/** Your puzzle answer was 665. */
export function part2(): number {
  return parsedInput.filter(isReportSafePt2).length;
}
