export const fetchAllLectures = async (id: string): Promise<any[]> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found in localStorage");
  }

  try {
    const response = await fetch(
      `https://eduverse-a4l5.onrender.com/api/series/${id}/?token=${token}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch library: ${response.statusText}`);
    }

    const data = await response.json();
    return data.lectures; // Return only the lectures array
  } catch (error) {
    console.error("Error fetching library:", error);
    throw error;
  }
};
