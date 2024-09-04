import { fetchComments } from "@/core/fetchComment";
import useUserFetcher from "@/core/fetchUser";
import { formatReletiveDate } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface CommentsProps {
  uuid: string;
}

const Comments: React.FC<CommentsProps> = ({ uuid }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user, loading, error: userError } = useUserFetcher();

  useEffect(() => {
    fetchComments(uuid)
      .then(setComments)
      .catch((err) => setError(err.message));
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

  // Function to check if a comment is the last one from its user
  const isLastCommentFromUser = (index: number) => {
    if (index === comments.length - 1) return true;
    return comments[index].user.username !== comments[index + 1].user.username;
  };

  return (
    <div className="group/post space-y-3 rounded-2xl mt-5 bg-card p-5 shadow-[0_3px_15px_rgb(0,0,0,0.12)]">
      <h1 className="text-2xl font-bold">Thoughts</h1>
      <div className="flex flex-col space-y-3">
        {comments.length > 0 ? (
          comments.map((comment) => {
            const isCurrentUser = comment.user.username === currentUsername;
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
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-700/10 rounded-bl-none"
                  } max-w-xs p-2 rounded-3xl px-4`}
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
                  {/* <hr /> */}
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
