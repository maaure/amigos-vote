import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const SOCKET_PATH = `${BASE_PATH}/socket.io`;

/**
 * Conecta ao servidor Socket.io, entra na sala da sessão e,
 * ao receber `state:update`, invalida a query de estado
 * para que o React Query refetch imediatamente.
 *
 * Fallback: o polling (refetchInterval) continua como backup.
 */
export function useSocketSubscription(sessionId: string | null) {
  const qc = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const socket = io({
      path: SOCKET_PATH,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      socket.emit("join", sessionId);
    });

    socket.on("state:update", () => {
      qc.invalidateQueries({ queryKey: ["live", "state", sessionId] });
    });

    socket.on("state:sync", (data) => {
      qc.setQueryData(["live", "state", sessionId], data);
    });

    socket.on("disconnect", () => {});

    socketRef.current = socket;

    return () => {
      socket.emit("leave", sessionId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [sessionId, qc]);
}
