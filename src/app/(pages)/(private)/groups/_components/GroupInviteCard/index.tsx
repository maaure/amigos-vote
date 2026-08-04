"use client";
import { Button } from "@/components/ui/button";
import Kicker from "@/components/visual/Kicker";
import { Check, Copy, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  accessCode: string;
  groupName: string;
};

export default function GroupInviteCard({ accessCode, groupName }: Props) {
  const [joinUrl, setJoinUrl] = useState("");
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  useEffect(() => {
    setJoinUrl(
      `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/groups/join`
    );
  }, []);

  const buildInviteText = () =>
    [
      "⚖️ CONVOCAÇÃO · Tribunal do Dia",
      "",
      `Tribunal: ${groupName}`,
      `Código de acesso: ${accessCode}`,
      `Entre pelo link: ${joinUrl}`,
    ].join("\n");

  const copy = async (what: "code" | "link") => {
    await navigator.clipboard.writeText(what === "code" ? accessCode : joinUrl);
    setCopied(what);
    setTimeout(() => setCopied(null), 2000);
    toast.success(what === "code" ? "Código copiado" : "Link copiado", {
      description: "Agora é só colar e convocar os réus.",
    });
  };

  const shareInvite = async () => {
    if (!joinUrl) return;
    const text = buildInviteText();
    if (navigator.share) {
      try {
        await navigator.share({ title: "Convite · Tribunal do Dia", text });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    await navigator.clipboard.writeText(text);
    toast.success("Convite copiado", {
      description: "Cole no WhatsApp e os réus entram direto pelo link.",
    });
  };

  return (
    <section className="space-y-3 border-2 border-rule bg-background/40 p-5 text-left">
      <Kicker>Convocação oficial</Kicker>

      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Código de acesso
        </p>
        <div className="flex items-stretch gap-2">
          <div className="flex flex-1 items-center justify-center border-2 border-rule bg-background/50 p-3">
            <span className="font-display text-3xl tracking-[0.3em]">{accessCode}</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            aria-label="Copiar código"
            onClick={() => copy("code")}
          >
            {copied === "code" ? <Check className="size-4" /> : <Copy className="size-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Link do tribunal
        </p>
        <div className="flex items-stretch gap-2">
          <div className="flex flex-1 items-center justify-center border-2 border-rule bg-background/50 p-3">
            {joinUrl ? (
              <span className="break-all font-mono text-xs uppercase tracking-widest">
                {joinUrl}
              </span>
            ) : (
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Gerando link...
              </span>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            aria-label="Copiar link"
            disabled={!joinUrl}
            onClick={() => copy("link")}
          >
            {copied === "link" ? <Check className="size-4" /> : <Copy className="size-4" />}
          </Button>
        </div>
      </div>

      <Button variant="submit" size="lg" className="w-full py-5" onClick={shareInvite} disabled={!joinUrl}>
        <Share2 className="size-4" />
        Convidar réus
      </Button>

      <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
        O convite sai com o código e o link, é só colar no WhatsApp.
      </p>
    </section>
  );
}
