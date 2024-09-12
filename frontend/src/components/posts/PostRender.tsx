"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatReletiveDate } from "@/lib/utils";
import {
  ChevronsDown,
  ChevronsUp,
  MessageSquare,
  Play,
  Pause,
} from "lucide-react";
import useUpvote from "@/core/useUpvote";
import useDownvote from "@/core/useDownvote"; // Import the useDownvote hook

const Post: React.FC<PostProps> = ({ post }) => {
  const [totalVote, setTotalVote] = useState(post.total_vote);
  const [isUpvoted, setIsUpvoted] = useState(post.has_upvoted);
  const [isDownvoted, setIsDownvoted] = useState(post.has_downvoted);
  const [speakingPostId, setSpeakingPostId] = useState<string | null>(null); // Track currently speaking post
  const [currentUtterance, setCurrentUtterance] =
    useState<SpeechSynthesisUtterance | null>(null); // Track the current utterance

  const router = useRouter();

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

  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click event from propagating to the post container
    if (isDownvoted) {
      setIsDownvoted(false); // Reset downvote if the post was previously downvoted
      setTotalVote((prev) => prev + 1); // Increment vote by 1 to nullify the previous downvote
    }
    handleUpvote();
    setIsUpvoted(!isUpvoted); // Toggle the upvote state
  };

  const handleDownvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click event from propagating to the post container
    if (isUpvoted) {
      setIsUpvoted(false); // Reset upvote if the post was previously upvoted
      setTotalVote((prev) => prev - 1); // Decrement vote by 1 to nullify the previous upvote
    }
    handleDownvote();
    setIsDownvoted(!isDownvoted); // Toggle the downvote state
  };

  const handlePostClick = () => {
    router.push(`/post/${post.uuid}`); // Navigate to the post page
  };

  // Handle speech play/pause
  const handleSpeechToggle = (postId: string, postText: string) => {
    if (speakingPostId === postId && currentUtterance) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        setSpeakingPostId(null);
      } else if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setSpeakingPostId(postId);
      }
    } else {
      // If another post is speaking, stop it
      if (currentUtterance) {
        window.speechSynthesis.cancel();
      }

      // Create a new utterance for the post
      const utterance = new SpeechSynthesisUtterance(postText);
      utterance.onend = () => setSpeakingPostId(null); // Reset state after speech ends
      window.speechSynthesis.speak(utterance);

      setCurrentUtterance(utterance);
      setSpeakingPostId(postId); // Set the new speaking post
    }
  };

  return (
    <div
      key={post.uuid}
      onClick={handlePostClick} // Handle click on the post
      className="group/post space-y-3 rounded-2xl mt-5 bg-card p-5 shadow-[0_3px_15px_rgb(0,0,0,0.12)] cursor-pointer" // Added cursor-pointer for better UX
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
          src={post.post_img_url}
          alt="Post image"
          layout="responsive"
          width={600}
          height={400}
          className="rounded-xl"
        />
      )}
      <hr />
      <div className="flex gap-2 items-center">
        <div className="flex gap-0.5 w-fit items-center bg-primary/10 p-1 rounded-full">
          <button
            className={`rounded-full p-1.5 ${
              isUpvoted
                ? "bg-green-500 hover:bg-green-600  text-white"
                : "hover:bg-primary/10 transition-colors duration-200"
            }`}
            onClick={handleUpvoteClick} // Upvote button click
          >
            <ChevronsUp size={20} />
          </button>
          <span className="text-lg mx-2">{totalVote}</span>
          <button
            className={`rounded-full p-1.5 ${
              isDownvoted
                ? "bg-red-500 hover:bg-red-600  text-white"
                : "hover:bg-primary/10 transition-colors duration-200"
            }`}
            onClick={handleDownvoteClick} // Downvote button click
          >
            <ChevronsDown size={20} />
          </button>
        </div>
        <button
          className={`rounded-full p-2 px-2.5 bg-primary/10 text-primary flex items-center gap-2 }`}
        >
          {post.comment_count}
          <MessageSquare size={20} />
        </button>

        {/* Play/Pause button for the post */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent click propagation to the post container
            handleSpeechToggle(post.uuid, post.caption); // Toggle speech for the post caption
          }}
          className="ml-4 p-1.5 bg-blue-500 text-white rounded-full"
        >
          {speakingPostId === post.uuid ? <Pause /> : <Play />}
        </button>
      </div>
    </div>
  );
};

export default Post;
