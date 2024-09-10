"use client";
export default function Page({ params }: { params: { uuid: string } }) {

  return (
    <div className="max-w-4xl mx-auto flex w-full gap-4">
      <div className="w-full sticky top-16 self-start">
        {params.uuid}
      </div>
    </div>
  );
}
