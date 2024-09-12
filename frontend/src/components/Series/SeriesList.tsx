"use client";
import React, { useEffect, useState } from "react";
import Series from "./SeriesRender";
import { fetchAllSeries } from "@/core/fetchSeries";

const SeriesList: React.FC = () => {
  const [series, setSeries] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const loadSeries = async () => {
      setLoading(true); // Start loading
      try {
        const seriesData = await fetchAllSeries();
        setSeries(seriesData);
        setLoading(false); // Stop loading
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
        setLoading(false); // Stop loading on error
      }
    };

    loadSeries();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (series.length === 0) {
    return <div>No Series Available.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {series.map((seriesItem) => (
        <Series key={seriesItem.uuid} series={seriesItem} />
      ))}
    </div>
  );
};

export default SeriesList;
