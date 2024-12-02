import { parseInput } from "../utils/parseInput.ts";

const rawInput = Deno.readTextFileSync("./src/day02/input.txt");

const parsed = parseInput(rawInput);
const input = parsed.map((report) => report.split(/\s+/).map(Number));

function isReportSafePt1(report: number[]) {
  let safe = report.length > 0;
  const isIncreasing = report.slice(1).every((n, i) => n >= report[i]);
  const isDecreasing = report.slice(1).every((n, i) => n <= report[i]);

  if (!isIncreasing && !isDecreasing) {
    safe = false;
    return;
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

function getNewReport(report: number[], index: number) {
  return report.slice(0, index).concat(report.slice(index + 1));
}

function isReportSafePt2(report: number[]) {
  if (isReportSafePt1(report)) {
    return true;
  }

  for (let i = 0; i <= report.length; i++) {
    const newReport = getNewReport(report, i);
    if (isReportSafePt1(newReport)) {
      return true;
    }
  }
}

/**
 * 631
 */
export function part1() {
  return input.filter(isReportSafePt1).length;
}

/**
 * 665
 */
export function part2() {
  return input.filter(isReportSafePt2).length;
}
