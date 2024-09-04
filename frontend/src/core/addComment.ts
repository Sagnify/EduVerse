// src/core/addComment.ts

// src/core/addComment.ts

export const addComment = async (postId: string, comment: string) => {

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `https://eduverse-a4l5.onrender.com/api/comments/?token=${token}&edit=true`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post: postId,
          comment_caption: comment,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to post comment');
    }

    return await response.json();
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
