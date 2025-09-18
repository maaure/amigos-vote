"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useJoinGroupService } from "@/data/hooks/useJoinGroupService";
import { ErrorResponse } from "@/data/types";
import { cn } from "@/lib/utils";
import { GroupSchemaOut, NewGroupResponse } from "@/types/groups";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const schema = z.object({
  accessCode: z.string().length(6, "O código de acesso deve ter exatamente 6 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export default function JoinGroup() {
  const [joinedGroup, setJoinedGroup] = useState<GroupSchemaOut>();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { accessCode: "" },
  });

  const { mutate: joinGroup, isPending } = useJoinGroupService(onSuccess, onError);

  function onSuccess(joinedGroup: NewGroupResponse) {
    setJoinedGroup(joinedGroup.data);
    toast.success("Você juntou-se ao grupo com sucesso!");
  }

  function onError(error: ErrorResponse) {
    toast.error(error?.message ?? "Houve um erro ao juntar-se ao grupo.");
  }

  const onSubmit = (data: FormValues) => {
    joinGroup(data.accessCode);
  };

  if (joinedGroup) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 flex items-center justify-center">
        <div className="max-w-md w-full space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Bem-vindo!</CardTitle>
              <CardDescription>Você agora faz parte do grupo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-3">
                <h3 className="text-xl font-semibold text-foreground">{joinedGroup.name}</h3>
                <p className="text-muted-foreground">{joinedGroup.membersCount} membros</p>
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <p className="text-sm text-accent-foreground">
                    🎉 Agora você pode participar das perguntas diárias e ver o que seus amigos
                    pensam uns dos outros!
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Link href={`/groups/${joinedGroup.id}`} className="block">
                  <Button className="w-full">Ir para o Grupo</Button>
                </Link>
                <Link href={`/groups/`} className="block">
                  <Button variant="outline" className="w-full">
                    Ver Todos os Grupos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <Link className="block" href={"/groups"}>
          <Button variant="ghost" className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar aos Grupos</span>
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Entrar em Grupo</CardTitle>
            <CardDescription>Use o código que seu amigo compartilhou com você</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="code">Código do Grupo</Label>
                <Input
                  id="code"
                  placeholder="Ex: FAC2024"
                  className={cn("text-center text-lg font-mono tracking-wider", {
                    "border-destructive": !!errors.accessCode,
                  })}
                  maxLength={10}
                  {...register("accessCode")}
                />
                {!!errors.accessCode ? (
                  <span className="text-red-500 text-xs">{errors.accessCode.message}</span>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    O código tem exatamente 6 caracteres
                  </p>
                )}
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4 text-sm space-y-2">
                <p className="font-medium text-foreground flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Como conseguir um código:</span>
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Peça para um amigo que já está no grupo</li>
                  <li>O criador do grupo tem o código</li>
                  <li>Códigos são únicos para cada grupo</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={isPending || !watch("accessCode").trim()}
                className="w-full"
              >
                {isPending ? "Procurando Grupo..." : "Entrar no Grupo"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
