import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { friends, groups, groupParticipation, questions, votes } from "../src/db/schema";

// ponytail: seeder de dev, apaga o banco e recria com dados mock.
// Rode com: npx tsx scripts/seed-mock.ts  (banco local do docker compose)

const dbUrl =
  process.env.SEED_DB_URL ??
  "postgresql://inimigo-user:inimigo-pass@localhost:5432/inimigo-db";
const client = postgres(dbUrl, { prepare: false });
const db = drizzle(client);

// Seu googleId (o "sub" do Google). Loga uma vez com o Google, rode
// "SELECT google_id FROM friends" e passe o valor em SEED_GOOGLE_ID.
const YOUR_GOOGLE_ID = process.env.SEED_GOOGLE_ID;
if (!YOUR_GOOGLE_ID) {
  console.error(
    "Faltou SEED_GOOGLE_ID: logue uma vez no app com o Google e rode " +
      'docker compose exec db psql -U inimigo-user -d inimigo-db -c "SELECT google_id FROM friends"'
  );
  process.exit(1);
}

// RNG determinístico (mulberry32); os dados ficam idênticos entre execuções
function lcg(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dateDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

async function main() {
  console.log("Limpando banco...");
  await db.delete(votes);
  await db.delete(groupParticipation);
  await db.delete(groups);
  await db.delete(questions);
  await db.delete(friends);

  // --- Amigos ---
  const amigos = [
    { name: "Maure Andrade", urlPic: "https://i.pravatar.cc/150?img=68", googleId: YOUR_GOOGLE_ID },
    { name: "Zeca", urlPic: "https://i.pravatar.cc/150?img=12" },
    { name: "Larissa", urlPic: "https://i.pravatar.cc/150?img=47" },
    { name: "Tiagão", urlPic: "https://i.pravatar.cc/150?img=59" },
    { name: "Pri", urlPic: "https://i.pravatar.cc/150?img=44" },
    { name: "Bruno", urlPic: "https://i.pravatar.cc/150?img=32" },
    { name: "Camila", urlPic: "https://i.pravatar.cc/150?img=20" },
    { name: "Diego", urlPic: "https://i.pravatar.cc/150?img=15" },
    { name: "Fernanda", urlPic: "https://i.pravatar.cc/150?img=5" },
  ];
  const friendRows = await db
    .insert(friends)
    .values(amigos)
    .onConflictDoNothing({ target: friends.googleId })
    .returning();
  const byName = new Map(friendRows.map((f) => [f.name, f]));
  const me = byName.get("Maure Andrade")!;
  console.log(`${friendRows.length} amigos`);

  // --- Grupos (todos incluem você) ---
  const groupDefs: { name: string; desc: string; code: string; createdBy: string; members: string[] }[] = [
    {
      name: "Bonde do Interior",
      desc: "Fim de semana lá na roça, quem dá o cano perde o assento da frente.",
      code: "BONDE-INT",
      createdBy: "Maure Andrade",
      members: ["Maure Andrade", "Zeca", "Larissa", "Tiagão", "Pri"],
    },
    {
      name: "Rolezeiros de Domingo",
      desc: "O grupo dos que sempre dizem 'tô chegando'.",
      code: "ROLEZ-2026",
      createdBy: "Zeca",
      members: ["Maure Andrade", "Zeca", "Bruno", "Camila", "Diego", "Fernanda"],
    },
    {
      name: "Trabalho",
      desc: "Coffee break, code review e fofoca de sexta.",
      code: "TRAB-9-5",
      createdBy: "Larissa",
      members: ["Maure Andrade", "Larissa", "Tiagão", "Camila"],
    },
  ];

  const groupRows: { id: string; name: string }[] = [];
  for (const g of groupDefs) {
    const [row] = await db
      .insert(groups)
      .values({
        name: g.name,
        description: g.desc,
        accessCode: g.code,
        createdBy: byName.get(g.createdBy)!.id,
        membersCount: g.members.length,
      })
      .returning();
    groupRows.push({ id: row.id, name: g.name });
    await db.insert(groupParticipation).values(
      g.members.map((m) => ({ group: row.id, user: byName.get(m)!.id }))
    );
  }
  console.log(`${groupRows.length} grupos`);

  // --- Perguntas ---
  const past = [
    { text: "Quem é o mais provável de dar o cano no rolê na última hora sem avisar?", allowedVotes: 1, daysAgo: 6 },
    { text: "Quem pegaria o último pedaço de pizza sem querer enquanto todos ainda estão comendo?", allowedVotes: 1, daysAgo: 5 },
    { text: "Quem é o mais provável de dizer 'tô chegando' ainda deitado na cama?", allowedVotes: 1, daysAgo: 4 },
    { text: "Quem é o mais provável de se perder no próprio bairro e culpar o GPS?", allowedVotes: 2, daysAgo: 3 },
    { text: "Quem é o mais provável de defender o próprio erro até o fim só para não pedir desculpas?", allowedVotes: 1, daysAgo: 2 },
  ];
  const today = {
    text: "Quem é o mais provável de fingir que não viu a mensagem do grupo para não se comprometer?",
    allowedVotes: 1,
  };
  const unused = [
    { text: "Quem faria a divisão da conta na calculadora duas vezes para pagar cinquenta centavos a menos?", allowedVotes: 1 },
    { text: "Quem é o mais provável de dormir no ponto do ônibus e acordar no terminal errado?", allowedVotes: 1 },
    { text: "Quem é o mais provável de dar conselho amoroso sendo o mais atrapalhado da turma?", allowedVotes: 2 },
    { text: "Quem postaria a foto do amigo sem pedir permissão e ainda escolheria a pior dela?", allowedVotes: 2 },
  ];

  const pastRows = await db
    .insert(questions)
    .values(past.map((q) => ({ text: q.text, allowedVotes: q.allowedVotes, used: true, publishedWhen: dateDaysAgo(q.daysAgo) })))
    .returning();
  const [todayRow] = await db
    .insert(questions)
    .values({ text: today.text, allowedVotes: today.allowedVotes, used: true, publishedWhen: dateDaysAgo(0) })
    .returning();
  await db.insert(questions).values(unused.map((q) => ({ text: q.text, allowedVotes: q.allowedVotes, used: false })));
  console.log(`${pastRows.length + 1 + unused.length} perguntas (${pastRows.length} passadas + hoje + ${unused.length} futuras)`);

  // --- Votos: cada membro vota no "vencedor" da vez em cada grupo ---
  const rng = lcg(42);
  const groupMembers = groupRows.map((g) => ({
    group: g,
    members: groupDefs.find((d) => d.name === g.name)!.members.map((m) => byName.get(m)!.id),
  }));

  for (const q of [...pastRows, todayRow]) {
    const isToday = q.id === todayRow.id;
    for (const { group, members } of groupMembers) {
      for (const voter of members) {
        if (isToday && voter === me.id) continue; // você ainda não votou hoje
        const winner = members[Math.floor(rng() * members.length)];
        const picks = new Set([winner]);
        if (q.allowedVotes === 2) {
          let second = members[Math.floor(rng() * members.length)];
          while (second === winner) second = members[Math.floor(rng() * members.length)];
          picks.add(second);
        }
        await db.insert(votes).values(
          [...picks].map((friendId) => ({ voterId: voter, friendId, questionId: q.id, groupId: group.id }))
        );
      }
    }
  }
  console.log("Votos computados (você ainda não votou na pergunta de hoje).");
  console.log("\nCódigos de acesso dos grupos: " + groupDefs.map((g) => g.code).join(", "));
  console.log(`Seu amigo foi criado com o googleId ${YOUR_GOOGLE_ID}.`);

  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
