import { defineConfig } from "drizzle-kit";

const dbUrl = process.env.DB_CLIENT === "supabase" ? process.env.DATABASE_URL_SUPABASE : process.env.DATABASE_URL_LOCAL;

if (!dbUrl) {
  throw new Error("DATABASE_URL não está definida nas variáveis de ambiente.");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
  verbose: true,
  strict: true,
});
