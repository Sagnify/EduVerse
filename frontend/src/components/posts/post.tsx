// components/posts/Post.tsx
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchPostById } from "@/core/fetchPosts";

interface PostProps {
  postId: string;
}

const Post: React.FC<PostProps> = ({ postId }) => {
  const [post, setPost] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postData = await fetchPostById(postId);
        setPost(postData);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    loadPost();
  }, [postId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{post.caption}</h1>
      <p>User: {post.user}</p>
      <p>Created At: {new Date(post.created_at).toLocaleString()}</p>
      <p>Upvotes: {post.upvote_count}</p>
      <p>Downvotes: {post.downvote_count}</p>
      {post.post_img_url && (
        <Image
          src={post.post_img_url}
          alt="Post image"
          layout="responsive"
          width={600}
          height={400}
        />
      )}
    </div>
  );
};

export default Post;
