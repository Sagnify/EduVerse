export async function postNewPost(
  caption: string,
  postImgUrl?: string
): Promise<void> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token not found in localStorage");
  }

  const response = await fetch(
    `https://eduverse-a4l5.onrender.com/api/posts/?token=${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caption,
        post_img_url: postImgUrl || "",
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create the post.");
  }

  return;
}
