"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PageShell from "@/components/layout/PageShell";
import Kicker from "@/components/visual/Kicker";
import { usePendingSuggestions, useReviewSuggestion } from "@/data/hooks/useSuggestions";
import type { QuestionSuggestionSchemaOut, ReviewAction } from "@/types/questionSuggestion";
import { suggestionSchema } from "@/types/questionSuggestion";
import { ArrowLeft, CheckIcon, Loader2Icon, XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MODE_LABEL: Record<string, string> = {
  daily: "Diário",
  live: "Ao Vivo",
  both: "Ambos",
};

type EditingState = {
  id: string | null;
  text: string;
  mode: "daily" | "live" | "both";
  allowedVotes: number;
};

export default function CurationPage() {
  const { data: pending, isPending, error } = usePendingSuggestions(true);

  const [editing, setEditing] = useState<EditingState>({
    id: null,
    text: "",
    mode: "daily",
    allowedVotes: 1,
  });

  const { mutate: review, isPending: isReviewing } = useReviewSuggestion(
    () => {
      toast.success("Revisão concluída.");
      setEditing({ id: null, text: "", mode: "daily", allowedVotes: 1 });
    },
    (err) => toast.error(err.message)
  );

  const handleReview = (id: string, action: ReviewAction) => {
    if (action === "approve") {
      const textCheck = suggestionSchema.shape.text.safeParse(
        editing.id === id ? editing.text : (pending?.find((s) => s.id === id)?.text ?? "")
      );
      if (!textCheck.success) {
        toast.error(textCheck.error.issues[0]?.message ?? "Texto inválido.");
        return;
      }
      review({
        id,
        payload: {
          action: "approve",
          text: editing.id === id ? editing.text : undefined,
          mode: editing.id === id ? editing.mode : undefined,
          allowedVotes: editing.id === id ? editing.allowedVotes : undefined,
        },
      });
    } else {
      const reason = prompt("Motivo da rejeição (opcional):");
      review({ id, payload: { action: "reject", reason: reason || undefined } });
    }
  };

  const startEditing = (s: QuestionSuggestionSchemaOut) => {
    setEditing({
      id: s.id,
      text: s.text,
      mode: s.mode,
      allowedVotes: s.allowedVotes,
    });
  };

  const cancelEditing = () => {
    setEditing({ id: null, text: "", mode: "daily", allowedVotes: 1 });
  };

  return (
    <PageShell width="default">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Kicker>Curadoria</Kicker>
          <h1 className="masthead text-4xl">Fila de revisão</h1>
          <p className="text-muted-foreground">
            Aprove ou rejeite as acusações sugeridas pela comunidade.
          </p>
        </div>
        <Link href="/groups">
          <Button variant="ghost">
            <ArrowLeft className="size-4" />
            Voltar aos grupos
          </Button>
        </Link>
      </div>

      {isPending ? (
        <p className="font-mono text-sm text-muted-foreground">Carregando...</p>
      ) : error ? (
        <div className="border-2 border-destructive bg-paper p-8 text-center">
          <p className="font-mono text-sm uppercase tracking-widest text-destructive">
            Acesso restrito
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Apenas curadores podem acessar esta página.
          </p>
        </div>
      ) : !pending?.length ? (
        <div className="border-2 border-dashed border-rule bg-paper p-8 text-center">
          <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
            Fila vazia
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Nenhuma sugestão pendente no momento.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {pending.length} {pending.length === 1 ? "pendente" : "pendentes"}
          </p>

          {pending.map((s) => {
            const isEditing = editing.id === s.id;
            return (
              <Card key={s.id} className="poster-frame bg-paper p-0">
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[0.6rem] uppercase tracking-widest text-highlight">
                      @{s.authorName ?? "anônimo"}
                    </span>
                    <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                      {MODE_LABEL[s.mode]} · {s.allowedVotes}{" "}
                      {s.allowedVotes === 1 ? "voto" : "votos"}
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={editing.text}
                        onChange={(e) => setEditing((prev) => ({ ...prev, text: e.target.value }))}
                        className="rounded-none font-display text-lg"
                      />
                      <div className="flex gap-1">
                        {(["daily", "live", "both"] as const).map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setEditing((prev) => ({ ...prev, mode: m }))}
                            className={cn(
                              "flex-1 border px-2 py-1 font-mono text-[0.6rem] uppercase tracking-widest",
                              editing.mode === m
                                ? "border-highlight bg-highlight text-highlight-foreground"
                                : "border-rule text-muted-foreground"
                            )}
                          >
                            {MODE_LABEL[m]}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setEditing((prev) => ({ ...prev, allowedVotes: n }))}
                            className={cn(
                              "flex-1 border px-2 py-1 font-mono text-xs",
                              editing.allowedVotes === n
                                ? "border-highlight bg-highlight text-highlight-foreground"
                                : "border-rule text-muted-foreground"
                            )}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-lg leading-tight font-display">&ldquo;{s.text}&rdquo;</p>
                  )}

                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelEditing}
                          disabled={isReviewing}
                        >
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleReview(s.id, "approve")}
                          disabled={isReviewing}
                          className="flex-1"
                        >
                          {isReviewing ? (
                            <Loader2Icon className="size-4 animate-spin" />
                          ) : (
                            <>
                              <CheckIcon className="size-4" />
                              Confirmar aprovação
                            </>
                          )}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditing(s)}
                          disabled={isReviewing}
                          className="flex-1"
                        >
                          <CheckIcon className="size-4" />
                          Aprovar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReview(s.id, "reject")}
                          disabled={isReviewing}
                        >
                          <XIcon className="size-4" />
                          Rejeitar
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
