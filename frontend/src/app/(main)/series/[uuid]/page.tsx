"use client";

import LectureList from "@/components/Lectures/LectureList";

export default function Page({ params }: { params: { uuid: string } }) {
  return (
    <div className="max-w-4xl mx-auto flex w-full gap-4">
      <div className="w-full sticky top-16 self-start">
        <LectureList id={params.uuid} />
      </div>
    </div>
  );
}
