import React from "react";

interface PDFViewerProps {
  pdfUrl: string;
}

export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <iframe src={pdfUrl} className="w-full h-full" title="PDF Viewer" />
    </div>
  );
}
