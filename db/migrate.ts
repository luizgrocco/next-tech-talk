import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import db from "./db-client";

const runMigration = async function () {
  // This will run migrations on the database, skipping the ones already applied
  await migrate(db, { migrationsFolder: "./db/migrations" });
};

runMigration();
