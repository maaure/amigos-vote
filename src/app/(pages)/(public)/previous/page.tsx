import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import QuestionsList from "./_components/questionsList";

export default function Previous() {
  return (
    <div className="max-w-4xl m-auto space-y-8">
      <header className="w-full relative flex justify-center items-center p-4">
        <Link href={"/"} className="absolute left-4">
          <ArrowLeft />
        </Link>

        <div className="flex items-center justify-center gap-4 text-sky-500">
          <Calendar />
          <h1 className="text-4xl text-center font-bold">Resultados anteriores</h1>
        </div>
      </header>

      <QuestionsList />
    </div>
  );
}
