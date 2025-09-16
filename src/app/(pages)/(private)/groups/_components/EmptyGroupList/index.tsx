import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import Link from "next/link";

export default function EmptyGroupList() {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Nenhum grupo ainda</h3>
        <p className="text-muted-foreground mb-6">
          Crie seu primeiro grupo ou peça para um amigo te convidar!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/groups/new" className="block">
            <Button>Criar Grupo</Button>
          </Link>
          <Link href="/groups/join" className="block">
            <Button variant="outline">Entrar em Grupo</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
