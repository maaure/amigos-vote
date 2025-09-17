"use client";
import { Button } from "@/components/ui/button";
import VotingSection from "@/app/(pages)/(private)/groups/[id]/_components/VotingSection";
import { Calendar, Sparkles } from "lucide-react";
import Link from "next/link";
import Timer from "./_components/Timer";
import QuestionArea from "./_components/QuestionArea";
import Header from "./_components/Header";
import { useParams } from "next/navigation";

export default function Home() {
  const params = useParams();
  const id = params?.id;

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Header />

        <section className="w-full flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-4 mt-6 text-sky-500 ">
            <Sparkles />
            <h1 className="text-4xl text-center font-bold">Pergunta do Dia</h1>
          </div>
          <p className="text-muted-foreground px-4 text-center">
            Selecione o seu amigo do seu grupo que você acha que se encaixaria melhor na pergunta de
            hoje.
          </p>
        </section>

        <div className="flex justify-between items-center mx-4">
          <Link href={`/groups/${id}/previous`}>
            <Button variant="outline">
              <Calendar /> Ver Últimos Resultados
            </Button>
          </Link>
          <Timer />
        </div>

        <QuestionArea />

        <VotingSection groupId={id as string} />
      </div>
    </div>
  );
}
