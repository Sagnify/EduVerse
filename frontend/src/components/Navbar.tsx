"use client";
import {Languages, Plus, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import SearchField from "./searchField";
import Icon from "./Icon";
import { useRouter } from "next/navigation"; // Import useRouter
import UserButton from "./UserButton";

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
        <div className="flex items-center gap-1">
          <Button
            className="xl:hidden flex item-center gap-3"
            variant="ghost"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <div className="text-xl">search</div>
            <SearchIcon className="size-7 cursor-pointer text-muted-foreground" />
          </Button>
          <div className="hidden xl:block">
            <SearchField />
          </div>
          <Button variant="ghost" className="flex flex-col items-center">
            <UserButton />
          </Button>
          <Button
            variant="ghost"
            className="flex gap-2 items-center"
            onClick={() => router.push("/translate")} // Redirect to translate page
          >
            <Languages />
            translate
          </Button>
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
