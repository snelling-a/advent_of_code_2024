import * as path from "https://deno.land/std@0.188.0/path/mod.ts";
import { parseInput as _parseInput } from "../utils/parseInput.ts";
import { rawSampleInput, sampleSolutions } from "./sampleInput.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

const rawInput = Deno.readTextFileSync(`${__dirname}/input.txt`).trim();

type Space = number | ".";

function getIds(input: string): Space[] {
  const disk: Space[] = [];
  let fileId = 0;

  for (let i = 0; i < input.length; i += 2) {
    const fileLength = parseInt(input.charAt(i));
    const freeSpaceLength = parseInt(input.charAt(i + 1) || "0");

    disk.push(...Array(fileLength).fill(fileId));
    disk.push(...Array(freeSpaceLength).fill("."));
    fileId++;
  }

  return disk;
}

function fragmentFilesAndCompactDisk(disk: Space[]) {
  let left = 0;
  let right = disk.length - 1;

  while (left < right) {
    while (left < right && disk[left] !== ".") {
      left++;
    }
    while (left < right && disk[right] === ".") {
      right--;
    }
    if (left < right) {
      [disk[left], disk[right]] = [disk[right], disk[left]];
      left++;
      right--;
    }
  }

  return disk;
}

function moveFiles(disk: Space[]) {
  const fileRanges: {
    id: number;
    start: number;
    end: number;
    length: number;
  }[] = [];

  let currentId: Space = ".";
  let start = -1;

  for (let i = 0; i < disk.length + 1; i++) {
    const space = disk[i];

    if (space !== currentId) {
      if (currentId !== "." && start !== -1) {
        fileRanges.push({
          id: currentId as number,
          start,
          end: i - 1,
          length: i - start,
        });
      }
      currentId = space;
      start = space !== "." ? i : -1;
    }
  }

  for (const { id, start, length } of fileRanges.sort((a, b) => b.id - a.id)) {
    let freeStart = -1;
    let freeLength = 0;

    for (let i = 0; i <= start; i++) {
      if (disk[i] === ".") {
        if (freeStart === -1) {
          freeStart = i;
        }

        freeLength++;
      } else {
        freeStart = -1;
        freeLength = 0;
      }

      if (freeLength >= length) {
        break;
      }
    }

    if (freeLength >= length) {
      for (let i = start; i < start + length; i++) {
        disk[i] = ".";
      }

      for (let i = 0; i < length; i++) {
        disk[freeStart + i] = id;
      }
    }
  }

  return disk;
}

function calculateChecksum(disk: Space[]) {
  let checksum = 0;

  for (let i = 0; i < disk.length; i++) {
    const space = disk[i];

    if (space === ".") {
      continue;
    }

    checksum += i * (disk[i] as number);
  }

  return checksum;
}

function solvePart1(input: string) {
  const initialDisk = getIds(input);
  const compactedDisk = fragmentFilesAndCompactDisk(initialDisk);
  return calculateChecksum(compactedDisk);
}

function solvePart2(input: string) {
  const initialDisk = getIds(input);
  const compactedDisk = moveFiles(initialDisk);
  return calculateChecksum(compactedDisk);
}

/** Your puzzle answer was 6241633730082. */
export function part1() {
  if (solvePart1(rawSampleInput) === sampleSolutions.part1) {
    return solvePart1(rawInput);
  }

  return "nop";
}

/** Your puzzle answer was 6265268809555. */
export function part2() {
  if (solvePart2(rawSampleInput) === sampleSolutions.part2) {
    return solvePart2(rawInput);
  }

  return "nop";
}
