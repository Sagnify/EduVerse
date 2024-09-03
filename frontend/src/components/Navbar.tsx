"use client";
import {Plus, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import SearchField from "./searchField";
import Icon from "./Icon";
import { useRouter } from "next/navigation"; // Import useRouter

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter(); // Initialize useRouter

  return (
    <header className="sticky top-0 z-50 flex w-full flex-col items-center justify-center bg-card shadow-sm md:px-12">
      <div className="mx-auto flex w-full items-center justify-between px-9 py-3">
        <div
          onClick={() => router.push("/home")} // Redirect to home page
          className="flex items-center cursor-pointer text-2xl font-bold text-primary"
        >
          <Icon className="" size={30} />
        </div>
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
          {/* <Button className="gap-2 text-lg">
            <Plus />
            <div>
            Ask a Question</div>
          </Button> */}
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
