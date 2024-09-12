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

export const fetchLectureByID = async (id: string): Promise<IndividualLectureProps> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found in localStorage");
  }

  try {
    const response = await fetch(
      `https://eduverse-a4l5.onrender.com/api/lectures/${id}/?token=${token}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch lecture: ${response.statusText}`);
    }

    const data = await response.json();

    // Ensure the response contains the necessary fields
    return {
      id: data.id,
      user: data.user,
      lecture_url: data.lecture_url,
      thumbnail_url: data.thumbnail_url,
      title: data.title,
      description: data.description,
      stream: String(data.stream), // Convert to string as per the interface definition
      subject: String(data.subject), // Convert to string as per the interface definition
      standard: String(data.standard), // Convert to string as per the interface definition
      asset_sel: data.asset_sel, // Can be null
      rating: data.rating,
      visibility: data.visibility,
      is_verified: data.is_verified,
      series: data.series,
    };
  } catch (error) {
    console.error("Error fetching lecture:", error);
    throw error;
  }
};
