"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageShell from "@/components/layout/PageShell";
import Kicker from "@/components/visual/Kicker";
import { useMySuggestions, useCancelSuggestion } from "@/data/hooks/useSuggestions";
import SuggestDialog from "@/app/(pages)/(private)/groups/[id]/_components/SuggestDialog";
import type { QuestionSuggestionSchemaOut } from "@/types/questionSuggestion";
import { ArrowLeft, Loader2Icon, Plus, XIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MODE_LABEL: Record<string, string> = {
  daily: "Diário",
  live: "Ao Vivo",
  both: "Ambos",
};

const STATUS_BADGE: Record<string, string> = {
  pending: "border-highlight text-highlight",
  approved: "border-chart-4 text-chart-4",
  rejected: "border-destructive text-destructive",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Em análise",
  approved: "Aprovada",
  rejected: "Rejeitada",
};

function SuggestionCard({
  s,
  onCancel,
  isCancelling,
}: {
  s: QuestionSuggestionSchemaOut;
  onCancel: (id: string) => void;
  isCancelling: boolean;
}) {
  return (
    <Card className="poster-frame bg-paper p-0">
      <CardContent className="flex items-start justify-between gap-4 p-4">
        <div className="min-w-0 space-y-1.5">
          <p className="text-lg leading-tight font-display">&ldquo;{s.text}&rdquo;</p>
          <div className="flex flex-wrap gap-2">
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
              {MODE_LABEL[s.mode]} · {s.allowedVotes} {s.allowedVotes === 1 ? "voto" : "votos"}
            </span>
            <span
              className={cn(
                "inline-block border px-1.5 font-mono text-[0.55rem] uppercase tracking-widest",
                STATUS_BADGE[s.status]
              )}
            >
              {STATUS_LABEL[s.status]}
            </span>
          </div>
          {s.status === "rejected" && s.rejectReason && (
            <p className="text-xs text-muted-foreground">
              <span className="font-mono uppercase tracking-widest">Motivo:</span> {s.rejectReason}
            </p>
          )}
        </div>
        {s.status === "pending" && (
          <Button
            variant="ghost"
            size="icon"
            disabled={isCancelling}
            onClick={() => onCancel(s.id)}
            className="shrink-0"
          >
            {isCancelling ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <XIcon className="size-4" />
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function SuggestionsPage() {
  const { data: suggestions, isPending } = useMySuggestions();

  const { mutate: cancel, isPending: isCancelling } = useCancelSuggestion(
    () => toast.success("Sugestão cancelada."),
    (error) => toast.error(error.message)
  );

  const handleCancel = (id: string) => cancel(id);

  return (
    <PageShell width="default">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Kicker>Minhas sugestões</Kicker>
          <h1 className="masthead text-4xl">Acusações propostas</h1>
          <p className="text-muted-foreground">
            Acompanhe o status das acusações que você enviou para curadoria.
          </p>
        </div>
        <Link href="/groups">
          <Button variant="ghost">
            <ArrowLeft className="size-4" />
            Voltar aos grupos
          </Button>
        </Link>
      </div>

      <SuggestDialog>
        <Button size="lg">
          <Plus className="size-4" />
          Sugerir nova acusação
        </Button>
      </SuggestDialog>

      {isPending ? (
        <p className="font-mono text-sm text-muted-foreground">Carregando...</p>
      ) : !suggestions?.length ? (
        <div className="border-2 border-dashed border-rule bg-paper p-8 text-center">
          <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
            Nenhuma sugestão ainda
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Clique em &ldquo;Sugerir nova acusação&rdquo; acima para começar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {suggestions.map((s) => (
            <SuggestionCard key={s.id} s={s} onCancel={handleCancel} isCancelling={isCancelling} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
