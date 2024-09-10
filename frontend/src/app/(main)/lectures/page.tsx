import LectureList from "@/components/lectures/LectureList";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="text-4xl font-bold mb-4">Lectures</div>
      <LectureList />
    </div>
  );
};

export default page;
