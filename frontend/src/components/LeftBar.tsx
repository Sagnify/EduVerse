// Leftbar.js
import Link from "next/link";
import { Bell, House, LibraryBig, Plus, SquarePlay, User } from "lucide-react";
import { Button } from "./ui/button";

export default function Leftbar() {
  return (
    <>
      {/* Desktop/Tablet Navigation (Left sidebar) */}
      <div className="hidden md:flex flex-col gap-4 w-72 ">
        <Link href={`/new`}>
          <Button className="gap-2 text-xs">
            <Plus size={20} />
            Ask a Question
          </Button>
        </Link>
        <Link href={`/home`}>
          <Button variant="ghost" className="w-full px-2 gap-2 justify-normal">
            <House />
            Home
          </Button>
        </Link>
        <Link href={`/library`}>
          <Button variant="ghost" className="w-full px-2 gap-2 justify-normal">
            <LibraryBig />
            Library
          </Button>
        </Link>
        <Link href={`/lectures`}>
          <Button variant="ghost" className="w-full px-2 gap-2 justify-normal">
            <SquarePlay />
            Lectures
          </Button>
        </Link>
        <Link href={`/notifications`}>
          <Button variant="ghost" className="w-full px-2 gap-2 justify-normal">
            <Bell /> Notifications
          </Button>
        </Link>
      </div>

      {/* Mobile Navigation (Bottom bar) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-background shadow-md flex justify-around p-2">
        <Link href={`/home`}>
          <Button variant="ghost" className="flex flex-col items-center">
            <House />
          </Button>
        </Link>
        <Link href={`/library`}>
          <Button variant="ghost" className="flex flex-col items-center">
            <LibraryBig />
          </Button>
        </Link>
        <Link href={`/new`}>
          <Button className="gap-2 text-xs">
            <Plus size={20} />
          </Button>
        </Link>
        <Link href={`/lectures`}>
          <Button variant="ghost" className="flex flex-col items-center">
            <SquarePlay />
          </Button>
        </Link>
        <Link href={`/notifications`}>
          <Button variant="ghost" className="flex flex-col items-center">
            <Bell />
          </Button>
        </Link>
      </div>
    </>
  );
}
