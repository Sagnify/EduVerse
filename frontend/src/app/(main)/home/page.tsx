// components/Page.tsx
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserFetcher from "@/core/fetchUser";
import Loading from "@/components/Loader";
import PostList from "@/components/posts/PostList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Current from "@/components/posts/CurrentLearning";

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
      {/* <div className="flex flex-col items-center gap-2 w-full text-center justify-center mb-7 mr-96">
        <h1 className="text-3xl font-bold">Welcome, {user!.first_name}!</h1>
        <Button className="gap-2 text-xs">
          <Plus size={20} />
          Ask a Question
        </Button>
      </div> */}
      <div className="flex w-full gap-4">
        <div className="w-full ">
          <span className="text-center">Ready to learn something new?</span>
          <PostList />
        </div>
        <div className="w-fit sticky top-9 self-start">
          {" "}
          <span className="text-center block mb-2">
            Or continue learning from where you left,
          </span>
          <Current />
        </div>
      </div>
    </div>
  );
};

export default Page;
