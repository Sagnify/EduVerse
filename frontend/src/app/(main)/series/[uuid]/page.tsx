"use client";

import LectureList from "@/components/Lectures/LectureList";
import { fetchSeriesNameById } from "@/core/fetchSeries";

export default function Page({ params }: { params: { uuid: string } }) {
  const seriesName = fetchSeriesNameById(params.uuid);
  return (
    <div className="max-w-4xl mx-auto w-full gap-4">
      <div className="text-4xl font-bold mb-4">{seriesName}</div>
      <div className="w-full sticky top-16 self-start">
        <LectureList id={params.uuid} />
      </div>
    </div>
  );
}
