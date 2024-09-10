import LibraryList from "@/components/library/LibraryList";
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
      <div className="text-4xl font-bold mb-4">Library</div>
      <LibraryList />
    </div>
  );
};

export default page;
