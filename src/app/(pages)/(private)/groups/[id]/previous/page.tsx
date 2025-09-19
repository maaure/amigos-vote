"use client";
import { ArrowLeft, History } from "lucide-react";
import { use } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetPreviousQuestionsQuery } from "@/data/hooks/useGetPreviousResultsQuery";
import QuestionResultsCard from "@/app/(pages)/(private)/groups/[id]/previous/_components/questionCard";
import QuestionListLoading from "./loading";

export default function Previous({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data, isPending } = useGetPreviousQuestionsQuery(id);

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href={"/groups"}>
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </Button>
          </Link>

          <div className="flex items-center space-x-2 text-muted-foreground">
            <History className="w-4 h-4" />
            <span className="text-sm">Histórico Completo</span>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Histórico de Perguntas</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Veja todas as perguntas e resultados das votações anteriores
          </p>
        </div>

        {isPending && <QuestionListLoading />}

        <div className="space-y-4">
          {data?.map((questionData, questionIndex) => {
            return (
              <QuestionResultsCard
                key={questionData.id}
                question={questionData}
                questionIndex={questionIndex}
                totalQuestions={data.length}
                groupId={id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
