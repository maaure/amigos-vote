import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { GroupSchemaOut } from "@/types/groups";
import { Settings, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface IGroupCardProps {
  group: GroupSchemaOut;
}

export default function GroupCard({ group }: IGroupCardProps) {
  return (
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

        <Link href={`/groups/${group.id}`} className="block">
          <Button className="w-full" variant={"secondary"}>
            Acessar Grupo
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
