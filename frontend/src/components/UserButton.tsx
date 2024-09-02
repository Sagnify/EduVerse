"use client";

import { cn } from "@/lib/utils";
import { Check, LogOutIcon, Monitor, Moon, Sun, UserIcon } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "next-themes";
import useUserFetcher from "@/core/userFetcher";
import Loading from "./Loader";
import { useRouter } from "next/navigation";

interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const { user, loading, error } = useUserFetcher();
  const { theme, setTheme } = useTheme();
  const router = useRouter(); // Initialize router

  const logout = () => {
    // Remove token from local storage
    localStorage.removeItem("token");

    // Redirect to homepage
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className={cn("flex-none rounded-full", className)}>
          {loading ? <Loading /> : user ? user.username : "User"}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {!loading && !error && user ? (
          <>
            <DropdownMenuLabel>Hello {user.username}!</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={`/user/${user.username}`}>
              <DropdownMenuItem>
                <UserIcon className="mr-2 size-4" />
                Profile
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Monitor className="mr-2 size-4" />
                Theme
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 size-4" />
                    System
                    {theme === "system" && <Check className="ms-2 size-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 size-4" />
                    Light
                    {theme === "light" && <Check className="ms-2 size-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 size-4" />
                    Dark
                    {theme === "dark" && <Check className="ms-2 size-4" />}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOutIcon className="mr-2 size-4" />
              Logout
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuLabel>
            {error ? `Error: ${error}` : "Not logged in"}
          </DropdownMenuLabel>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
