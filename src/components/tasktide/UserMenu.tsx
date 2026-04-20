import { LogOut, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Props {
  email?: string;
  onSignOut: () => void;
}

export const UserMenu = ({ email, onSignOut }: Props) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-tide text-primary-foreground">
          <UserIcon className="h-4 w-4" />
        </div>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">
        {email ?? "Signed in"}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={onSignOut} className="cursor-pointer">
        <LogOut className="mr-2 h-4 w-4" />
        Sign out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
