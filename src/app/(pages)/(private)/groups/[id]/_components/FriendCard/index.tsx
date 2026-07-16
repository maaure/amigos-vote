import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";

interface IFriendCardProps {
  name: string;
  img?: string;
  onClick: () => void;
  selected?: boolean;
  disabled?: boolean;
}

export default function FriendCard({
  img,
  name,
  onClick,
  selected = false,
  disabled = false,
}: IFriendCardProps) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      aria-pressed={selected}
      aria-disabled={disabled}
      className={cn(
        "group relative flex flex-col items-center gap-3 border-2 border-rule bg-paper p-5 text-center transition-all duration-200",
        "hover:-translate-y-1 hover:shadow-[4px_4px_0_0_var(--rule)]",
        selected &&
          "-translate-y-1 border-highlight bg-highlight/10 shadow-[4px_4px_0_0_var(--highlight)]",
        disabled && "cursor-not-allowed opacity-40 hover:translate-y-0 hover:shadow-none"
      )}
    >
      {selected && (
        <span className="stamp animate-stamp absolute right-1 top-1 z-10 px-1.5 py-0.5 text-[0.6rem]">
          Acusado
        </span>
      )}

      <Avatar
        className={cn(
          "size-16 rounded-none border-2 border-rule grayscale transition-all group-hover:grayscale-0",
          selected && "border-highlight grayscale-0"
        )}
      >
        <AvatarImage src={img} />
        <AvatarFallback className="rounded-none bg-secondary font-display text-lg">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>

      <span className="line-clamp-2 font-mono text-xs uppercase leading-tight tracking-wide">
        {name}
      </span>
    </button>
  );
}
