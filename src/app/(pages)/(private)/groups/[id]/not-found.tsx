import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, Users } from "lucide-react";
import Link from "next/link";

export default async function NotFound() {
  return (
    <div className="min-h-screen bg-background px-4 py-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Grupo não encontrado</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar este grupo ou ele não existe.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-md text-muted-foreground">Isso pode acontecer se:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Você não é membro deste grupo</li>
              <li>• O grupo foi removido</li>
              <li>• O link está incorreto</li>
            </ul>
            <div className="flex flex-col gap-3 pt-4">
              <Link href="/groups" className="w-full">
                <Button className="w-full" variant="default">
                  <Users className="w-4 h-4 mr-2" />
                  Ver Meus Grupos
                </Button>
              </Link>
              <Link href="/" className="w-full">
                <Button className="w-full" variant="outline">
                  <Home className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
