"use client";
import { ArrowLeft, Archive } from "lucide-react";
import { use } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetPreviousQuestionsQuery } from "@/data/hooks/useGetPreviousResultsQuery";
import QuestionResultsCard from "@/app/(pages)/(private)/groups/[id]/previous/_components/questionResultCard";
import QuestionListLoading from "./loading";
import PageShell from "@/components/layout/PageShell";
import Kicker from "@/components/visual/Kicker";

export default function Previous({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data, isPending } = useGetPreviousQuestionsQuery(id);

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

      {isPending && <QuestionListLoading />}

      <div className="space-y-5">
        {data?.map((questionData, questionIndex) => (
          <QuestionResultsCard
            key={questionData.id}
            question={questionData}
            questionIndex={questionIndex}
            totalQuestions={data.length}
            groupId={id}
          />
        ))}
      </div>
    </PageShell>
  );
}
