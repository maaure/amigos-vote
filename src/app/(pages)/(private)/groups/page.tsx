"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Settings } from "lucide-react";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "./[id]/_components/Header";
import { useGetGroupsQuery } from "@/data/hooks/useGetGroupsQuery";

const Groups = () => {
  const { data, isPending } = useGetGroupsQuery();

  console.log(data);
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Header />

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/groups/new" className="block">
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Criar Novo Grupo</span>
            </Button>
          </Link>
          <Link href="/groups/join" className="block">
            <Button
              variant="outline"
              onClick={() => redirect("/entrar-grupo")}
              className="flex items-center space-x-2"
            >
              <Users className="w-4 h-4" />
              <span>Entrar em Grupo</span>
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Meus Grupos</h2>

          {data?.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Nenhum grupo ainda</h3>
                <p className="text-muted-foreground mb-6">
                  Crie seu primeiro grupo ou peça para um amigo te convidar!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => redirect("/criar-grupo")}>Criar Grupo</Button>
                  <Button variant="outline" onClick={() => redirect("/entrar-grupo")}>
                    Entrar em Grupo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {data?.map((group) => (
                <Card key={group.id} className="hover:shadow-card transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                        </div>
                        <CardDescription>{group.description}</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          toast("Configurações", {
                            description: "Em desenvolvimento...",
                          });
                        }}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{group.membersCount} membros</span>
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs ">
                        {group.accessCode}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Membros:</span>
                    </div>
                    <Link href={`/groups/${group.id}`} className="block">
                      <Button className="w-full" variant={"default"}>
                        Acessar Grupo
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Groups;
