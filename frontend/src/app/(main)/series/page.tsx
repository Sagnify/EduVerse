import SeriesList from "@/components/Series/SeriesList";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="text-4xl font-bold mb-4">Series for you</div>
      <SeriesList />
    </div>
  );
};

export default page;
