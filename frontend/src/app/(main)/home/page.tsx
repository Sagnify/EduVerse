"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserFetcher from "@/core/userFetcher";
import Loading from "@/components/Loader";
import Post from "@/components/posts/post";

const Page = () => {
  const { user, loading, error } = useUserFetcher();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || error)) {
      router.push("/login");
    }
  }, [loading, user, error, router]);

  if (loading) {
    return (
      <div className="px-24">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user!.first_name}!</h1>
        <span>ready to learn?</span>
      </div>
      <Post postId="7c1c9b28-e6c1-43af-b01a-60d414101778" />
    </div>
  );
};

export default Page;
