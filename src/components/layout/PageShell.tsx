import { cn } from "@/lib/utils";

type Width = "prose" | "default" | "wide";

const WIDTHS: Record<Width, string> = {
  prose: "max-w-md",
  default: "max-w-4xl",
  wide: "max-w-6xl",
};

interface PageShellProps {
  children: React.ReactNode;
  width?: Width;
  className?: string;
  centered?: boolean;
}

export default function PageShell({
  children,
  width = "default",
  className,
  centered = false,
}: PageShellProps) {
  return (
    <div className={cn("min-h-screen w-full px-4 py-8 sm:py-12", className)}>
      <div
        className={cn(
          "mx-auto w-full space-y-8",
          WIDTHS[width],
          centered && "flex min-h-[calc(100vh-4rem)] flex-col justify-center"
        )}
      >
        {children}
      </div>
    </div>
  );
}
