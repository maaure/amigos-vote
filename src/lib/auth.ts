import type { Session } from "next-auth";

/**
 * Lista de github_id autorizados a curar sugestões (ADMIN_GITHUB_IDS no .env,
 * separados por vírgula). Ponto único de checagem de curadoria — facilita
 * trocar o modelo de moderação depois (ver docs/SUGESTOES.md §Extensibilidade).
 */
function adminGithubIds(): string[] {
  return (process.env.ADMIN_GITHUB_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function isCurator(session: Session | null): boolean {
  const githubId = session?.user?.githubId;
  return !!githubId && adminGithubIds().includes(githubId);
}
