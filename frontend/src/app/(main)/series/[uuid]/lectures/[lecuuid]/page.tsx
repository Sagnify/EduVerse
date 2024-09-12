import LecturePage from "@/components/Lectures/LecturePage";

export default function Page({ params }: { params: { lecuuid: string } }) {
  return (
    <div className="max-w-4xl mx-auto flex w-full gap-4">
      <LecturePage lectureId={params.lecuuid} />
    </div>
  );
}
