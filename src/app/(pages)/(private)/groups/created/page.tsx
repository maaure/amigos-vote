"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import Kicker from "@/components/visual/Kicker";
import Stamp from "@/components/visual/Stamp";
import GroupInviteCard from "../_components/GroupInviteCard";

export default function GroupCreated() {
  const searchParams = useSearchParams();
  const accessCode = searchParams.get("accessCode")!;
  const groupName = searchParams.get("groupName")!;

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

          <GroupInviteCard accessCode={accessCode} groupName={groupName} />

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
