"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSuggestQuestion } from "@/data/hooks/useSuggestions";
import { cn } from "@/lib/utils";
import { suggestionSchema, type SuggestionFormValues } from "@/types/questionSuggestion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function SuggestDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SuggestionFormValues>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: { text: "", mode: "daily", allowedVotes: 1 },
  });

  const mode = watch("mode");
  const allowedVotes = watch("allowedVotes");

  const { mutate: suggest, isPending } = useSuggestQuestion(
    (data) => {
      toast.success(data.message);
      reset();
      setOpen(false);
    },
    (error) => {
      toast.error(error.message);
    }
  );

  const onSubmit = (data: SuggestionFormValues) => {
    suggest(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="masthead text-2xl">Sugerir acusação</DialogTitle>
          <DialogDescription>
            Sua ideia vai pra curadoria antes de entrar no banco de perguntas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text" className="font-mono text-xs uppercase tracking-widest">
              Texto da acusação *
            </Label>
            <Textarea
              id="text"
              {...register("text")}
              className={cn("min-h-[4rem] rounded-none font-display text-lg", {
                "border-destructive": !!errors.text,
              })}
              placeholder="Quem deixou a geladeira aberta?"
              rows={3}
            />
            {errors.text && (
              <span className="font-mono text-xs text-destructive">{errors.text.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase tracking-widest">Modo *</Label>
            <div className="flex gap-1">
              {(["daily", "live", "both"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setValue("mode", m)}
                  className={cn(
                    "flex-1 border-2 border-rule px-3 py-2 font-mono text-xs uppercase tracking-widest transition-colors",
                    mode === m
                      ? "bg-highlight text-highlight-foreground border-highlight"
                      : "bg-background text-muted-foreground hover:border-muted-foreground"
                  )}
                >
                  {m === "daily" ? "Diário" : m === "live" ? "Ao Vivo" : "Ambos"}
                </button>
              ))}
            </div>
            {errors.mode && (
              <span className="font-mono text-xs text-destructive">{errors.mode.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase tracking-widest">
              Votos permitidos *
            </Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setValue("allowedVotes", n)}
                  className={cn(
                    "flex-1 border-2 border-rule px-3 py-2 font-mono text-sm transition-colors",
                    allowedVotes === n
                      ? "bg-highlight text-highlight-foreground border-highlight"
                      : "bg-background text-muted-foreground hover:border-muted-foreground"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            {errors.allowedVotes && (
              <span className="font-mono text-xs text-destructive">
                {errors.allowedVotes.message}
              </span>
            )}
          </div>

          <div className="border-2 border-dashed border-rule bg-background/40 p-3 text-sm">
            <p className="font-mono text-[0.6rem] font-bold uppercase tracking-widest text-highlight">
              Regras
            </p>
            <ul className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
              <li>— Máximo 3 sugestões pendentes por pessoa.</li>
              <li>— Não repita acusações que já existem.</li>
              <li>— O curador pode editar antes de aprovar.</li>
            </ul>
          </div>

          <Button type="submit" size="lg" disabled={isPending} className="w-full py-6">
            {isPending ? "Enviando..." : "Enviar para curadoria"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
