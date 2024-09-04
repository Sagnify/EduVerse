"use client"
import React, { useEffect, useState } from "react";
import Post from "@/components/posts/PostRender";
import { fetchPostByUuid } from "@/core/fetchPosts";

export default function Page({ params }: { params: { uuid: string } }) {
  const [post, setPost] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postData = await fetchPostByUuid(params.uuid);
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
  }, [params.uuid]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <Post post={post} />
    </div>
  );
}
