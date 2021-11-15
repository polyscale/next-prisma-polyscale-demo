import { gatherData } from "./gatherData.mjs";

const main = async () => {
  const results = await gatherData();

  console.log(results);
};

main();
