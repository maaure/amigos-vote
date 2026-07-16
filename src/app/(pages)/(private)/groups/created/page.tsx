"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Check, Copy } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import PageShell from "@/components/layout/PageShell";
import Kicker from "@/components/visual/Kicker";
import Stamp from "@/components/visual/Stamp";

export default function GroupCreated() {
  const searchParams = useSearchParams();
  const accessCode = searchParams.get("accessCode")!;
  const groupName = searchParams.get("groupName")!;

  const [copied, setCopied] = useState(false);

  const copyGroupCode = async () => {
    try {
      await navigator.clipboard.writeText(accessCode);
      setCopied(true);
      toast.success("Código copiado", {
        description: "O código do tribunal foi copiado para a área de transferência.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Erro ao copiar", {
        description: "Não foi possível copiar o código.",
      });
    }
  };

  return (
    <PageShell width="prose" centered>
      <Card className="poster-frame relative gap-0 overflow-hidden bg-paper p-0 py-0 paper-grain">
        <div className="halftone pointer-events-none absolute inset-0 opacity-10" />
        <CardContent className="relative space-y-6 p-8 text-center">
          <div className="mx-auto w-fit">
            <Stamp tone="gold" rotate={-7}>
              Tribunal aberto
            </Stamp>
          </div>

          <div className="space-y-2">
            <Kicker>Novo processo registrado</Kicker>
            <h1 className="masthead text-3xl">{groupName}</h1>
          </div>

          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Código de acesso
            </Label>
            <div className="mx-auto flex max-w-xs items-stretch gap-2">
              <div className="flex flex-1 items-center justify-center border-2 border-rule bg-background/50 p-3">
                <span className="font-display text-3xl tracking-[0.3em]">{accessCode}</span>
              </div>
              <Button variant="outline" onClick={copyGroupCode} className="px-4">
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </Button>
            </div>
          </div>

          <div className="border-2 border-dashed border-rule bg-background/40 p-4 text-left text-sm">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-highlight">
              Como chamar os réus
            </p>
            <ol className="mt-2 space-y-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <li>1. Copie o código acima.</li>
              <li>2. Envie pra galera.</li>
              <li>3. Eles entram em “Entrar num tribunal”.</li>
            </ol>
          </div>

          <Link href="/groups" className="block">
            <Button className="w-full py-6" size="lg">
              Ver meus tribunais
            </Button>
          </Link>
        </CardContent>
      </Card>
    </PageShell>
  );
}
