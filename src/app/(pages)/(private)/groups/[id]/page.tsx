"use client";
import { Button } from "@/components/ui/button";
import VotingSection from "@/app/(pages)/(private)/groups/[id]/_components/VotingSection";
import { Archive, Loader2Icon, LogIn, Play } from "lucide-react";
import Link from "next/link";
import Timer from "./_components/Timer";
import QuestionArea from "./_components/QuestionArea";
import Header from "./_components/Header";
import PageShell from "@/components/layout/PageShell";
import { useParams } from "next/navigation";
import { useActiveLiveSession, useCreateLiveSession } from "@/data/hooks/useLive";
import { toast } from "sonner";

export default function Home() {
  const params = useParams();
  const id = params?.id as string;

  const { data: activeData } = useActiveLiveSession(id);
  const activeSession = activeData?.data ?? null;

  const { mutate: createSession, isPending: isCreating } = useCreateLiveSession(
    () => toast.success("Sessão ao vivo aberta!"),
    (err) => toast.error(err.message)
  );

  return (
    <PageShell width="default">
      <Header />

      <div
        className="reveal flex flex-wrap items-center justify-between gap-3"
        style={{ animationDelay: "60ms" }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/groups/${id}/previous`}>
            <Button variant="outline">
              <Archive className="size-4" />
              Arquivo de vereditos
            </Button>
          </Link>

          {activeSession ? (
            <Link href={`/groups/${id}/live`}>
              <Button variant="submit" className="animate-tick">
                <LogIn className="size-4" />
                Sessão aberta — entrar
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              onClick={() => createSession({ groupId: id })}
              disabled={isCreating}
            >
              {isCreating ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <Play className="size-4" />
              )}
              Sessão ao vivo
            </Button>
          )}
        </div>
        <Timer />
      </div>

      <QuestionArea groupId={id} />

      <VotingSection groupId={id} />
    </PageShell>
  );
}
