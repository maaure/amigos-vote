import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { questions } from "../src/db/schema";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

// ponytail: one-off seed script

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbUrl = "postgresql://inimigo-user:inimigo-pass@localhost:5432/inimigo-db";
const client = postgres(dbUrl, { prepare: false });
const db = drizzle(client, { schema: { questions } });

async function seed() {
  const csvPath = path.resolve(__dirname, "..", ".db", "seed.csv");
  const csv = readFileSync(csvPath, "utf-8");
  const lines = csv.trim().split("\n").slice(1);

  const rows = lines.map((line) => {
    const match = line.match(/^"(.+?)",(\d+)$/);
    if (!match) throw new Error(`Linha malformada: ${line}`);
    return { text: match[1], allowedVotes: parseInt(match[2], 10) };
  });

  console.log(`Inserindo ${rows.length} perguntas...`);

  for (const row of rows) {
    await db
      .insert(questions)
      .values({
        text: row.text,
        allowedVotes: row.allowedVotes,
      })
      .onConflictDoNothing({ target: questions.text });
  }

  console.log("Seed concluído.");
  await client.end();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
