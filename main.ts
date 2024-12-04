type Part = { solution: number; time: number };

const days: string[] = [];

for await (const { name, isDirectory } of Deno.readDir("./src")) {
  if (!name.match(/day(0[1-9]|1[0-9]|2[0-5])/) || !isDirectory) {
    continue;
  }

  days.push(name);
}

async function checkFileExists(
  path: string,
): Promise<Deno.FileInfo | undefined> {
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

function runPart(part: () => number): Part {
  const perfStart = performance.now();
  const solution = part();
  const perfEnd = performance.now();

  return { solution, time: perfEnd - perfStart };
}

for (const day of days.sort()) {
  const path = `./src/${day}/index.ts`;

  if (!(await checkFileExists(path))) {
    continue;
  }

  const { part1: one, part2: two } = await import(path);

  if (!one()) {
    continue;
  }

  const dayTitle = `Day ${day.replace(/[^\d]+/, "")}`;

  const part1 = runPart(one);
  const part2 = runPart(two);

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
