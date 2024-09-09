"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatReletiveDate } from "@/lib/utils";
import { ChevronsDown, ChevronsUp, CircleCheckBig, MessageSquare } from "lucide-react";
import useUpvote from "@/core/useUpvote";
import useDownvote from "@/core/useDownvote";
import { Card } from "../ui/card";

const Library: React.FC<LibraryProps> = ({ library }) => {
  // const [totalVote, setTotalVote] = useState(library.total_vote);
  // const [isUpvoted, setIsUpvoted] = useState(library.has_upvoted);
  // const [isDownvoted, setIsDownvoted] = useState(library.has_downvoted);
  const router = useRouter();

  // const { handleUpvote } = useUpvote(
  //   library.uuid,
  //   totalVote,
  //   isUpvoted,
  //   setTotalVote
  // );

  // const { handleDownvote } = useDownvote(
  //   library.uuid,
  //   totalVote,
  //   isDownvoted,
  //   setTotalVote
  // );

  // const handleUpvoteClick = (e: React.MouseEvent) => {
  //   e.stopPropagation(); // Prevent click event from propagating to the library container
  //   if (isDownvoted) {
  //     setIsDownvoted(false); // Reset downvote if the library was previously downvoted
  //     setTotalVote((prev) => prev + 1); // Increment vote by 1 to nullify the previous downvote
  //   }
  //   handleUpvote();
  //   setIsUpvoted(!isUpvoted); // Toggle the upvote state
  // };

  // const handleDownvoteClick = (e: React.MouseEvent) => {
  //   e.stopPropagation(); // Prevent click event from propagating to the library container
  //   if (isUpvoted) {
  //     setIsUpvoted(false); // Reset upvote if the library was previously upvoted
  //     setTotalVote((prev) => prev - 1); // Decrement vote by 1 to nullify the previous upvote
  //   }
  //   handleDownvote();
  //   setIsDownvoted(!isDownvoted); // Toggle the downvote state
  // };

  const handlePostClick = () => {
    router.push(`/library/${library.uuid}`); // Navigate to the library page
  };

  return (
    <Card
      key={library.uuid}
      onClick={handlePostClick} // Handle click on the library
      className="group/library space-y-3 rounded-2xl mt-5 bg-card p-5 shadow-[0_3px_15px_rgb(0,0,0,0.12)] cursor-pointer" // Added cursor-pointer for better UX
    >
      <div className="flex gap-3 items-center m-0 p-0">
        <p className="flex items-center gap-1 font-medium">
          {library.user.username}
          {library.user.profile.is_student ? (
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
          {formatReletiveDate(new Date(library.created_at))}
        </p>
      </div>
      <hr />
      <div className="whitespace-pre-line break-words text-2xl font-bold items-center flex gap-1">
        {library.title} {/* Display the title */}
        {library.is_verified && (
          <span className="text-green-500 text-sm ml-2">
            <CircleCheckBig size={20}/>
          </span>
        )}
      </div>
      <div className="whitespace-pre-line break-words text-base text-muted-foreground">
        {library.description} {/* Display the description */}
      </div>

      {library.asset_url && <div>{library.title}</div>}

      <div className="text-sm text-muted-foreground">
        Stream: {library.stream} {/* Display the stream */}
        <br />
        Standard: {library.standard} {/* Display the standard */}
      </div>
    </Card>
  );
};

export default Library;
