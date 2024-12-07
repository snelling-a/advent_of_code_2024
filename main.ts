import { readJson, writeJson } from "https://deno.land/x/jsonfile@1.0.0/mod.ts";
type Part = { solution: number; time: number };
type DayKey = `day${number}`;

const cacheFilePath = "./cache.json";

let cache: { [key: DayKey]: { part1: Part; part2: Part } } = {};
try {
  cache = (await readJson(cacheFilePath)) as typeof cache;
} catch (err) {
  if (!(err instanceof Deno.errors.NotFound)) {
    throw err;
  }
}

const days: DayKey[] = [];

for await (const { name, isDirectory } of Deno.readDir("./src")) {
  if (!name.match(/day(0[1-9]|1[0-9]|2[0-5])/) || !isDirectory) {
    continue;
  }

  days.push(name as DayKey);
}

async function getFile(path: string): Promise<Deno.FileInfo | undefined> {
  try {
    return await Deno.lstat(path);
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }
  }
}

function getTime(time: number): string {
  return time.toFixed(2);
}

function getTimeString(time: number | string): string {
  if (typeof time === "string") {
    time = parseInt(time);
  }

  return `${time.toFixed(2)} ms`;
}

const lastDay = days.sort().slice(-1)[0];

for (const day of days.sort()) {
  const path = `./src/${day}/index.ts`;

  const file = await getFile(path);

  const cachedDay = cache[day];
  const isLastDay = day === lastDay;

  if (!file || (!isLastDay && cachedDay)) {
    continue;
  }

  const { part1: one, part2: two } = await import(path);

  const runPart = (part: () => number): Part => {
    const perfStart = performance.now();
    const solution = part();
    const perfEnd = performance.now();

    return { solution, time: perfEnd - perfStart };
  };

  let part1, part2;

  console.log({ [day]: cachedDay });

  if (isLastDay || !cachedDay) {
    part1 = runPart(one);
    part2 = runPart(two);
    cache[day] = { part1, part2 };
  } else if (cachedDay) {
    part1 = cache[day].part1;
    part2 = cache[day].part2;
  } else {
    part1 = { solution: "No cached solution", time: 0 };
    part2 = { solution: "No cached solution", time: 0 };
  }
}

for (const [day, { part1, part2 }] of Object.entries(cache)) {
  const dayTitle = `Day ${day.replace(/[^\d]+/, "")}`;
  const separator = "-".repeat(15);
  const icons = "󰏏  󰐅  󰏐";

  console.log(
    `\n\n${separator}  ${icons}  ${dayTitle}  ${icons}  ${separator}\n`,
  );

  console.table({
    Solutions: { ["Part 1"]: part1.solution, ["Part 2"]: part2.solution },
    Time: {
      ["Part 1"]: getTimeString(getTime(part1.time)),
      ["Part 2"]: getTimeString(getTime(part2.time)),
    },
    ["Total Time"]: getTimeString(part1.time + part2.time),
  });
}

await writeJson(cacheFilePath, cache, { spaces: 2 });
