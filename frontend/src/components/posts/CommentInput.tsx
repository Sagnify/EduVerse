import React, { useState } from "react";
import { Textarea } from "../ui/textarea";
import useUserFetcher from "@/core/fetchUser";
import { Button } from "../ui/button";
import { addComment } from "@/core/addComment";

const CommentInput = ({ postId }: { postId: string }) => {
  const { user, loading, error: userError } = useUserFetcher();
  const [comment, setComment] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);
  const [error, setError] = useState(null);

  const handleCommentChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    setLoadingComment(true);
    try {
      await addComment(postId, comment);

      // Handle successful comment posting
      setComment("");
    } catch (error) {
      setError(null);
    } finally {
      setLoadingComment(false);
    }
  };

  return (
    <div className="group/post space-y-3 flex flex-col items-end rounded-2xl mt-5 bg-card p-5 shadow-[0_3px_15px_rgb(0,0,0,0.12)]">
      <Textarea
        className="w-full"
        placeholder={`Pen a thought, ${user?.username}`}
        value={comment}
        onChange={handleCommentChange}
      />
      <Button onClick={handleSubmit} disabled={loadingComment}>
        {loadingComment ? "Posting..." : "Post"}
      </Button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default CommentInput;
