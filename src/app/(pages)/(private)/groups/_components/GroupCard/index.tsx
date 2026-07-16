import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GroupSchemaOut } from "@/types/groups";
import { Settings, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface IGroupCardProps {
  group: GroupSchemaOut;
}

export default function GroupCard({ group }: IGroupCardProps) {
  return (
    <Card className="poster-frame gap-0 overflow-hidden bg-paper p-0 py-0 transition-transform hover:-translate-y-1">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="masthead text-2xl leading-none">{group.name}</h3>
            {group.description && (
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                {group.description}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toast("Configurações", { description: "Em desenvolvimento..." });
            }}
          >
            <Settings className="size-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between border-y border-rule py-3 font-mono text-xs uppercase tracking-widest">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Users className="size-4" />
            {group.membersCount} réus
          </span>
          <Badge variant="outline" className="border-rule font-mono tracking-widest">
            {group.accessCode}
          </Badge>
        </div>

        <Link href={`/groups/${group.id}`} className="block">
          <Button variant="secondary" className="w-full">
            Abrir sessão
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
