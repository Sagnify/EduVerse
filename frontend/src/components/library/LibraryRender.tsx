"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { formatReletiveDate } from "@/lib/utils";
import {CircleCheckBig} from "lucide-react";
import { Card } from "../ui/card";

const Library: React.FC<LibraryProps> = ({ library }) => {
  const router = useRouter();

  const handlePostClick = () => {
    router.push(`/library/${library.uuid}`); // Navigate to the library page
  };

  return (
    <Card
      key={library.uuid}
      onClick={handlePostClick} // Handle click on the library
      className="group/library rounded-2xl bg-card p-5 shadow-[0_3px_15px_rgb(0,0,0,0.12)] cursor-pointer" // Added cursor-pointer for better UX
    >
      <div className="flex gap-3 items-center m-0 p-0">
        <p className="flex items-center gap-1 font-medium">
          {library.user.username}
          {library.user.profile.is_student ? (
            <span className="text-xs bg-green-500 text-white px-1 rounded-full">
              Student
            </span>
          ) : (
            <span className="text-xs bg-blue-500 text-white px-1 rounded-full">
              Teacher
            </span>
          )}
        </p>
        {"\u2022"}
        <p
          className="block text-xs text-muted-foreground"
          suppressHydrationWarning
        >
          {formatReletiveDate(new Date(library.created_at))}
        </p>
      </div>
      <hr />
      <div className="whitespace-pre-line break-words text-2xl font-bold items-center flex gap-1">
        {library.title} {/* Display the title */}
        {library.is_verified && (
          <span className="text-green-500 text-sm ml-2">
            <CircleCheckBig size={20}/>
          </span>
        )}
      </div>
      <div className="whitespace-pre-line break-words text-base text-muted-foreground">
        {library.description} {/* Display the description */}
      </div>

      {library.asset_url && <div>{library.title}</div>}

      <div className="text-sm text-muted-foreground">
        Stream: {library.stream} {/* Display the stream */}
        <br />
        Standard: {library.standard} {/* Display the standard */}
      </div>
    </Card>
  );
};

export default Library;
