"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, LogOut, Calendar, Settings } from "lucide-react";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

// Mock data para grupos
const MOCK_GROUPS = [
  {
    id: "group1",
    name: "Turma da Faculdade",
    description: "Nosso grupo da época da faculdade",
    memberCount: 8,
    code: "FAC2024",
    isActive: true,
    lastActivity: "2 horas atrás",
    members: [
      { name: "João Silva", avatar: "" },
      { name: "Ana Costa", avatar: "" },
      { name: "Pedro Santos", avatar: "" },
    ],
  },
  {
    id: "group2",
    name: "Trabalho",
    description: "Galera do escritório",
    memberCount: 12,
    code: "WORK123",
    isActive: false,
    lastActivity: "1 dia atrás",
    members: [
      { name: "Maria Oliveira", avatar: "" },
      { name: "Carlos Lima", avatar: "" },
      { name: "Fernanda Costa", avatar: "" },
    ],
  },
];

const Groups = () => {
  const [groups, setGroups] = useState(MOCK_GROUPS);

  const { data: session } = useSession();

  const handleLogout = () => {
    signOut();
    toast("Logout realizado", {
      description: "Até logo!",
    });
    redirect("/");
  };

  const handleEnterGroup = (group: any) => {
    localStorage.setItem("selectedGroup", JSON.stringify(group));
    toast.success("Grupo selecionado", {
      description: `Entrando no grupo "${group.name}"`,
    });
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header com informações do usuário */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={session?.user?.image} />
              <AvatarFallback>
                {session?.user?.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Olá, {session?.user?.name?.split(" ")[0]}!</h1>
              <p className="text-muted-foreground">Seus grupos de amigos</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => redirect("/criar-grupo")} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Criar Novo Grupo</span>
          </Button>
          <Button variant="outline" onClick={() => redirect("/entrar-grupo")} className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Entrar em Grupo</span>
          </Button>
        </div>

        {/* Lista de Grupos */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Meus Grupos</h2>

          {groups.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Nenhum grupo ainda</h3>
                <p className="text-muted-foreground mb-6">Crie seu primeiro grupo ou peça para um amigo te convidar!</p>
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
              {groups.map((group) => (
                <Card key={group.id} className="hover:shadow-card transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          {group.isActive && (
                            <Badge variant="default" className="text-xs">
                              Ativo
                            </Badge>
                          )}
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
                          <span>{group.memberCount} membros</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{group.lastActivity}</span>
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs font-mono">
                        {group.code}
                      </Badge>
                    </div>

                    {/* Membros preview */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Membros:</span>
                      <div className="flex -space-x-2">
                        {group.members.slice(0, 3).map((member, index) => (
                          <Avatar key={index} className="w-6 h-6 border-2 border-background">
                            <AvatarFallback className="text-xs">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {group.memberCount > 3 && (
                          <div className="w-6 h-6 bg-muted border-2 border-background rounded-full flex items-center justify-center text-xs">
                            +{group.memberCount - 3}
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleEnterGroup(group)}
                      className="w-full"
                      variant={group.isActive ? "default" : "secondary"}
                    >
                      Entrar no Grupo
                    </Button>
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
