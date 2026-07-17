import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const SOCKET_PATH = `${BASE_PATH}/socket.io`;
// Em dev: NEXT_PUBLIC_SOCKET_URL=http://localhost:3001 (socket container direto)
// Em prod: SOCKET_URL não é public — o cliente conecta na mesma origem e o Caddy faz o proxy
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

/**
 * Conecta ao servidor Socket.io para receber `state:update` em tempo real.
 * Fallback: o polling de 3s no useLiveSessionState cobre desconexões.
 */
export function useSocketSubscription(sessionId: string | null) {
  const qc = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const socket = io(SOCKET_URL, {
      path: SOCKET_URL ? undefined : SOCKET_PATH,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      console.log("[socket] conectado", socket.id);
      socket.emit("join", sessionId);
      qc.invalidateQueries({ queryKey: ["live", "state", sessionId] });
    });

    socket.on("state:sync", (data) => {
      console.log("[socket] state:sync recebido", data?.currentRound?.phase);
      qc.setQueryData(["live", "state", sessionId], data);
    });

    socket.on("state:update", () => {
      console.log("[socket] state:update");
      qc.invalidateQueries({ queryKey: ["live", "state", sessionId] });
    });

    socket.on("connect_error", (err) => {
      console.error("[socket] erro de conexao:", err.message);
    });

    socketRef.current = socket;

    return () => {
      socket.emit("leave", sessionId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [sessionId, qc]);
}
