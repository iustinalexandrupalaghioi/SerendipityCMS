import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router";
import userImage from "@/assets/user.webp";
import { LogoutButton } from "../authentication/LogoutButton";
import { useAuth } from "@/contexts/AuthContext";

const UserMenu = () => {
  const { user } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={user?.avatar_url || userImage}
            alt={`Profile image of user ${user?.email}`}
          />
          <AvatarFallback>{user?.email}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="md:me-20 z-100">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="/profile">
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="h-8">
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
