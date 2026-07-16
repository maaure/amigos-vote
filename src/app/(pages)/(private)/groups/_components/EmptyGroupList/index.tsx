import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import Kicker from "@/components/visual/Kicker";

export default function EmptyGroupList() {
  return (
    <div className="poster-frame relative overflow-hidden bg-paper px-6 py-16 text-center paper-grain">
      <div className="halftone pointer-events-none absolute inset-0 opacity-10" />
      <div className="relative space-y-5">
        <Kicker>Nenhum processo arquivado</Kicker>
        <h3 className="masthead text-3xl">O tribunal está vazio.</h3>
        <p className="mx-auto max-w-md leading-relaxed text-muted-foreground">
          Abra o primeiro tribunal ou entre num grupo existente com o código que seu amigo passou.
        </p>
        <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
          <Link href="/groups/new" className="block">
            <Button size="lg">
              <Plus className="size-4" />
              Abrir tribunal
            </Button>
          </Link>
          <Link href="/groups/join" className="block">
            <Button variant="outline" size="lg">
              <Users className="size-4" />
              Entrar com código
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
