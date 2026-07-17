"use client";
import { Button } from "@/components/ui/button";
import Kicker from "@/components/visual/Kicker";
import Stamp from "@/components/visual/Stamp";
import PageShell from "@/components/layout/PageShell";
import FriendCard from "@/app/(pages)/(private)/groups/[id]/_components/FriendCard";
import {
  useActiveLiveSession,
  useCreateLiveSession,
  useJoinLiveSession,
  useLiveSessionState,
  useCastVote,
  useAdvanceRound,
} from "@/data/hooks/useLive";
import { useSocketSubscription } from "@/data/hooks/useSocket";
import { useGetFriendsQuery } from "@/data/hooks/useGetFriendsQuery";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, Play, LogIn, Loader2Icon, Swords, Scale } from "lucide-react";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { LiveRoundOut } from "@/types/live";
import { LiveService } from "@/data/services/live.service";

const PHASE_LABEL: Record<string, string> = {
  intro: "Preparando...",
  voting: "Votação aberta",
  reveal: "Veredito",
  done: "Rodada encerrada",
};

function LiveLobby({
  sessionId,
  hostFriendId,
  participants,
  groupId,
}: {
  sessionId: string;
  hostFriendId: string;
  participants: { id: string; name: string; urlPic: string | null }[];
  groupId: string;
}) {
  const session = useSession();
  const { data: friends } = useGetFriendsQuery(groupId);
  const { mutate: advance, isPending: isAdvancing } = useAdvanceRound(sessionId);
  const { mutate: join, isPending: isJoining } = useJoinLiveSession(undefined, (err) =>
    toast.error(err.message)
  );
  const isHost = session.data?.user?.id === hostFriendId;
  const isParticipant = participants.some((p) => p.id === session.data?.user?.id);

  const nonParticipants = useMemo(
    () => (friends ?? []).filter((f) => !participants.some((p) => p.id === f.id)),
    [friends, participants]
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <Kicker>Salão do tribunal</Kicker>
        <h2 className="masthead text-3xl">Aguardando jurados</h2>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {participants.length} {participants.length === 1 ? "presente" : "presentes"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {participants.map((p) => (
          <FriendCard
            key={p.id}
            name={p.name}
            img={p.urlPic ?? undefined}
            onClick={() => {}}
            disabled
          />
        ))}
      </div>

      {isHost ? (
        <div className="flex justify-center gap-3">
          <Button
            size="lg"
            onClick={() => advance(undefined)}
            disabled={isAdvancing || participants.length < 3}
            className="py-6"
          >
            {isAdvancing ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <Play className="size-4" />
            )}
            {participants.length < 3 ? "Mínimo 3 jurados" : "Iniciar sessão"}
          </Button>
        </div>
      ) : !isParticipant ? (
        <div className="flex justify-center">
          <Button size="lg" onClick={() => join(sessionId)} disabled={isJoining} className="py-6">
            {isJoining ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <LogIn className="size-4" />
            )}
            Entrar no tribunal
          </Button>
        </div>
      ) : null}

      {nonParticipants.length > 0 && isHost && (
        <div className="border-2 border-dashed border-rule bg-paper p-4 text-center">
          <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            Membros do grupo que ainda não entraram
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-1 font-mono text-xs text-muted-foreground">
            {nonParticipants.map((f) => (
              <span key={f.id} className="border border-rule px-2 py-0.5">
                {f.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LiveRound({
  accusation,
  participants,
  myVotes,
  phase,
  sessionId,
  allowedVotes,
}: {
  accusation: string;
  participants: { id: string; name: string; urlPic: string | null }[];
  myVotes: { targetFriendId: string }[];
  phase: string;
  sessionId: string;
  allowedVotes: number;
}) {
  const { mutate: vote, isPending: isVoting } = useCastVote(sessionId);
  const { mutate: advance, isPending: isAdvancing } = useAdvanceRound(sessionId);
  const [selected, setSelected] = useState<string[]>([]);
  const session = useSession();

  const toggle = (id: string) => {
    if (phase !== "voting") return;
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < allowedVotes
          ? [...prev, id]
          : prev
    );
  };

  const handleVote = () => {
    if (selected.length === 0) return;
    vote(selected, {
      onSuccess: () => setSelected([]),
    });
  };

  const myVotedIds = myVotes.map((v) => v.targetFriendId);

  return (
    <div className="space-y-6">
      <div className="relative space-y-2 text-center">
        <Kicker>Acusação</Kicker>
        <blockquote className="masthead mx-auto max-w-2xl text-balance text-2xl leading-[1] sm:text-3xl">
          &ldquo;{accusation}&rdquo;
        </blockquote>
        <div className="mx-auto flex w-16 items-center gap-1">
          <span className="h-[3px] flex-1 bg-highlight" />
          <span className="size-1.5 rotate-45 bg-highlight" />
          <span className="h-[3px] flex-1 bg-highlight" />
        </div>
        <span className="block font-mono text-[0.6rem] uppercase tracking-widest text-highlight">
          {PHASE_LABEL[phase] ?? phase}
        </span>
        {phase === "voting" && (
          <span className="block font-mono text-[0.55rem] uppercase tracking-widest text-muted-foreground">
            Selecione até {allowedVotes} {allowedVotes === 1 ? "suspeito" : "suspeitos"}
            {selected.length > 0 && ` (${selected.length} selecionado${selected.length > 1 ? "s" : ""})`}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {participants
          .filter((p) => p.id !== session.data?.user?.id)
          .map((p) => {
            const isSelected = selected.includes(p.id);
            const hasVoted = myVotedIds.includes(p.id);
            return (
              <FriendCard
                key={p.id}
                name={p.name}
                img={p.urlPic ?? undefined}
                onClick={() => toggle(p.id)}
                selected={isSelected || hasVoted}
                disabled={phase !== "voting"}
              />
            );
          })}
      </div>

      <div className="flex justify-center gap-3">
        {phase === "voting" && (
          <Button
            size="lg"
            onClick={handleVote}
            disabled={selected.length === 0 || isVoting}
            className="min-w-[200px] py-6"
          >
            {isVoting ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              `Proclamar ${selected.length > 1 ? "votos" : "voto"}`
            )}
          </Button>
        )}
        <Button variant="outline" size="lg" onClick={() => advance(undefined)} disabled={isAdvancing}>
          {isAdvancing ? <Loader2Icon className="size-4 animate-spin" /> : "Avançar"}
        </Button>
      </div>
    </div>
  );
}

function LiveReveal({
  tally,
  participants,
  sessionId,
  isHost,
}: {
  tally: { targetFriendId: string; votes: number }[];
  participants: { id: string; name: string; urlPic: string | null }[];
  sessionId: string;
  isHost: boolean;
}) {
  const { mutate: advance, isPending: isAdvancing } = useAdvanceRound(sessionId);
  const [customAccusation, setCustomAccusation] = useState("");
  const maxVotes = Math.max(...tally.map((t) => t.votes), 0);
  const enriched = tally.map((t) => ({
    ...t,
    name: participants.find((p) => p.id === t.targetFriendId)?.name ?? "Desconhecido",
    isWinner: t.votes === maxVotes && t.votes > 0,
  }));

  return (
    <div className="space-y-6">
      <div className="space-y-3 text-center">
        <div className="mx-auto w-fit">
          <Stamp tone="highlight" rotate={-9}>
            Culpado
          </Stamp>
        </div>
        {enriched.length > 0 && (
          <p className="masthead text-2xl">{enriched.find((e) => e.isWinner)?.name ?? "Ninguém"}</p>
        )}
        {enriched.length === 0 && (
          <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
            Ninguém votou nesta rodada
          </p>
        )}
      </div>

      <div className="space-y-1">
        {enriched.map((t) => (
          <div
            key={t.targetFriendId}
            className={cn(
              "flex items-center justify-between border-2 px-4 py-2",
              t.isWinner ? "border-highlight bg-highlight/5" : "border-rule bg-paper"
            )}
          >
            <span className="font-mono text-xs uppercase tracking-widest">{t.name}</span>
            <span className="flex items-center gap-3">
              <span className="hidden h-1.5 w-24 overflow-hidden border border-rule bg-background sm:block">
                <div
                  className={cn("h-full", t.isWinner ? "bg-highlight" : "bg-rule")}
                  style={{ width: `${maxVotes > 0 ? (t.votes / maxVotes) * 100 : 0}%` }}
                />
              </span>
              <span className="font-display text-lg tabular-nums">{t.votes}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {isHost && (
          <div className="flex gap-2">
            <input
              type="text"
              value={customAccusation}
              onChange={(e) => setCustomAccusation(e.target.value)}
              placeholder="Acusação personalizada (opcional)"
              className="flex-1 border-2 border-rule bg-background px-3 py-2 font-display text-sm uppercase tracking-wide outline-none focus:border-highlight"
            />
          </div>
        )}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() =>
              advance(customAccusation.trim() ? { customText: customAccusation.trim() } : undefined)
            }
            disabled={isAdvancing}
            className="py-6"
          >
            {isAdvancing ? <Loader2Icon className="size-4 animate-spin" /> : "Próxima rodada"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function LiveFinale({
  results,
}: {
  results: {
    friendId: string;
    name: string;
    urlPic: string | null;
    guiltReceived: number;
    juradoPoints: number;
  }[];
}) {
  const [tab, setTab] = useState<"guilt" | "jurado">("guilt");
  const winner = results[0];
  const sortedByGuilt = [...results].sort((a, b) => b.guiltReceived - a.guiltReceived);
  const sortedByJurado = [...results].sort((a, b) => b.juradoPoints - a.juradoPoints);
  const display = tab === "guilt" ? sortedByGuilt : sortedByJurado;

  return (
    <div className="space-y-8">
      <div className="space-y-4 text-center">
        <Kicker>Julgamento encerrado</Kicker>
        <div className="mx-auto w-fit">
          {winner && (
            <Stamp tone="gold" rotate={-7}>
              Grande Culpado
            </Stamp>
          )}
        </div>
        {winner && <h2 className="masthead text-4xl sm:text-5xl">{winner.name}</h2>}
      </div>

      <div className="flex justify-center gap-1 border-2 border-rule bg-paper p-1">
        <button
          type="button"
          onClick={() => setTab("guilt")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors",
            tab === "guilt"
              ? "bg-highlight text-highlight-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Scale className="size-4" /> Culpa
        </button>
        <button
          type="button"
          onClick={() => setTab("jurado")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors",
            tab === "jurado"
              ? "bg-highlight text-highlight-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Swords className="size-4" /> Jurado
        </button>
      </div>

      <div className="space-y-1">
        {display.map((r, i) => {
          const isWinner = i === 0;
          return (
            <div
              key={r.friendId}
              className={cn(
                "flex items-center justify-between border-2 px-4 py-3",
                isWinner ? "border-gold bg-gold/5" : "border-rule bg-paper"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="masthead text-2xl text-muted-foreground">#{i + 1}</span>
                <div>
                  <p className="font-bold leading-tight">{r.name}</p>
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    {tab === "guilt"
                      ? `${r.guiltReceived} ${r.guiltReceived === 1 ? "voto" : "votos"} de culpa`
                      : `${r.juradoPoints} ${r.juradoPoints === 1 ? "acerto" : "acertos"} de maioria`}
                  </p>
                </div>
              </div>
              <span className="font-display text-2xl">
                {tab === "guilt" ? r.guiltReceived : r.juradoPoints}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Link href="/groups">
          <Button variant="outline" size="lg">
            <ArrowLeft className="size-4" />
            Voltar aos grupos
          </Button>
        </Link>
      </div>
    </div>
  );
}

const REACTIONS = ["😂", "😱", "🔥", "😭", "👍", "🤡"];

function ReactBar({
  sessionId,
  reactions,
}: {
  sessionId: string;
  reactions: { reaction: string; friendName: string }[];
}) {
  const [sending, setSending] = useState<string | null>(null);
  const [floating, setFloating] = useState<{ id: number; reaction: string; key: number }[]>([]);
  const floatingRef = useRef(floating);
  floatingRef.current = floating;
  const nextId = useRef(0);

  // New reactions from state trigger floating animation
  useEffect(() => {
    if (reactions.length > 0) {
      const latest = reactions[0];
      if (!floatingRef.current.some((f) => f.reaction === latest.reaction)) {
        const id = nextId.current++;
        setFloating((prev) => [...prev.slice(-8), { id, reaction: latest.reaction, key: id }]);
        setTimeout(() => {
          setFloating((prev) => prev.filter((f) => f.id !== id));
        }, 3000);
      }
    }
  }, [reactions]);

  const handleReact = async (emoji: string) => {
    setSending(emoji);
    try {
      await LiveService.react(sessionId, emoji);
    } catch {
      toast.error("Erro ao enviar reação.");
    }
    setSending(null);
  };

  return (
    <div className="relative">
      {/* Floating reactions */}
      {floating.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
          {floating.map((f) => (
            <span
              key={f.id}
              className="animate-reveal text-4xl"
              style={{
                animation: "float-up 2.5s ease-out both",
                position: "absolute",
                bottom: "20%",
              }}
            >
              {f.reaction}
            </span>
          ))}
        </div>
      )}
      {/* Reaction buttons */}
      <div className="flex justify-center gap-1.5 border-t-2 border-rule pt-4">
        {REACTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => handleReact(emoji)}
            disabled={sending !== null}
            className="border-2 border-rule bg-paper px-3 py-1.5 text-xl transition-transform hover:-translate-y-1 hover:border-highlight hover:shadow-[2px_2px_0_0_var(--highlight)] disabled:opacity-50"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function LivePage({ params }: { params: Promise<{ id: string }> }) {
  const groupId = use(params).id;
  const session = useSession();

  const { data: activeData, isLoading: activeLoading } = useActiveLiveSession(groupId);
  const activeSession = activeData?.data ?? null;
  const sessionId = activeSession?.id ?? null;

  const { data: state, isLoading: stateLoading } = useLiveSessionState(sessionId, !!sessionId);

  // Conecta ao Socket.io para receber atualizações em tempo real
  useSocketSubscription(state?.session?.id ?? null);

  const { mutate: createSession, isPending: isCreating } = useCreateLiveSession(
    () => toast.success("Sessão aberta!"),
    (err) => toast.error(err.message)
  );

  const { mutate: joinSession, isPending: isJoining } = useJoinLiveSession(undefined, (err) =>
    toast.error(err.message)
  );

  const alreadyJoined = state?.participants?.some((p) => p.id === session.data?.user?.id);
  const currentRound = state?.currentRound as LiveRoundOut | null;

  if (activeLoading || stateLoading) {
    return (
      <PageShell width="default">
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
            Aguardando...
          </p>
        </div>
      </PageShell>
    );
  }

  if (!activeSession) {
    return (
      <PageShell width="default">
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 text-center">
          <Kicker>Nenhuma sessão ativa</Kicker>
          <h1 className="masthead text-3xl">Este grupo não tem uma sessão ao vivo agora.</h1>
          <p className="max-w-sm text-muted-foreground">
            Crie uma nova sessão para reunir a galera em tempo real.
          </p>
          <div className="flex gap-3">
            <Link href={`/groups/${groupId}`}>
              <Button variant="outline">
                <ArrowLeft className="size-4" />
                Voltar ao grupo
              </Button>
            </Link>
            <Button
              size="lg"
              onClick={() => createSession({ groupId })}
              disabled={isCreating}
              className="py-6"
            >
              {isCreating ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <Play className="size-4" />
              )}
              Abrir sessão ao vivo
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  const canSeeContent = alreadyJoined || activeSession.hostFriendId === session.data?.user?.id;

  return (
    <PageShell width="default">
      <div className="flex items-center justify-between">
        <Link href={`/groups/${groupId}`}>
          <Button variant="ghost">
            <ArrowLeft className="size-4" />
            Grupo
          </Button>
        </Link>
        <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
          Ao vivo · rodada {activeSession.currentRound}/{activeSession.roundCount}
        </span>
      </div>

      {!canSeeContent && (
        <div className="flex items-center justify-between border-2 border-highlight bg-highlight/5 px-4 py-3">
          <p className="font-mono text-xs uppercase tracking-widest text-foreground">
            Você não está participando desta rodada.
          </p>
          <Button
            size="sm"
            variant="submit"
            onClick={() => joinSession(sessionId!)}
            disabled={isJoining}
          >
            {isJoining ? <Loader2Icon className="size-4 animate-spin" /> : <LogIn className="size-4" />}
            Entrar
          </Button>
        </div>
      )}

      {activeSession.status === "lobby" ? (
        <LiveLobby
          sessionId={sessionId!}
          hostFriendId={activeSession.hostFriendId}
          participants={state?.participants ?? []}
          groupId={groupId}
        />
      ) : activeSession.status === "closed" ? (
        <LiveFinale results={state?.results ?? []} />
      ) : currentRound && (currentRound.phase === "reveal" || currentRound.phase === "done") ? (
        <LiveReveal
          tally={state!.tally}
          participants={state!.participants}
          sessionId={sessionId!}
          isHost={session.data?.user?.id === activeSession.hostFriendId}
        />
      ) : currentRound ? (
        <LiveRound
          accusation={currentRound.customText ?? "Acusação do dia"}
          participants={state!.participants}
          myVotes={state!.votes}
          phase={currentRound.phase}
          sessionId={sessionId!}
          allowedVotes={currentRound.allowedVotes}
        />
      ) : null}

      {(currentRound && currentRound.phase !== "intro") && (
        <ReactBar sessionId={sessionId!} reactions={state?.reactions ?? []} />
      )}
    </PageShell>
  );
}
