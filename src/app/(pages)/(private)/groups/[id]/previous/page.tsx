"use client";
import { ArrowLeft, Archive, Swords } from "lucide-react";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useGetPreviousQuestionsQuery } from "@/data/hooks/useGetPreviousResultsQuery";
import { useLiveHistory } from "@/data/hooks/useLive";
import QuestionResultsCard from "@/app/(pages)/(private)/groups/[id]/previous/_components/questionResultCard";
import QuestionListLoading from "./loading";
import PageShell from "@/components/layout/PageShell";
import Kicker from "@/components/visual/Kicker";

export default function Previous({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data, isPending } = useGetPreviousQuestionsQuery(id);
  const { data: liveHistory } = useLiveHistory(id);

  return (
    <PageShell width="default">
      <div className="reveal flex flex-wrap items-center justify-between gap-3">
        <Link href={`/groups/${id}`}>
          <Button variant="outline">
            <ArrowLeft className="size-4" />
            Voltar ao julgamento
          </Button>
        </Link>

        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <Archive className="size-4" />
          Arquivo completo
        </span>
      </div>

      <div className="reveal space-y-3 text-center">
        <Kicker>Processos arquivados</Kicker>
        <h1 className="masthead text-4xl sm:text-5xl">Histórico de vereditos</h1>
        <p className="mx-auto max-w-xl leading-relaxed text-muted-foreground">
          Todas as acusações anteriores e quem levou a culpa em cada uma.
        </p>
      </div>

      {liveHistory && liveHistory.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Swords className="size-5 text-highlight" />
            <h2 className="masthead text-2xl">Sessões ao vivo</h2>
            <span className="h-[3px] flex-1 bg-rule" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {liveHistory.map((s) => (
              <Card key={s.sessionId} className="poster-frame bg-paper p-0">
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[0.6rem] uppercase tracking-widest text-highlight">
                      <Swords className="mr-1 inline size-3" />
                      Ao vivo
                    </span>
                    <span className="font-mono text-[0.55rem] uppercase tracking-widest text-muted-foreground">
                      {s.closedAt
                        ? new Date(s.closedAt).toLocaleDateString("pt-BR", {
                            day: "numeric",
                            month: "long",
                          })
                        : ""}
                    </span>
                  </div>
                  <p className="masthead text-lg leading-tight">{s.winnerName}</p>
                  <div className="flex gap-2 font-mono text-[0.55rem] uppercase tracking-widest text-muted-foreground">
                    <span className="border border-rule px-1.5 py-0.5">
                      {s.guiltReceived} culpa
                    </span>
                    <span className="border border-rule px-1.5 py-0.5">
                      {s.roundCount} rodadas
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-5">
        {isPending && <QuestionListLoading />}
        {data?.map((questionData, questionIndex) => (
          <QuestionResultsCard
            key={questionData.id}
            question={questionData}
            questionIndex={questionIndex}
            totalQuestions={data.length}
            groupId={id}
          />
        ))}
      </section>
    </PageShell>
  );
}
