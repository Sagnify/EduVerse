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

export const fetchSeriesByUuid = async (uuid: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `https://eduverse-a4l5.onrender.com/api/libassets/${uuid}/?token=${token}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch the library");
  }
  return await response.json();
};
