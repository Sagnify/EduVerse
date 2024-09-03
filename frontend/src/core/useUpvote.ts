"use client";

import { useState } from "react";

const useUpvote = (
  postId: string,
  initialHasUpvoted: boolean,
  setTotalVote: React.Dispatch<React.SetStateAction<number>> // Accept setTotalVote
) => {
  const [isUpvoted, setIsUpvoted] = useState(initialHasUpvoted);

  const handleUpvote = async () => {
    console.log("Upvote button clicked");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      console.log("Making API call to upvote...");
      const response = await fetch(
        `https://eduverse-a4l5.onrender.com/api/posts/${postId}/upvote/?token=${token}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();
      console.log("API response:", data);

      if (response.ok) {
        if (data.status === 1) {
          console.log("Post upvoted successfully");
          setIsUpvoted(true);
          setTotalVote((prev) => prev + 1); // Update totalVote
        } else if (data.status === 0) {
          console.log("Upvote removed successfully");
          setIsUpvoted(false);
          setTotalVote((prev) => prev - 1); // Update totalVote
        }
      } else {
        console.error("Failed to upvote post:", data);
      }
    } catch (error) {
      console.error("Error upvoting post:", error);
    }
  };

  return {
    isUpvoted,
    handleUpvote,
  };
};

export default useUpvote;
