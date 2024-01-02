import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { todos } from "./schema";

const sqlite = new Database("./db/sqlite.db");
const db = drizzle(sqlite);

export default db;
