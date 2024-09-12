import LibraryList from "@/components/library/LibraryList";
import Filters from "@/components/posts/Filters.tsx";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: {
    template: "Library",
    default: "Library",
  },
  description: "Very much a beta app",
};

const page = () => {
  return (
    <div>
      <div className="text-4xl font-bold mb-4 ">Library</div>
      <div className="flex gap-3">
        <LibraryList />

        <div className="w-fit sticky top-32 self-start">
          <Filters />
        </div>
      </div>
    </div>
  );
};

export default page;
