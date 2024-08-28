"use client";
import Link from "next/link";
import { SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import UserButton from "./UserButton";
import SearchField from "./searchField";
import Icon from "./Icon";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex w-full flex-col items-center justify-center bg-card shadow-sm md:px-12">
      <div className="mx-auto flex w-full items-center justify-between px-9 py-3">
        <Link
          href="/"
          className="flex items-center text-2xl font-bold text-primary"
        >
          <Icon className="" size={30} />
        </Link>
        <div className="flex items-center gap-4">
          <Button
            className="block xl:hidden"
            variant="ghost"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <SearchIcon className="size-7 cursor-pointer text-muted-foreground" />
          </Button>
          <div className="hidden xl:block">
            <SearchField />
          </div>
          <div className="flex gap-1 items-center">
            <Link href={`/`}>
              <Button variant="ghost" className="px-2">
                Home
              </Button>
            </Link>
            <Link href={`/library`}>
              <Button variant="ghost" className="px-2">
                Library
              </Button>
            </Link>
            <Link href={`/lectures`}>
              <Button variant="ghost" className="px-2">
                Lectures
              </Button>
            </Link>
            <Button variant="ghost" className="px-2">
              <UserButton />
            </Button>
          </div>
        </div>
      </div>

      <div className="">
        {isSearchOpen && (
          <div className="w-full mb-3">
            <SearchField beautify />
          </div>
        )}
      </div>
    </header>
  );
}
