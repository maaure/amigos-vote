import { Button } from "@/components/ui/button";
import VotingSection from "@/app/(pages)/_components/VotingSection";
import { Calendar, Sparkles } from "lucide-react";
import QuestionArea from "./_components/QuestionArea";
import Link from "next/link";
import Timer from "./_components/Timer";

export default function Home() {
  return (
    <div className="max-w-4xl m-auto flex flex-col gap-6">
      <header className="w-full flex flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-4 mt-6 text-sky-500 ">
          <Sparkles />
          <h1 className="text-4xl text-center font-bold">Votação do dia</h1>
        </div>
        <p className="text-muted-foreground px-4 text-center">
          Todo dia uma nova pergunta de caráter duvidoso. Escolha quais dos amigos que você acha que se encaixam melhor.
        </p>
      </header>

      <div className="flex justify-between items-center mx-4">
        <Link href="/previous">
          <Button variant="outline">
            <Calendar /> Ver Últimos Resultados
          </Button>
        </Link>

        <Timer />
      </div>

      <QuestionArea />

      <VotingSection />
    </div>
  );
}
