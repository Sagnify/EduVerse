"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { formatReletiveDate } from "@/lib/utils";
import { Card } from "../ui/card";

interface SeriesProps {
  series: {
    id: number;
    title: string;
    description: string;
    created_at: string;
    user: {
      username: string;
      profile: {
        is_student: boolean;
      };
    };
    lecture_count: number;
  };
}

const Series: React.FC<SeriesProps> = ({ series }) => {
  const router = useRouter();

  const handlePostClick = () => {
    router.push(`/lectures/series/${series.id}`); // Navigate to the series page
  };

  return (
    <Card
      key={series.id}
      onClick={handlePostClick} // Handle click on the series
      className="group/library rounded-2xl bg-card p-5 shadow-[0_3px_15px_rgb(0,0,0,0.12)] cursor-pointer" // Added cursor-pointer for better UX
    >
      <div className="flex gap-3 items-center m-0 p-0">
        <p className="flex items-center gap-1 font-medium">
          {series.user.username}
          {series.user.profile.is_student ? (
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
          {formatReletiveDate(new Date(series.created_at))}
        </p>
      </div>
      <hr />
      <div className="whitespace-pre-line break-words text-2xl font-bold items-center flex gap-1">
        {series.title} {/* Display the series title */}
      </div>
      <div className="whitespace-pre-line break-words text-base text-muted-foreground">
        {series.description} {/* Display the series description */}
      </div>

      <div className="text-sm text-muted-foreground">
        {series.lecture_count} Video {/* Display the number of lectures */}
      </div>
    </Card>
  );
};

export default Series;
