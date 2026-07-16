"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import HeaderActions from "./HeaderActions";
import Kicker from "@/components/visual/Kicker";

export default function Header() {
  const session = useSession();
  const firstName = session.data?.user?.name?.split(" ")[0] ?? "";
  const initials = session.data?.user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("");

  return (
    <header className="reveal flex flex-col gap-4 border-b-2 border-rule pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="size-14 rounded-none border-2 border-rule">
            <AvatarImage src={session.data?.user?.urlPic ?? undefined} />
            <AvatarFallback className="rounded-none bg-highlight font-display text-highlight-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-rule px-1.5 font-mono text-[0.55rem] uppercase tracking-widest text-background">
            Réu
          </span>
        </div>
        <div>
          <Kicker>Sessão aberta</Kicker>
          <h1 className="masthead text-3xl leading-none sm:text-4xl">{firstName}</h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Seus grupos de julgamento
          </p>
        </div>
      </div>
      <HeaderActions />
    </header>
  );
}
