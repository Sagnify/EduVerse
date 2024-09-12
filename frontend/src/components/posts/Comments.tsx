import React, { useEffect, useRef, useState } from "react";
import { fetchComments } from "@/core/fetchComment";
import useUserFetcher from "@/core/fetchUser";
import { formatReletiveDate } from "@/lib/utils";
import CommentInput from "./CommentInput";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { CornerRightDown, Pause, Play } from "lucide-react";

interface CommentsProps {
  uuid: string;
}

const Comments: React.FC<CommentsProps> = ({ uuid }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user, loading, error: userError } = useUserFetcher();
  const scrollAreaRef = useRef<HTMLDivElement | null>(null); // Scrollable area reference
  const bottomRef = useRef<HTMLDivElement | null>(null); // Bottom element reference
  const [showScrollToBottom, setShowScrollToBottom] = useState(false); // Show "Scroll to Bottom" button
  const [speakingCommentId, setSpeakingCommentId] = useState<number | null>(
    null
  ); // Track the currently speaking comment
  const [currentUtterance, setCurrentUtterance] =
    useState<SpeechSynthesisUtterance | null>(null); // Track the current utterance

  // Fetch comments function
  const fetchAndUpdateComments = async () => {
    try {
      const fetchedComments = await fetchComments(uuid);
      setComments(fetchedComments);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSpeechToggle = (commentId: number, commentText: string) => {
    // If this comment is currently speaking, pause or stop it
    if (speakingCommentId === commentId && currentUtterance) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        setSpeakingCommentId(null);
      } else if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setSpeakingCommentId(commentId);
      }
    } else {
      // If another comment is speaking, cancel it
      if (currentUtterance) {
        window.speechSynthesis.cancel();
      }

      // Create a new utterance for the new comment
      const utterance = new SpeechSynthesisUtterance(commentText);
      utterance.onend = () => setSpeakingCommentId(null); // Reset the state when speech ends
      window.speechSynthesis.speak(utterance);

      setCurrentUtterance(utterance);
      setSpeakingCommentId(commentId); // Set the new speaking comment
    }
  };

  // Fetch comments on initial mount
  useEffect(() => {
    fetchAndUpdateComments();
  }, [uuid]);

  // Scroll to bottom when comments change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  // Track the scroll position and show/hide "scroll to bottom" button
  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      setShowScrollToBottom(scrollHeight - scrollTop > clientHeight + 100);
    }
  };

  // Scroll to bottom when the button is clicked
  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Attach the scroll listener to the scrollable area
  useEffect(() => {
    const scrollableElement = scrollAreaRef.current;
    if (scrollableElement) {
      scrollableElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // Callback to refresh comments after a new comment is posted
  const handleNewComment = () => {
    fetchAndUpdateComments();
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (userError) {
    return <div>Error fetching user data: {userError}</div>;
  }

  const currentUsername = user?.username;

  const isLastCommentFromUser = (index: number) => {
    if (index === comments.length - 1) return true;
    return comments[index].user.username !== comments[index + 1].user.username;
  };

  return (
    <div className="group/post space-y-3 rounded-2xl mt-5 bg-card p-5 shadow-[0_3px_15px_rgb(0,0,0,0.12)]">
      <h1 className="text-2xl font-bold">Thoughts</h1>
      <ScrollArea
        ref={scrollAreaRef}
        className="flex flex-col overflow-y-auto h-[55vh]"
      >
        {comments.length > 0 ? (
          comments.map((comment, index) => {
            const isCurrentUser = comment.user.username === currentUsername;
            const isLastFromUser = isLastCommentFromUser(index);
            return (
              <div
                key={comment.id}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                } w-full`}
              >
                <div
                  className={`${
                    isCurrentUser
                      ? "bg-blue-500 text-white w-full"
                      : "bg-gray-700/10 w-full"
                  } max-w-xs p-2 rounded-xl px-4 ${
                    !isCurrentUser && !isLastFromUser
                      ? "mb-1"
                      : "rounded-bl-none mb-3"
                  } ${
                    isCurrentUser && isLastFromUser
                      ? "rounded-br-none rounded-bl-xl "
                      : ""
                  } ${
                    isCurrentUser && !isLastFromUser ? "rounded-bl-xl " : ""
                  }`}
                >
                  <div className="flex gap-3 items-center m-0 p-0">
                    <p className="flex items-center gap-1 font-medium">
                      {comment.user.username}
                      {comment.user.profile.is_student ? (
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
                      {formatReletiveDate(new Date(comment.created_at))}
                    </p>
                  </div>
                  <p className="font-bold my-1">
                    {comment.comment_caption}
                    <button
                      onClick={() =>
                        handleSpeechToggle(comment.id, comment.comment_caption)
                      }
                      className="ml-2"
                    >
                      {speakingCommentId === comment.id ? <Pause /> : <Play />}
                    </button>
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p>No comments yet.</p>
        )}
        <Button
          onClick={scrollToBottom}
          className="fixed bottom-40 right-36 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg"
        >
          <CornerRightDown />
        </Button>
        <div ref={bottomRef} />
      </ScrollArea>

      <div className="sticky bottom-0 w-full">
        {/* Pass handleNewComment as a prop to CommentInput */}
        <CommentInput postId={uuid} onNewComment={handleNewComment} />
      </div>
    </div>
  );
};

export default Comments;
