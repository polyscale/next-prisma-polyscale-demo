import { PolyScale } from "@polyscale/polyscale-node";
import request from "request";

const url =
  process.env.URL ??
  "https://next-prisma-polyscale-eu.herokuapp.com/properties/ca5617be-d5fd-489d-b962-edf2d8feea80";

const polyscale = new PolyScale({
  apiKey: process.env.API_KEY,
  url: process.env.API_URL ?? "https://api.polyscale.ai",
});

export const performRequest = async () => {
  return new Promise((resolve) => {
    const start = new Date().getTime();
    request.get(url, { time: true }, (err, response) => {
      return resolve({
        type:
          err || (response.statusCode && response.statusCode >= 400)
            ? "error"
            : "success",
        execTime:
          response && response.elapsedTime
            ? response.elapsedTime
            : Date.now() - start,
      });
    });
  });
};

export const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

export const purgeCache = async () => {
  const waitFor = process.env.PURGE_TIMEOUT
    ? parseInt(process.env.PURGE_TIMEOUT)
    : 2000;
  console.log(`Purging Cache`);
  await polyscale.cache.purge({
    cacheId: "7cd16470-645e-4f2e-8da6-08aad190e5b6",
  });
  console.log(`Cache purged, waiting ${waitFor / 1000} seconds...`);
  await sleep(waitFor);
};

export const warmCache = async () => {
  const waitFor = process.env.WARM_CACHE_TIMEOUT
    ? parseInt(process.env.WARM_CACHE_TIMEOUT)
    : 2000;
  console.log(`Warming Cache`);
  await performRequest();
  console.log(`Cache warmed, waiting ${waitFor / 1000} seconds...`);
  await sleep(waitFor);
};
