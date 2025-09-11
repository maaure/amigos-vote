import { CheckCheck } from "lucide-react";

export default function AlreadyVoted() {
  return (
    <section className="text-center space-y-4 mt-[6rem]">
      <div className="flex justify-center items-center gap-2 text-sky-500 font-bold">
        <CheckCheck />
        <p>Você já votou!</p>
      </div>
      <h2 className="text-2xl">Volte amanhã para a próxima pergunta.</h2>
    </section>
  );
}
