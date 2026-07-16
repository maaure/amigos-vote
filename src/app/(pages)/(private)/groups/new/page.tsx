"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import PageShell from "@/components/layout/PageShell";
import Kicker from "@/components/visual/Kicker";

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
    toast.success("Tribunal aberto!");
    router.push(
      `/groups/created?accessCode=${newGroup.data.accessCode}&groupName=${newGroup.data.name}`
    );
  }

  function onError() {
    toast.error("Houve um erro ao abrir o tribunal, tente novamente mais tarde.");
  }

  const onSubmit = (data: FormValues) => {
    createNewGroup(data);
  };

  return (
    <PageShell width="prose" centered>
      <Link href="/groups" className="block w-fit">
        <Button variant="ghost">
          <ArrowLeft className="size-4" />
          Voltar aos grupos
        </Button>
      </Link>

      <div className="space-y-2">
        <Kicker>Petição inicial</Kicker>
        <h1 className="masthead text-4xl">Abrir novo tribunal</h1>
        <p className="text-muted-foreground">Crie um espaço privado pra julgar a turma em paz.</p>
      </div>

      <Card className="poster-frame gap-0 bg-paper p-0 py-0">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-mono text-xs uppercase tracking-widest">
                Nome do tribunal *
              </Label>
              <Input
                id="name"
                {...register("name")}
                className={cn("h-11 rounded-none font-display text-lg", {
                  "border-destructive": !!errors.name,
                })}
              />
              {errors.name && (
                <span className="font-mono text-xs text-destructive">{errors.name.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-mono text-xs uppercase tracking-widest">
                Tese da acusação (opcional)
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Uma breve descrição sobre o grupo..."
                rows={3}
                className="rounded-none"
              />
              {errors.description && (
                <span className="font-mono text-xs text-destructive">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="border-2 border-dashed border-rule bg-background/40 p-4 text-sm">
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-highlight">
                Regras do tribunal
              </p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>— Só membros veem as acusações e os vereditos.</li>
                <li>— Você recebe um código de 6 caracteres para chamar os réus.</li>
              </ul>
            </div>

            <Button type="submit" size="lg" disabled={isPending} className="w-full py-6">
              {isPending ? "Abrindo..." : "Abrir tribunal"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageShell>
  );
}
