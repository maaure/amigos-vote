"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewGroupPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <Link href="/groups" className="block">
          <Button variant="ghost" className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar aos Grupos</span>
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Criar Novo Grupo</CardTitle>
            <CardDescription>Crie um grupo privado para você e seus amigos</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={() => {}} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Grupo*</Label>
                <Input id="name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea id="description" placeholder="Uma breve descrição sobre o grupo..." rows={3} />
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4 text-sm space-y-2">
                <p className="font-medium text-foreground">📝 Sobre grupos privados:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Apenas membros podem ver as perguntas e respostas</li>
                  <li>Você receberá um código para convidar amigos</li>
                </ul>
              </div>

              <Link href="/groups/created?code=CODIGUINHO">
                <Button type="submit" disabled={false} className="w-full">
                  {"Criar Grupo"}
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
