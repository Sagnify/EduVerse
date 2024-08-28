"use client";
import { Hammer, Heart } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

interface IconProps {
  className?: string;
  size?: number;
}

export default function Icon({ className, size = 30 }: IconProps) {
  const theme = useTheme().resolvedTheme;
  const textSize = size; // Adjust the text size relative to the icon size
  const betaSize = textSize / 2; // Adjust the "beta" size relative to the text size

  return (
    <header className="sticky top-0 z-50 flex items-center">
      <div className="">
        <div className="flex items-center gap-2">
          <Image src={`/icon.png`} alt={"icon"} width="35" height="35" />
          <div className="flex">
            <h1 className="" style={{ fontSize: `${textSize}px` }}>
              EduVerse
            </h1>
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
