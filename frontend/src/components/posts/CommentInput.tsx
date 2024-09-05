import React, { useState } from "react";
import { Textarea } from "../ui/textarea";
import useUserFetcher from "@/core/fetchUser";
import { Button } from "../ui/button";
import { addComment } from "@/core/addComment";

interface CommentInputProps {
  postId: string;
  onNewComment?: () => void; // Optional callback prop to trigger comment refresh
}

const CommentInput: React.FC<CommentInputProps> = ({
  postId,
  onNewComment,
}) => {
  const { user, loading, error: userError } = useUserFetcher();
  const [comment, setComment] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);
  const [error, setError] = useState<string | null>(null); // Properly typed error state

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    if (!comment.trim()) return; // Prevent empty comment submission

    setLoadingComment(true);
    setError(null); // Clear previous error before submitting
    try {
      await addComment(postId, comment);

      // If the comment was successfully posted, clear the input and trigger the refresh
      setComment("");
      if (onNewComment) {
        onNewComment(); // Call the parent component's callback to refresh comments
      }
    } catch (err) {
      setError("Failed to post the comment. Please try again.");
    } finally {
      setLoadingComment(false);
    }
  };

  // Handle "Enter" key for sending the comment
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents newline
      handleSubmit(); // Trigger comment submission
    }
  };

  if (loading) {
    return <div>Loading user...</div>;
  }

  if (userError) {
    return <div>Error loading user data: {userError}</div>;
  }

  return (
    <div className="flex items-center gap-2 pt-2">
      <Textarea
        className="w-full"
        placeholder={`Pen a thought, ${user?.username}`}
        value={comment}
        onChange={handleCommentChange}
        onKeyDown={handleKeyDown} // Listen for the Enter key
        disabled={loadingComment} // Disable input while posting a comment
      />
      <Button
        onClick={handleSubmit}
        disabled={loadingComment || !comment.trim()}
      >
        {loadingComment ? "Posting..." : "Post"}
      </Button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default CommentInput;
