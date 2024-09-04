import React, { useEffect, useState } from "react";
import { fetchComments } from "@/core/fetchComment";
import useUserFetcher from "@/core/fetchUser";
import { formatReletiveDate } from "@/lib/utils";

interface CommentsProps {
  uuid: string;
}

const Comments: React.FC<CommentsProps> = ({ uuid }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user, loading, error: userError } = useUserFetcher();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchAndUpdateComments = async () => {
      try {
        const fetchedComments = await fetchComments(uuid);
        setComments(fetchedComments);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchAndUpdateComments(); // Fetch comments immediately on mount

    intervalId = setInterval(fetchAndUpdateComments, 5000); // Set up interval to fetch comments every 5 seconds

    return () => {
      clearInterval(intervalId); // Clear the interval on component unmount
    };
  }, [uuid]);

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
      <div className="flex flex-col">
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
                  <p className="font-bold my-1">{comment.comment_caption}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default Comments;
