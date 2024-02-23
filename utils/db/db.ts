import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { DB } from "./kysely-types";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({ pool }),
});
