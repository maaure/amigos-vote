// Em dev (pnpm dev local): o socket container publica em localhost:3001.
// Em prod (Docker): o compose define SOCKET_URL=http://socket:3001.
const SOCKET_URL = process.env.SOCKET_URL ?? "http://localhost:3001";

/**
 * Notifica o servidor Socket.io para que ele emita `state:sync` ou `state:update`
 * para todos os clientes conectados na sala da sessão.
 *
 * Chamado pelo BFF após uma mutação (voto, avanço, join, close).
 * Falha silenciosamente em caso de erro (o polling de fallback cobre).
 */
export async function notifySession(
  sessionId: string,
  data?: Record<string, unknown>
): Promise<void> {
  try {
    await fetch(`${SOCKET_URL}/notify/${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data ? JSON.stringify(data) : undefined,
    });
  } catch (e) {
    console.error("[socket] notifySession falhou:", e);
  }
}
