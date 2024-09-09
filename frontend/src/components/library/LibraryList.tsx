// components/libraries/PostList.tsx
"use client"
import React, { useEffect, useState } from "react";
import { fetchAllLibrary } from "@/core/fetchLibrary";
import Library from "./LibraryRender";

const LibraryList: React.FC = () => {
  const [libraries, setLibraries] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postsData = await fetchAllLibrary();
        setLibraries(postsData);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    loadPosts();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (libraries.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {libraries.map((library) => (
        <Library key={library.uuid} library={library} />
      ))}
    </div>
  );
};

export default LibraryList;
