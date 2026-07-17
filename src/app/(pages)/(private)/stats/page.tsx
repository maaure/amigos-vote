"use client";
import { Skull, Lightbulb, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageShell from "@/components/layout/PageShell";
import Kicker from "@/components/visual/Kicker";
import { useRankings } from "@/data/hooks/useStats";
import { cn } from "@/lib/utils";

function RankingTable({
  title,
  icon: Icon,
  data,
  accent,
}: {
  title: string;
  icon: React.ElementType;
  data: { rank: number; name: string; total: number }[];
  accent: "highlight" | "gold";
}) {
  return (
    <Card className="poster-frame gap-0 overflow-hidden bg-paper p-0 py-0">
      <CardContent className="p-0">
        <div className={cn("flex items-center gap-2 border-b-2 border-rule px-5 py-4", accent === "highlight" ? "bg-highlight/5" : "bg-gold/5")}>
          <Icon className={cn("size-5", accent === "highlight" ? "text-highlight" : "text-gold")} />
          <h2 className="masthead text-xl">{title}</h2>
        </div>
        <div className="space-y-0">
          {data.map((r) => (
            <div
              key={r.rank}
              className={cn(
                "flex items-center justify-between px-5 py-3",
                r.rank % 2 === 0 ? "bg-background/40" : "bg-paper"
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn(
                  "flex size-7 items-center justify-center font-display text-sm",
                  r.rank <= 3 ? "bg-rule text-background" : "text-muted-foreground"
                )}>
                  {r.rank}
                </span>
                <span className="font-bold leading-tight">{r.name}</span>
              </div>
              <span className="font-mono text-sm tabular-nums text-muted-foreground">
                {r.total}
              </span>
            </div>
          ))}
        </div>
        {data.length === 0 && (
          <p className="px-5 py-6 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Nenhum dado ainda
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function StatsPage() {
  const { data, isPending } = useRankings();

  return (
    <PageShell width="default">
      <Link href="/groups" className="block w-fit">
        <Button variant="ghost">
          <ArrowLeft className="size-4" />
          Voltar
        </Button>
      </Link>

      <div className="space-y-2">
        <Kicker>Estatísticas globais</Kicker>
        <h1 className="masthead text-4xl">Ranking do Tribunal</h1>
        <p className="text-muted-foreground">
          Quem mais foi eleito culpado e quem mais contribuiu com acusações.
        </p>
      </div>

      {isPending ? (
        <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
          Carregando...
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RankingTable
            title="Top Culpados"
            icon={Skull}
            data={data?.culpados ?? []}
            accent="highlight"
          />
          <RankingTable
            title="Top Sugeridores"
            icon={Lightbulb}
            data={data?.sugeridores ?? []}
            accent="gold"
          />
        </div>
      )}
    </PageShell>
  );
}
