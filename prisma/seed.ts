import { PrismaClient, Property, SalesHistory } from "@prisma/client";
import { readFile } from "fs/promises";
import readline from "node:readline";
import { resolve } from "node:path";

const prisma = new PrismaClient();

const main = async () => {
  const propertyCount = await prisma.property.count();
  const salesHistoryCount = await prisma.salesHistory.count();

  if (propertyCount !== 0 || salesHistoryCount !== 0) {
    console.log("Database already seeeded. Skipping.");

    return;
  }

  const properties = JSON.parse(
    (await readFile(resolve(__dirname, "./data/properties.json"))).toString()
  ) as Array<Property>;
  const salesHistories = JSON.parse(
    (
      await readFile(resolve(__dirname, "./data/salesHistories.json"))
    ).toString()
  ) as Array<SalesHistory>;

  const chunkSize = 500;
  let seededProperties = 0;
  let seededSalesHistories = 0;

  console.log("");

  while (seededProperties < properties.length) {
    await prisma.property.createMany({
      data: properties.slice(
        seededProperties,
        Math.min(seededProperties + chunkSize, properties.length)
      ),
    });

    seededProperties += chunkSize;

    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(
      `Seeding Property: ${seededProperties / chunkSize}/${
        properties.length / chunkSize
      }`
    );
  }

  console.log("");

  while (seededSalesHistories < salesHistories.length) {
    await prisma.salesHistory.createMany({
      data: salesHistories.slice(
        seededSalesHistories,
        Math.min(seededSalesHistories + chunkSize, salesHistories.length)
      ),
    });

    seededSalesHistories += chunkSize;

    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(
      `Seeding SalesHistory: ${seededSalesHistories / chunkSize}/${Math.ceil(
        salesHistories.length / chunkSize
      )}`
    );
  }
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
