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
              {user.email || "User"}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Account</p>
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
