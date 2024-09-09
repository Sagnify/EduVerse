"use client";
import React, { useEffect, useState } from "react";
import { fetchLibraryByUuid } from "@/core/fetchLibrary";
import Library from "@/components/library/LibraryRender";
import PDFViewer from "@/components/library/PDFViewer";

export default function Page({ params }: { params: { uuid: string } }) {
  const [library, setLibrary] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const libraryData = await fetchLibraryByUuid(params.uuid);
        setLibrary(libraryData);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    loadPost();
  }, [params.uuid]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!library) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto flex w-full gap-4">
      <div className="w-full sticky top-16 self-start">
        <Library library={library} />
        {/* Only display the PDFViewer if there's a PDF file available */}
        {library.asset_url && library.asset_url.endsWith(".pdf") && (
          <PDFViewer pdfUrl={library.asset_url} />
        )}
      </div>
    </div>
  );
}
