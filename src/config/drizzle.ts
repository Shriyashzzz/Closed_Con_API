import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import config from "./config.js";

export const pool = new Pool({ connectionString: config.DATABASE_URL });

const db = drizzle({ client: pool });

pool.on("error", (err) => {
  console.error("Unexpected pg pool error", err);
});

export default db;
