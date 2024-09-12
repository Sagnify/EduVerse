"use client";

export default function Page({ params }: { params: { lecuuid: string } }) {
  return (
    <div className="max-w-4xl mx-auto flex w-full gap-4">
      {/* <Lectures id={params.lecuuid} /> */}
      display of the lecture plus the video
    </div>
  );
}
