import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const dbUrl = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_ADDRESS}:5432/${process.env.POSTGRES_DB}`;

const client = postgres(dbUrl, { prepare: false });

export const db = drizzle(client, { schema });
