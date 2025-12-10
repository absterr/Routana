import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth/auth-client";
import { useAuth } from "@/lib/auth/useAuth";
import { useTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UserNav = () => {
  const [pending, startTransition] = useTransition();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    const logout = toast.loading("Logging out...");
    startTransition(async () => {
      await signOut({
        fetchOptions: {
          onSuccess: async () => {
            navigate("/login", { replace: true });
            toast.dismiss(logout);
          },
          onError: () => {
            toast.dismiss(logout);
            toast.error("Couldn't log out, please try again.");
          }
        },
      });
    });
  }

if (!user) {
  return null;
}

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.image ?? user.name} alt="user-image" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{user.name}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
          </DropdownMenuItem>
          <Link to={"/billing"}>
            <DropdownMenuItem>
              Billing
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem>
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={pending} onClick={handleLogOut}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserNav;
