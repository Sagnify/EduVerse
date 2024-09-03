// services/api.ts
export const fetchPostById = async (postId: string): Promise<any> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found in localStorage");
  }

  try {
    const response = await fetch(
      `https://eduverse-a4l5.onrender.com/api/posts/${postId}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }

    const post = await response.json();
    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error; // Re-throw to be handled in component
  }
};
