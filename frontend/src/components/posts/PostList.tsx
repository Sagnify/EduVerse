// components/posts/PostList.tsx
import React, { useEffect, useState } from "react";
import { fetchAllPosts } from "@/core/fetchPosts";
import Post from "./PostRender";

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postsData = await fetchAllPosts();
        setPosts(postsData);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    loadPosts();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (posts.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      {posts.map((post) => (
        <Post key={post.uuid} post={post} />
      ))}
    </div>
  );
};

export default PostList;
