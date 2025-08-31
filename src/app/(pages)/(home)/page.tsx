import { Button } from "@/components/ui/button";
import VotingSection from "@/app/(pages)/(home)/_components/VotingSection";
import { Calendar, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-4xl m-auto space-y-8">
      <header className="w-full flex flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-4 mt-6 text-sky-500 ">
          <Sparkles />
          <h1 className="text-4xl text-center font-bold">Votação do dia</h1>
        </div>
        <p className="text-muted-foreground">
          Todo dia uma nova pergunta de caráter duvidoso. Escolha quais dos amigos que você acha que se encaixam melhor.
        </p>
      </header>

      <Button variant="outline">
        <Calendar /> Ver Resultados de Ontem
      </Button>

      <section className="border p-8 rounded-2xl space-y-2 text-center bg-secondary">
        <p className="text-sky-500 font-bold">Pergunta do dia • #22</p>
        <h2 className="text-2xl">
          Todos nós seremos executados em uma semana, você só pode escolher três de nós para sobreviver, quem você
          escolhe?
        </h2>
      </section>

      <VotingSection />
    </div>
  );
}
