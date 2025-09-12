"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Check, Copy, Users } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function GroupCreated() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "";

  const [copied, setCopied] = useState(false);

  const copyGroupCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Código copiado", {
        description: "O código do grupo foi copiado para a área de transferência.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Erro ao copiar", {
        description: "Não foi possível copiar o código.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Grupo Criado!</CardTitle>
            <CardDescription>Compartilhe o código abaixo com seus amigos para eles entrarem no grupo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div>
                <Label className="text-sm font-medium">Nome do Grupo</Label>
                <p className="text-lg font-semibold text-foreground">Ladeiros</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Código de Acesso</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex-1 p-3 bg-muted rounded-lg text-center">
                    <span className="text-2xl font-bold tracking-wider">{code}</span>
                  </div>
                  <Button variant="outline" onClick={copyGroupCode} className="flex items-center space-x-1">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-sm">
              <p className="text-accent-foreground">
                <strong>Como convidar amigos:</strong>
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Copie o código acima</li>
                <li>Envie para seus amigos</li>
                <li>{`Eles devem usar o código na opção "Entrar em Grupo"`}</li>
              </ol>
            </div>

            <div className="space-y-3">
              <Link href="/groups" className="block">
                <Button className="w-full">Ver Meus Grupos</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
