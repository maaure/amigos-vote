import PageShell from "@/components/layout/PageShell";
import Kicker from "@/components/visual/Kicker";

export default function QuestionVotePage() {
  return (
    <PageShell width="prose" centered>
      <div className="space-y-3 text-center">
        <Kicker>Pauta em pauta</Kicker>
        <h1 className="masthead text-4xl">Em breve neste tribunal.</h1>
        <p className="mx-auto max-w-sm font-mono text-xs uppercase leading-relaxed tracking-widest text-muted-foreground">
          A votação direta por pergunta ainda não foi aberta à plateia.
        </p>
      </div>
    </PageShell>
  );
}
