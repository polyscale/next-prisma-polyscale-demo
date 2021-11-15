import { Stats } from "fast-stats";
import { warmCache } from "./util.mjs";
import { purgeCache } from "./util.mjs";
import { performRequest } from "./util.mjs";

const concurrencyLevels = process.env.CONCURRENCY_LEVELS
  ? JSON.parse(process.env.CONCURRENCY_LEVELS)
  : [1, 5, 20, 50, 100, 250, 500, 1000];
// const concurrencyLevels = [1, 5, 20, 50, 100, 250, 500, 1000];

export const iterations = process.env.ITERATIONS
  ? parseInt(process.env.ITERATIONS)
  : 2;

async function runConcurrentRequests(concurrencyLevel) {
  return await Promise.all(
    Array.from({ length: concurrencyLevel }).map(() => performRequest())
  );
}

async function* produceExecutionTimes() {
  for (const concurrencyLevel of concurrencyLevels) {
    const allSuccessExecTimes = [];
    const allErrorExecTimes = [];

    console.log("Concurrency Level:", concurrencyLevel);

    for (let i = 0; i < iterations; i++) {
      console.log(`Iteration Level: ${i + 1}`);

      await warmCache();

      const execTimes = await runConcurrentRequests(concurrencyLevel);

      await purgeCache();

      const successExecTimes = execTimes
        .filter((d) => d.type === "success")
        .map((d) => d.execTime);
      const errorExecTimes = execTimes
        .filter((d) => d.type === "error")
        .map((d) => d.execTime);

      allSuccessExecTimes.push(...successExecTimes);
      allErrorExecTimes.push(...errorExecTimes);
    }

    yield { concurrencyLevel, allSuccessExecTimes, allErrorExecTimes };
  }
}

export const gatherData = async () => {
  await purgeCache();

  const results = [];
  for await (const {
    concurrencyLevel,
    allSuccessExecTimes,
    allErrorExecTimes,
  } of produceExecutionTimes()) {
    const successStats = new Stats();
    const errorStats = new Stats();

    successStats.push(...allSuccessExecTimes);
    errorStats.push(...allErrorExecTimes);

    const result = {
      successMedian: successStats.median(),
      successAmean: successStats.amean(),
      successRange: successStats.range(),
      successRequests: successStats.length,
      errorMedian: errorStats.length > 0 ? errorStats.median() : null,
      errorAmean: errorStats.length > 0 ? errorStats.amean() : null,
      errorRange: errorStats.length > 0 ? errorStats.range() : null,
      errorRequests: errorStats.length,
      totalRequests: successStats.length + errorStats.length,
      concurrentRequests: concurrencyLevel,
    };

    console.log(result);

    results.push(result);
  }

  return results;
};
