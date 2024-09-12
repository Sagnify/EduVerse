"use client";
import React, { useEffect, useState } from "react";
import { fetchAllLectures } from "@/core/fetchLectures";
import Lectures from "./LectureRender";

const LectureList: React.FC<{ id: string,  }> = ({ id }) => {
  const [lectures, setLectures] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const loadLectures = async () => {
      setLoading(true); // Start loading
      try {
        const lectureData = await fetchAllLectures(id);
        setLectures(lectureData);
        setLoading(false); // Stop loading
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
        setLoading(false);
      }
    };

    loadLectures();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (lectures.length === 0) {
    return <div>No Lectures Available.</div>;
  }

  return (
    <div className="">
      {lectures.map((lecture) => (
        <Lectures key={lecture.id} lectures={lecture} />
      ))}
    </div>
  );
};

export default LectureList;
