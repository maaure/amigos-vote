import { Github, MessageCircle, Gavel, Users, ScrollText, Heart } from "lucide-react";
import Link from "next/link";
import GitHubLoginButton from "./_components/GithubLoginButton";
import Marquee from "@/components/visual/Marquee";
import Stamp from "@/components/visual/Stamp";
import Kicker from "@/components/visual/Kicker";

const ACCUSATIONS = [
  "Quem sumiria do grupo sem avisar?",
  "Quem tem mais chance de ser preso por engano?",
  "Quem mente sobre ter chegado em casa?",
  "Quem fala ' tô chegando' mas ainda tá no chuveiro?",
  "Quem foi o culpado pela última budega?",
];

const STEPS = [
  {
    n: "01",
    icon: Users,
    title: "Abra o tribunal",
    body: "Crie um grupo privado e convide a turma pelo código de acesso. Só quem entra vê o que rola dentro.",
  },
  {
    n: "02",
    icon: ScrollText,
    title: "Leia a acusação",
    body: "Todo dia entra uma pergunta capciosa no banco dos réus. Cada um vota, em segredo, em quem melhor se encaixa.",
  },
  {
    n: "03",
    icon: Gavel,
    title: "Proclame o veredito",
    body: "Meia-noite o julgamento fecha. O mais votado leva o título de Culpado do Dia. Arquive e repita.",
  },
];

export default function Welcome() {
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex min-h-screen flex-col">
      {/* === MASTHEAD === */}
      <header className="reveal px-4 pt-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between border-y-2 border-rule py-2 font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground">
            <span>Ano • Edição Diária</span>
            <span className="hidden sm:inline">Tribunal dos Amigos™</span>
            <span>{today}</span>
          </div>

          <h1 className="masthead mt-3 text-center text-[18vw] leading-[0.82] sm:text-[12rem]">
            Tribunal
            <br />
            do&nbsp;Dia<span className="text-highlight">.</span>
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <span className="h-[3px] flex-1 bg-rule" />
            <span className="font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground">
              Não leve pro lado — leve pro tribunal
            </span>
            <span className="h-[3px] flex-1 bg-rule" />
          </div>
        </div>
      </header>

      <Marquee items={ACCUSATIONS} className="reveal mt-6" />

      {/* === HERO / ACUSAÇÃO === */}
      <main className="flex-grow px-4 py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="reveal space-y-7" style={{ animationDelay: "60ms" }}>
            <Kicker>Acusação do dia</Kicker>
            <p className="masthead text-balance text-4xl leading-[0.95] sm:text-5xl">
              Reúna a turma, leia a acusação e descubra quem seus amigos realmente acham que é{" "}
              <span className="text-highlight">o pior</span>.
            </p>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              Perguntas capciosas todo dia. Voto secreto. Um veredito implacável ao meio-dia. É só
              uma brincadeira — mas ser eleito o <em>Culpado do Dia</em> dói de verdade.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <GitHubLoginButton />
            </div>
          </section>

          {/* Poster do procurado */}
          <section
            className="reveal poster-frame relative bg-paper p-8 paper-grain"
            style={{ animationDelay: "140ms" }}
          >
            <div className="halftone pointer-events-none absolute inset-0 opacity-[0.07]" />
            <div className="relative space-y-5 text-center">
              <div className="mx-auto w-fit">
                <Stamp tone="highlight" rotate={-9}>
                  Procurado
                </Stamp>
              </div>
              <p className="font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground">
                Sessão do júri — caso nº&nbsp;diário
              </p>
              <p className="masthead text-2xl leading-tight text-foreground">
                “Quem sumiria do grupo sem avisar?”
              </p>
              <div className="mx-auto my-4 flex w-28 items-center gap-2">
                <span className="h-px flex-1 bg-rule" />
                <Gavel className="size-4 text-highlight" />
                <span className="h-px flex-1 bg-rule" />
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs uppercase">
                {["Voto secreto", "1 por dia", "Sem recurso"].map((b) => (
                  <span
                    key={b}
                    className="border border-rule bg-background/40 px-2 py-3 tracking-wider text-muted-foreground"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* === COMO FUNCIONA — colunas de jornal === */}
      <section className="border-t-2 border-rule bg-paper px-4 py-16 paper-grain">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <Kicker>Como funciona o julgamento</Kicker>
            <h2 className="masthead mt-2 text-4xl sm:text-5xl">Três etapas. Zero escapatória.</h2>
          </div>

          <div className="grid gap-px overflow-hidden border-2 border-rule bg-rule sm:grid-cols-3">
            {STEPS.map(({ n, icon: Icon, title, body }) => (
              <article key={n} className="bg-paper p-8 transition-colors hover:bg-accent/60">
                <div className="flex items-center justify-between">
                  <span className="masthead text-5xl text-highlight">{n}</span>
                  <Icon className="size-7 text-rule" strokeWidth={1.5} />
                </div>
                <h3 className="masthead mt-6 text-xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* === RODAPÉ === */}
      <footer className="border-t-2 border-rule px-4 py-12">
        <div className="mx-auto max-w-6xl space-y-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <MessageCircle className="size-5 text-highlight" />
            <h3 className="masthead text-3xl">Sobre a publicação</h3>
          </div>
          <p className="mx-auto max-w-2xl text-balance leading-relaxed text-muted-foreground">
            <strong>Tribunal do Dia</strong> é um projeto de código aberto, feito pra estudo e pra
            zoeira. Não há propósito produtivo aqui — só o sagrado dever de eleger, diariamente, o
            amigo mais suspeito da turma.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 font-mono text-xs uppercase tracking-widest">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Heart className="size-4 text-highlight" />
              Publicado por{" "}
              <Link
                href="https://github.com/maaure"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-foreground underline-offset-4 hover:underline"
              >
                Maure
              </Link>
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <Github className="size-4" />
              <Link
                href="https://github.com/maaure/amigos-vote"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-foreground underline-offset-4 hover:underline"
              >
                Código-fonte
              </Link>
            </span>
          </div>

          <p className="mx-auto mt-6 w-fit border-2 border-highlight px-4 py-2 font-mono text-xs uppercase tracking-widest text-highlight">
            Aviso editorial: é só brincadeira entre amigos.
          </p>
        </div>
      </footer>
    </div>
  );
}
