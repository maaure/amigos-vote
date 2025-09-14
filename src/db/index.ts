import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const dbUrl =
  process.env.DB_CLIENT === "supabase"
    ? process.env.DATABASE_URL_SUPABASE
    : `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_ADDRESS}:5432/${process.env.POSTGRES_DB}`;

if (!dbUrl) {
  throw new Error("Não foi possível determinar a URL do banco de dados. Verifique as variáveis de ambiente.");
}

const client = postgres(dbUrl, { prepare: false });

export const db = drizzle(client, { schema });
