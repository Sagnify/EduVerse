// pages/index.js
"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Moon, Sun } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";

const HomePage = () => {
  const { setTheme, resolvedTheme } = useTheme();
  return (
    <>
      <div className="flex w-full h-full text-white flex-col justify-center bg-gradient-to-r from-violet-700 to-pink-200">
        <header className="sticky top-0 text-foreground z-50 flex w-full flex-col items-center justify-center md:px-12">
          <div className="mx-auto flex w-full items-center justify-between px-9 py-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="shadow-2xl">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <p className="font-bold text-xl text-center py-3">EduVerse</p>
        <h1 className="font-bold text-9xl text-center">
          The best place to <span className="text-red-500">learn</span>!
        </h1>
        <div className="px-20 -translate-y-6">
          <Image
            src={`/images/${
              resolvedTheme == "dark" ? `dark.png` : `light.png`
            }`}
            width={10000}
            height={200}
            alt="dark"
            className="shadow-2xl"
          />
        </div>
        <div>
          <p className="font-bold  flex items-center justify-center flex-col gap-3 text-2xl text-center">
            Join us now to start learning
            <Button className="bg-white text-black hover:bg-gray-100 transition-colors duration-150">
              <Link href="/login" className="font-bold text-2xl">
                Login
              </Link>
            </Button>
          </p>

          <ul className=" p-3 font-bold text-center">
            <li className="py-1 ">
              <Card className="py-7 px-3 bg-card rounded-xl">
                With a specialized Social Media like platform, we provide you
                with the best learning experience.
              </Card>
            </li>
            <li className="py-1 ">
              <Card className="py-7 px-3 bg-card rounded-xl">
                We provide you with the best courses and the best teachers to
                teach you.
              </Card>
            </li>
            <li className="py-1 ">
              <Card className="py-7 px-3 bg-card rounded-xl">
                We provide you with the best learning experience with the best
                community.
              </Card>
            </li>
            <li className="py-1 ">
              <Card className="py-7 px-3 bg-card rounded-xl">
                We have a state of the art platform that provides you with the
                best learning experience, by integrating a close teacher and
                student relationship.
              </Card>
            </li>
          </ul>
          <div className="text-center font-bold text-5xl py-6">
            Are you still waiting?
          </div>
          <Button className="flex justify-center bg-white text-black hover:bg-gray-100 transition-colors duration-150 w-full rounded-none">
            <Link href="/login" className="font-bold text-2xl">
              Login
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default HomePage;
