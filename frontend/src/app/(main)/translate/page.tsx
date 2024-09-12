// pages/languages.js
import { Button } from "@/components/ui/button";
import React from "react";

const languages = [
  "Hindi",
  "Bengali",
  "Telugu",
  "Marathi",
  "Tamil",
  "Gujarati",
  "Malayalam",
  "Kannada",
  "Punjabi",
  "Odia",
];

const LanguagesPage = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1 className="font-bold text-2xl my-5">Select language</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {languages.map((language, index) => (
          <Button key={index} variant="ghost" color="primary">
            {language}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default LanguagesPage;
