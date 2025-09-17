"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { LogOut, Users } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";

export default function Header() {
  const session = useSession();

  const handleLogout = () => {
    signOut();
    toast("Logout realizado", {
      description: "Até logo!",
    });
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
      <div className="flex gap-2">
        <Link href={"/groups"} className="block">
          <Button variant="outline" size="sm">
            <Users className="w-4 h-4 mr-2" />
            Meus grupos
          </Button>
        </Link>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Deseja mesmo sair?</DialogTitle>
            </DialogHeader>

            <DialogFooter className="flex flex-col sm:flex-row gap-4">
              <Button variant="secondary" className="flex-1">
                Continuar por aqui
              </Button>
              <Button variant="destructive" onClick={handleLogout} className="flex-1">
                Sair
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
