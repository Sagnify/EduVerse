// fetchComments.ts

export const fetchComments = async (uuid: string) => {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `https://eduverse-a4l5.onrender.com/api/comments/post/${uuid}/?token=${token}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

  const data = await response.json();
  return data;
};
