"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useJoinGroupService } from "@/data/hooks/useJoinGroupService";
import { ErrorResponse } from "@/data/types";
import { cn } from "@/lib/utils";
import { GroupSchemaOut, NewGroupResponse } from "@/types/groups";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import PageShell from "@/components/layout/PageShell";
import Kicker from "@/components/visual/Kicker";
import Stamp from "@/components/visual/Stamp";

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
    toast.success("Você entrou no tribunal!");
  }

  function onError(error: ErrorResponse) {
    toast.error(error?.message ?? "Houve um erro ao entrar no grupo.");
  }

  const onSubmit = (data: FormValues) => {
    joinGroup(data.accessCode);
  };

  if (joinedGroup) {
    return (
      <PageShell width="prose" centered>
        <Card className="poster-frame gap-0 bg-paper p-0 py-0">
          <CardContent className="space-y-6 p-8 text-center">
            <div className="mx-auto w-fit">
              <Stamp tone="gold" rotate={-6}>
                Admitido
              </Stamp>
            </div>
            <div className="space-y-2">
              <Kicker>Bem-vindo ao banco dos réus</Kicker>
              <h2 className="masthead text-3xl">{joinedGroup.name}</h2>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {joinedGroup.membersCount} {joinedGroup.membersCount === 1 ? "membro" : "membros"}
              </p>
            </div>

            <div className="border-2 border-dashed border-rule bg-background/40 p-4">
              <p className="font-mono text-xs uppercase leading-relaxed tracking-widest text-muted-foreground">
                Agora você pode participar das acusações diárias e ver quem seus amigos elegem como
                o pior da turma.
              </p>
            </div>

            <div className="space-y-3">
              <Link href={`/groups/${joinedGroup.id}`} className="block">
                <Button className="w-full py-6" size="lg">
                  Ir ao tribunal
                </Button>
              </Link>
              <Link href={`/groups/`} className="block">
                <Button variant="outline" className="w-full">
                  Ver todos os tribunais
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell width="prose" centered>
      <Link href="/groups" className="block w-fit">
        <Button variant="ghost">
          <ArrowLeft className="size-4" />
          Voltar aos grupos
        </Button>
      </Link>

      <div className="space-y-2">
        <Kicker>Convite recebido</Kicker>
        <h1 className="masthead text-4xl">Entrar num tribunal</h1>
        <p className="text-muted-foreground">
          Digite o código de 6 caracteres que seu amigo passou.
        </p>
      </div>

      <Card className="poster-frame gap-0 bg-paper p-0 py-0">
        <CardContent className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="code" className="font-mono text-xs uppercase tracking-widest">
                Código de acesso
              </Label>
              <Input
                id="code"
                placeholder="Ex: FAC2024"
                className={cn(
                  "h-14 rounded-none text-center font-display text-2xl uppercase tracking-[0.4em]",
                  { "border-destructive": !!errors.accessCode }
                )}
                maxLength={10}
                {...register("accessCode")}
              />
              {!!errors.accessCode ? (
                <span className="font-mono text-xs text-destructive">
                  {errors.accessCode.message}
                </span>
              ) : (
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  O código tem exatamente 6 caracteres
                </p>
              )}
            </div>

            <div className="border-2 border-dashed border-rule bg-background/40 p-4 text-sm">
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-highlight">
                Como conseguir um código
              </p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>— Peça a um amigo que já está no tribunal.</li>
                <li>— Quem abre o grupo recebe o código.</li>
                <li>— Cada código é único e permanente.</li>
              </ul>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isPending || !watch("accessCode").trim()}
              className="w-full py-6"
            >
              {isPending ? (
                "Localizando..."
              ) : (
                <>
                  <Check className="size-4" />
                  Entrar no tribunal
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageShell>
  );
}
