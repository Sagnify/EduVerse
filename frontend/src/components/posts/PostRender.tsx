"use client";
import React, { useState } from "react";
import Image from "next/image";
import { formatReletiveDate } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import useUpvote from "@/core/useUpvote";
import useDownvote from "@/core/useDownvote"; // Import the useDownvote hook

const Post: React.FC<PostProps> = ({ post }) => {
  const [totalVote, setTotalVote] = useState(post.total_vote);
  const [isUpvoted, setIsUpvoted] = useState(post.has_upvoted);
  const [isDownvoted, setIsDownvoted] = useState(post.has_downvoted);

  const { handleUpvote } = useUpvote(
    post.uuid,
    totalVote,
    isUpvoted,
    setTotalVote
  );

  const { handleDownvote } = useDownvote(
    post.uuid,
    totalVote,
    isDownvoted,
    setTotalVote
  );

  const handleUpvoteClick = () => {
    if (isDownvoted) {
      setIsDownvoted(false); // Reset downvote if the post was previously downvoted
      setTotalVote((prev) => prev + 1); // Increment vote by 1 to nullify the previous downvote
    }
    handleUpvote();
    setIsUpvoted(!isUpvoted); // Toggle the upvote state
  };

  const handleDownvoteClick = () => {
    if (isUpvoted) {
      setIsUpvoted(false); // Reset upvote if the post was previously upvoted
      setTotalVote((prev) => prev - 1); // Decrement vote by 1 to nullify the previous upvote
    }
    handleDownvote();
    setIsDownvoted(!isDownvoted); // Toggle the downvote state
  };

  return (
    <div
      key={post.uuid}
      className="group/post space-y-3 rounded-2xl mt-5 bg-card p-5 shadow-[0_3px_15px_rgb(0,0,0,0.12)]"
    >
      <div className="flex gap-3 items-center m-0 p-0">
        <p className="flex items-center gap-1 font-medium">
          {post.user.username}
          {post.user.profile.is_student ? (
            <span className="text-xs bg-green-500 text-white px-1 rounded-full">
              Student
            </span>
          ) : (
            <span className="text-xs bg-blue-500 text-white px-1 rounded-full">
              Teacher
            </span>
          )}
        </p>
        {"\u2022"}
        <p
          className="block text-xs text-muted-foreground"
          suppressHydrationWarning
        >
          {formatReletiveDate(new Date(post.created_at))}
        </p>
      </div>
      <hr />
      <div className="whitespace-pre-line break-words text-2xl font-bold">
        {post.caption}
      </div>

      {post.post_img_url && (
        <Image
          src="/"
          alt="Post image"
          layout="responsive"
          width={600}
          height={400}
        />
      )}
      <hr />
      <div className="flex gap-1 w-fit items-center">
        <Button
          variant="ghost"
          className={`rounded-full px-2.5 py-1 ${
            isUpvoted
              ? "bg-green-500 hover:bg-green-600 hover:text-white text-white"
              : "bg-gray-200"
          }`}
          onClick={handleUpvoteClick}
        >
          <ChevronsUp size={20} />
        </Button>
        <span className="text-lg mx-2">{totalVote}</span>
        <Button
          variant="ghost"
          className={`rounded-full px-2.5 py-1 ${
            isDownvoted
              ? "bg-red-500 hover:bg-red-600 hover:text-white text-white"
              : "bg-gray-200"
          }`}
          onClick={handleDownvoteClick}
        >
          <ChevronsDown size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Post;

