import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface IFriendCardProps {
  name: string;
  img?: string;
  onClick: () => void;
  selected?: boolean;
}

export default function FriendCard({ img, name, onClick, selected = false }: IFriendCardProps) {
  const nameInitials = getInitials(name);

  const containerClasses = cn(
    "border rounded-xl flex flex-col justify-center items-center gap-y-2 p-8 cursor-pointer transition-all",
    {
      "border-4 border-sky-500 bg-sky-100 dark:bg-sky-900/30": selected,
    }
  );

  return (
    <div className={containerClasses} onClick={onClick}>
      <Avatar className="w-[4rem] h-[4rem]">
        <AvatarImage src={img} />
        <AvatarFallback>{nameInitials}</AvatarFallback>
      </Avatar>
      <span>{name}</span>
    </div>
  );
}
