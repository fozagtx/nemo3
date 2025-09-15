import { useUser } from "@civic/auth/react";
import { LogOut, User, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export function UserMenu() {
  const { user } = useUser();

  const handleLogout = () => {
    // Clear session and redirect to home
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  if (!user) return null;

  // Extract user's name from email or use display name if available
  const getUserDisplayName = () => {
    // Check if user has a name property (with proper type checking)
    const userWithName = user as any;
    if (userWithName.name) return userWithName.name;
    if (userWithName.displayName) return userWithName.displayName;
    if (userWithName.firstName && userWithName.lastName)
      return `${userWithName.firstName} ${userWithName.lastName}`;
    if (userWithName.firstName) return userWithName.firstName;

    // Fall back to extracting name from email
    if (user.email) {
      const emailPrefix = user.email.split("@")[0];
      // Convert email prefix to readable name (remove dots, capitalize)
      return emailPrefix
        .split(/[._-]/)
        .map(
          (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
        )
        .join(" ");
    }

    return "User";
  };

  const displayName = getUserDisplayName();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="bg-gray-50 hover:bg-gray-100 rounded-lg p-2 h-auto flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col items-start text-sm">
            <span className="font-medium text-gray-900 truncate max-w-[120px]">
              {displayName}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
