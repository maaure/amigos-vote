"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import HeaderActions from "./HeaderActions";

export default function Header() {
  const session = useSession();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={session.data?.user?.urlPic ?? undefined} />
          <AvatarFallback>
            {session.data?.user?.name
              ?.split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Olá, {session.data?.user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">Seus grupos de amigos</p>
        </div>
      </div>
      <HeaderActions />
    </div>
  );
}
