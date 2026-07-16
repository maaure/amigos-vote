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
import { signOut } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";

export default function HeaderActions() {
  const handleLogout = () => {
    signOut();
    toast("Sessão encerrada", {
      description: "O tribunal se reuniu noutra hora.",
    });
  };

  return (
    <div className="flex gap-2">
      <Link href={"/groups"} className="block">
        <Button variant="outline" size="sm">
          <Users className="size-4" />
          Meus grupos
        </Button>
      </Link>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <LogOut className="size-4" />
            Sair
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="masthead text-2xl">Encerrar a sessão?</DialogTitle>
          </DialogHeader>

          <DialogFooter className="flex flex-col gap-4 sm:flex-row">
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
  );
}
