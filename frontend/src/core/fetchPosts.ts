// services/api.ts
export const fetchAllPosts = async (): Promise<any[]> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found in localStorage");
  }

  try {
    const response = await fetch(
      `https://eduverse-a4l5.onrender.com/api/posts/?token=${token}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error; // Re-throw to be handled in component
  }
};
