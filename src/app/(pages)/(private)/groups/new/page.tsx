"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useNewGroupService } from "@/data/hooks/useNewGroupService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { NewGroupResponse } from "@/types/groups";

const schema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(50, "Máximo de 50 caracteres"),
  description: z.string().max(200, "Máximo de 200 caracteres").optional(),
});

type FormValues = z.infer<typeof schema>;

export default function NewGroupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
  });

  const { mutate: createNewGroup, isPending } = useNewGroupService(onSuccess, onError);

  const router = useRouter();

  function onSuccess(newGroup: NewGroupResponse) {
    toast.success("Grupo criado com sucesso!");
    router.push(
      `/groups/created?accessCode=${newGroup.data.accessCode}&groupName=${newGroup.data.name}`
    );
  }

  function onError() {
    toast.error("Houve um erro ao criar o grupo, tente novamente mais tarde.");
  }

  const onSubmit = (data: FormValues) => {
    createNewGroup(data);
  };

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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Grupo*</Label>
                <Input
                  id="name"
                  {...register("name")}
                  className={cn({ "border-destructive": !!errors.name })}
                />
                {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Uma breve descrição sobre o grupo..."
                  rows={3}
                />
                {errors.description && (
                  <span className="text-red-500 text-xs">{errors.description.message}</span>
                )}
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4 text-sm space-y-2">
                <p className="font-medium text-foreground">📝 Sobre grupos privados:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Apenas membros podem ver as perguntas e respostas</li>
                  <li>Você receberá um código para convidar amigos</li>
                </ul>
              </div>

              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Criando..." : "Criar Grupo"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
