// components/Page.tsx
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserFetcher from "@/core/fetchUser";
import Loading from "@/components/Loader";
import PostList from "@/components/posts/PostList";
import Current from "@/components/posts/CurrentLearning";
import Filters from "@/components/posts/Filters.tsx";

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
      <div className="flex w-full gap-4 items-center">
        <div className="w-full ">
          <span className="text-center font-bold text-lg">
            Ready to learn something new?
          </span>
          <PostList />
        </div>

        <div className="w-fit sticky top-9 self-start">
          <span className="text-center block mb-2 font-bold">
            Or continue learning from where you left,
          </span>
          <Current />
        </div>
      </div>
    </div>
  );
};

export default Page;
