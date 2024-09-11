// components/libraries/PostList.tsx
"use client";
import React, { useEffect, useState } from "react";
import Series from "./SeriesRender";
import { fetchAllLectures } from "@/core/fetchLectures";

const SeriesList: React.FC = () => {
  const [series, setLectures] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postsData = await fetchAllLectures();
        setLectures(postsData);
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

  if (series.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {series.map((series) => (
        <Series key={series.uuid} series={series} />
      ))}
    </div>
  );
};

export default SeriesList;
