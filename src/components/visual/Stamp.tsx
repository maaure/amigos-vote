import { cn } from "@/lib/utils";

type StampTone = "highlight" | "gold" | "ink";

const TONES: Record<StampTone, string> = {
  highlight:
    "text-highlight border-highlight shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--highlight)_40%,transparent)]",
  gold: "text-gold border-gold shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--gold)_40%,transparent)]",
  ink: "text-foreground border-foreground shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_30%,transparent)]",
};

interface StampProps {
  children: React.ReactNode;
  tone?: StampTone;
  rotate?: number;
  className?: string;
  animate?: boolean;
}

export default function Stamp({
  children,
  tone = "highlight",
  rotate = -7,
  className,
  animate = true,
}: StampProps) {
  return (
    <span
      className={cn(
        "stamp inline-flex select-none items-center text-sm font-bold leading-none",
        TONES[tone],
        animate && "animate-stamp",
        className
      )}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}
