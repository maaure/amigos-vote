import Stamp from "@/components/visual/Stamp";

export default function AlreadyVoted() {
  return (
    <section className="poster-frame relative mt-12 overflow-hidden bg-paper px-6 py-16 text-center paper-grain">
      <div className="halftone pointer-events-none absolute inset-0 opacity-10" />
      <div className="relative space-y-6">
        <div className="mx-auto w-fit">
          <Stamp tone="highlight" rotate={-8}>
            Veredito lacrado
          </Stamp>
        </div>
        <h2 className="masthead text-balance text-3xl leading-tight sm:text-4xl">
          Você cumpriu seu dever de jurado.
        </h2>
        <p className="mx-auto max-w-md font-mono text-sm uppercase leading-relaxed tracking-widest text-muted-foreground">
          Volte amanhã para a próxima sessão do tribunal.
        </p>
      </div>
    </section>
  );
}
