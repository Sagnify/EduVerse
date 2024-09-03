"use client";

import { useState } from "react";

const useDownvote = (
  postId: string,
  initialHasDownvoted: boolean,
  setTotalVote: React.Dispatch<React.SetStateAction<number>> // Accept setTotalVote
) => {
  const [isDownvoted, setIsDownvoted] = useState(initialHasDownvoted);

  const handleDownvote = async () => {
    console.log("Downvote button clicked");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      console.log("Making API call to downvote...");
      const response = await fetch(
        `https://eduverse-a4l5.onrender.com/api/posts/${postId}/downvote/?token=${token}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();
      console.log("API response:", data);

      if (response.ok) {
        if (data.status === 1) {
          console.log("Post downvoted successfully");
          setIsDownvoted(true);
          setTotalVote((prev) => prev - 1); // Update totalVote
        } else if (data.status === 0) {
          console.log("Downvote removed successfully");
          setIsDownvoted(false);
          setTotalVote((prev) => prev + 1); // Update totalVote
        }
      } else {
        console.error("Failed to downvote post:", data);
      }
    } catch (error) {
      console.error("Error downvoting post:", error);
    }
  };

  return {
    isDownvoted,
    handleDownvote,
  };
};

export default useDownvote;
