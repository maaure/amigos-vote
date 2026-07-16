import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
}

export default function Marquee({ items, className }: MarqueeProps) {
  const loop = [...items, ...items];
  return (
    <div
      className={cn(
        "group relative flex overflow-hidden border-y-2 border-rule bg-rule py-2",
        className
      )}
    >
      <div className="flex shrink-0 animate-marquee items-center gap-8 pr-8 group-hover:[animation-play-state:paused]">
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-8 whitespace-nowrap font-mono text-sm font-bold uppercase tracking-wider text-background"
          >
            <span aria-hidden className="text-highlight-foreground">
              ✦
            </span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
