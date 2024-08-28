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
import { useEffect, useState } from "react";
import logout from "@/app/(auth)/logout";
import { fetchUserData } from "@/core/user";
import Loading from "./Loader";

interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      fetchUserData(userId)
        .then((data) => {
          if (data) {
            setUser(data);
          } else {
            setError("User not found");
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch user data");
          setLoading(false);
        });
    } else {
      setError("userId not found in localStorage");
      setLoading(false);
    }
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className={cn("flex-none rounded-full", className)}>
          {loading ? <Loading/> : user ? user.username : "User"}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {!loading && !error && user ? (
          <>
            <DropdownMenuLabel>Hello {user.username}!</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={`/users/${user.username}`}>
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
            <DropdownMenuItem
              onClick={() => {
                logout();
              }}
            >
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
