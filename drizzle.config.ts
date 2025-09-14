import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const dbUrl =
  process.env.DB_CLIENT === "supabase"
    ? process.env.DATABASE_URL_SUPABASE
    : `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_ADDRESS}:5432/${process.env.POSTGRES_DB}`;

if (!dbUrl) {
  throw new Error("DATABASE_URL não está definida nas variáveis de ambiente.");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./.db",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
  verbose: true,
  strict: true,
});
