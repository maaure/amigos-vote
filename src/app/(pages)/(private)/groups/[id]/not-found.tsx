import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Users } from "lucide-react";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Kicker from "@/components/visual/Kicker";
import Stamp from "@/components/visual/Stamp";

export default async function NotFound() {
  return (
    <PageShell width="prose" centered>
      <Card className="poster-frame relative gap-0 overflow-hidden bg-paper p-0 py-0 paper-grain">
        <div className="halftone pointer-events-none absolute inset-0 opacity-10" />
        <CardContent className="relative space-y-6 p-8 text-center">
          <div className="mx-auto w-fit">
            <Stamp tone="ink" rotate={-8}>
              Arquivo confidencial
            </Stamp>
          </div>
          <div className="space-y-2">
            <Kicker>Processo indisponível</Kicker>
            <h1 className="masthead text-3xl">Tribunal não encontrado</h1>
          </div>
          <p className="mx-auto max-w-sm leading-relaxed text-muted-foreground">
            Você não tem permissão para acessar este grupo ou ele não existe nos registros.
          </p>
          <ul className="mx-auto max-w-sm space-y-1 text-left font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <li>— Você não é membro deste tribunal.</li>
            <li>— O grupo foi removido.</li>
            <li>— O link está incorreto.</li>
          </ul>
          <div className="flex flex-col gap-3 pt-2">
            <Link href="/groups" className="w-full">
              <Button className="w-full py-6" size="lg">
                <Users className="size-4" />
                Ver meus tribunais
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                <Home className="size-4" />
                Voltar ao início
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
