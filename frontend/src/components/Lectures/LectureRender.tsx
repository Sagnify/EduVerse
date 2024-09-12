// components/libraries/LectureRender.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "../ui/card";
import Image from "next/image";
import { ShieldCheck, Star } from "lucide-react";

const Lectures: React.FC<{ lectures: LectureProps["lectures"] }> = ({
  lectures,
}) => {
  const router = useRouter();

  const handlePostClick = () => {
    router.push(`/series/${lectures.series}/lectures/${lectures.id}/`); // Navigate to the lecture page
  };

  return (
    <Card
      key={lectures.id}
      onClick={handlePostClick} // Handle click on the lecture
      className="group/library rounded-2xl bg-card flex items-center gap-4 my-2 shadow-[0_3px_15px_rgb(0,0,0,0.12)] cursor-pointer p-3 w-full" // Added cursor-pointer for better UX
    >
      <Image
        src={"/"}
        alt={lectures.title}
        height={250}
        width={250}
        className="rounded-md"
      />
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className=" flex items-center gap-2">
            <div className="text-3xl font-bold">{lectures.title}</div>
            <p>{lectures.is_verified ? <ShieldCheck color="gold" /> : ""}</p>
            {!lectures.visibility && (
              <span className="text-xs bg-blue-500 text-white px-1 rounded-full">
                Private
              </span>
            )}
          </h3>
          <p className="flex gap-1 items-center">
            <Star size={17} />
            {lectures.rating}
          </p>
        </div>
        {/* <h3>URL: {lectures.thumbnail_url}</h3> */}

        <Card className="py-3 px-2 w-full">
          Description: {lectures.description}
        </Card>

        <div className="flex gap-3">
          <p>Stream: {lectures.stream}</p>
          <p>Subject: {lectures.subject}</p>
          <p>Standard: {lectures.standard}</p>
        </div>
      </div>
    </Card>
  );
};

export default Lectures;
