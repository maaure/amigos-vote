import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Github, MessageCircle, Sparkles, Users, Heart } from "lucide-react";
import GitHubLoginButton from "./_components/GithubLoginButton";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-background px-4 py-8 flex flex-col">
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <Sparkles className="w-12 h-12 text-primary" />
              <h1 className="text-5xl font-bold text-foreground">Inimigo do Dia</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Responda perguntas capciosas e descubra o que seus amigos pensam sobre você. Crie grupos privados e
              divirta-se com uma nova pergunta todo dia!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Grupos Privados</CardTitle>
                <CardDescription>Crie grupos com seus amigos e mantenham suas respostas entre vocês</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MessageCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Perguntas Diárias</CardTitle>
                <CardDescription>Uma nova pergunta capciosa todo dia para animar o grupo</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Sparkles className="w-12 h-12 text-pink-700 mx-auto mb-4" />
                <CardTitle>Novas perguntas</CardTitle>
                <CardDescription>Cadastre novas perguntas ou use uma do banco de questões</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-foreground">Pronto para começar?</h2>
              <p className="text-muted-foreground">
                Entre com sua conta do GitHub e comece a se divertir com seus amigos!
              </p>
            </div>

            <GitHubLoginButton />
          </div>
        </div>
      </main>

      <footer className="w-full max-w-4xl mx-auto border-t border-border pt-8 mt-16 text-center">
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-foreground">Sobre o Projeto</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            <strong>Inimigo do Dia</strong> é um projeto de código aberto criado para estudo e, claro, para diversão.
            Sinta-se à vontade para explorar o código, contribuir ou criar sua própria versão.
          </p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="w-4 h-4 text-red-500" />
              <span>
                Feito por{" "}
                <a
                  href="https://github.com/maaure"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  Maure
                </a>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Github className="w-4 h-4" />
              <a
                href="https://github.com/maaure/amigos-vote"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                Código Fonte
              </a>
            </div>
          </div>
          <p className="text-xs text-muted-foreground pt-6">
            Lembre-se: é apenas uma brincadeira para se divertir com os amigos!
          </p>
        </div>
      </footer>
    </div>
  );
}
