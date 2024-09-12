"use client";
import { fetchLectureByID } from "@/core/fetchLectures";
import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";

interface LecturePageProps {
  lectureId: string;
}

const LecturePage = ({ lectureId }: LecturePageProps) => {
  const [lectureData, setLectureData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const data = await fetchLectureByID(lectureId);
        setLectureData(data);
      } catch (err) {
        setError("Error loading lecture");
        console.error("Failed to fetch lecture", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
  }, [lectureId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="w-full flex gap-2">
      {/* Other lecture details */}
      <Card className="w-full">
        <video
          width="320"
          height="240"
          controls
          preload="none"
          className="w-full rounded-xl"
        >
          <source src="/videos/thermodynamics.mp4" type="video/mp4" />
          <track
            src="/videos/thermodynamics.mp4"
            kind="subtitles"
            srcLang="en"
            label="English"
          />
          Your browser does not support the video tag.
        </video>
      </Card>
      <Card className="w-full p-3">
        <h1 className="font-bold text-4xl">{lectureData.title}</h1>
        <hr className="my-3" />
        <p>{lectureData.description}</p>
        <div className="flex gap-3">
          <p>Stream: {lectureData.stream}</p>
          <p>Subject: {lectureData.subject}</p>
          <p>Standard: {lectureData.standard}</p>
        </div>
        <p>Uploaded by: {lectureData.user}</p>
      </Card>
    </div>
  );
};

export default LecturePage;
