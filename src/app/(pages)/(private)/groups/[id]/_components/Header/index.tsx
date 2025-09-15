"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function Header() {
  const session = useSession();

  const handleLogout = () => {
    signOut();
    toast("Logout realizado", {
      description: "Até logo!",
    });
    redirect("/");
  };

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
      <Button variant="ghost" onClick={handleLogout} size="sm">
        <LogOut className="w-4 h-4 mr-2" />
        Sair
      </Button>
    </div>
  );
}
