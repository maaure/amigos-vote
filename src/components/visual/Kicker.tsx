import { cn } from "@/lib/utils";

interface KickerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Kicker({ children, className }: KickerProps) {
  return (
    <span
      className={cn(
        "font-mono text-[0.7rem] font-bold uppercase tracking-widest text-highlight",
        className
      )}
    >
      {children}
    </span>
  );
}
