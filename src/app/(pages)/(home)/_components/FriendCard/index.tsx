import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";

interface IFriendCardProps {
  name: string;
  img?: string;
  onClick: () => void;
  selected?: boolean;
  disabled?: boolean;
}

export default function FriendCard({ img, name, onClick, selected = false, disabled = false }: IFriendCardProps) {
  const nameInitials = getInitials(name);

  const containerClasses = cn(
    "border rounded-xl flex flex-col justify-center items-center gap-y-2 p-8 cursor-pointer transition-all",
    {
      "border-4 border-sky-500 bg-sky-100 dark:bg-sky-900/30": selected,
      "opacity-50 cursor-not-allowed pointer-events-none": disabled,
    }
  );

  return (
    <div className={containerClasses} onClick={disabled ? undefined : onClick} aria-disabled={disabled}>
      <Avatar className="w-[4rem] h-[4rem]">
        <AvatarImage src={img} />
        <AvatarFallback>{nameInitials}</AvatarFallback>
      </Avatar>
      <span>{name}</span>
    </div>
  );
}
