// services/api.ts

export const fetchAllSeries = async (): Promise<any[]> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found in localStorage");
  }

  try {
    const response = await fetch(
      `https://eduverse-a4l5.onrender.com/api/series/?token=${token}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch library: ${response.statusText}`);
    }

    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error("Error fetching library:", error);
    throw error; // Re-throw to be handled in component
  }
};

export const fetchSeriesNameById = async (uuid: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(
      `https://eduverse-a4l5.onrender.com/api/series/${uuid}/?token=${token}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch the series data");
    }

    const data = await response.json();

    // Ensure that the data contains the title
    if (!data.title) {
      throw new Error("Series title not found in the response");
    }

    // Return the series title
    return data.title;
  } catch (error) {
    console.error("Error fetching series name:", error);
    throw error;
  }
};

