"use client";
import { Hammer } from "lucide-react";
import Image from "next/image";

interface IconProps {
  className?: string;
  size?: number;
}

export default function Icon({ className, size = 30 }: IconProps) {
  const textSize = size; // Adjust the text size relative to the icon size
  const betaSize = textSize / 2; // Adjust the "beta" size relative to the text size

  return (
    <header className="sticky top-0 z-50 flex items-center">
      <div className="">
        <div className="flex items-center gap-2">
          <Image
            src={`/icon.png`}
            alt={"icon"}
            width="40"
            height="40"
            className="rounded-full bg-white p-1"
          />
          <div className="flex">
            <h1 className="text-lg md:text-3xl">EduVerse</h1>
            <h1
              className="hidden md:block"
              style={{ fontSize: `${betaSize}px` }}
            >
              beta
            </h1>
            <Hammer size={betaSize} className="block md:hidden" />
          </div>
        </div>
      </div>
    </header>
  );
}
