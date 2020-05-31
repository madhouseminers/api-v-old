import dotenv from "dotenv";
dotenv.config();

import db from "../db";
import { readdirSync } from "fs";
import { resolve } from "path";

// Create migrations table
async function createMigrationsTable() {
  await db.query(
    "create table if not exists migrations (migration varchar(50), version SMALLINT, applied timestamp)"
  );
}

async function getLatestVersion(): Promise<number> {
  const results = await db.query("select max(version) from migrations");
  return results.rows[0].max + 0;
}

// Get the list of already run migrations
async function getExistingMigrations() {
  const results = await db.query("select migration, version from migrations");
  return results.rows;
}

// Get the list of available migrations
async function getAvailableMigrations() {
  return readdirSync(resolve(__dirname, "migrations"))
    .map((file) => file)
    .sort();
}

// Get the list of new migrations
function getNewMigrations(existing: string[], available: string[]) {
  return available.filter((migration) => existing.indexOf(migration) === -1);
}

// Run new migrations
async function runUpMigrations(migrationList: string[], version: number) {
  for (const migration of migrationList) {
    console.log(`Running migration UP on ${migration}`);

    const migrationObject = require(resolve(
      __dirname,
      "migrations",
      migration
    ));
    await migrationObject.up(db);
    await db.query(
      "insert into migrations values ($1, $2, CURRENT_TIMESTAMP)",
      [migration, version]
    );
  }
}

async function runDownMigrations(migrationList: string[]) {
  for (const migration of migrationList) {
    console.log(`Running migration DOWN on ${migration}`);

    const migrationObject = require(resolve(
      __dirname,
      "migrations",
      migration
    ));
    await migrationObject.down(db);
    await db.query("delete from migrations where migration=$1", [migration]);
  }
}

(async () => {
  await createMigrationsTable();
  const version = await getLatestVersion();
  const existing = await getExistingMigrations();
  const direction = process.argv[2] ?? "UP";

  switch (direction.toUpperCase()) {
    case "DOWN":
      // If going down, do this stuff
      const removeMigrations = existing
        .filter((migration) => migration.version === version)
        .map((migration) => migration.migration);
      await runDownMigrations(removeMigrations);
      console.log(`Removed version ${version}. Now at version ${version - 1}`);
      break;

    case "UP":
    default:
      // If going up, do this stuff
      const newMigrations = getNewMigrations(
        existing.map((migration) => migration.migration),
        await getAvailableMigrations()
      );
      if (!newMigrations.length) {
        console.log(`No new migrations detected. Remaining at ${version}`);
        break;
      }
      await runUpMigrations(newMigrations, version + 1);
      console.log(`Now at version ${version + 1}`);
  }
})()
  .catch((e) => console.log(e))
  .finally(() => process.exit(0));
