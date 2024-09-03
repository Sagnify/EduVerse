// Leftbar.js
import Link from "next/link";
import { Bell, House, LibraryBig, SquarePlay, User } from "lucide-react";
import { Button } from "./ui/button";
import UserButton from "./UserButton";

export default function Leftbar() {
  return (
    <div className="flex flex-col gap-4 w-72 ">
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
      <Button variant="ghost" className="w-full px-2 gap-2 justify-normal">
        <User />
        <UserButton />
      </Button>
    </div>
  );
}
