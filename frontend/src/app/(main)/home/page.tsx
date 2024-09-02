"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserFetcher from "@/core/userFetcher";
import Loading from "@/components/Loader";

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
      <h1 className="text-3xl font-bold">
        Welcome, {user!.first_name}!
      </h1>
      <span>
        ready to learn?
      </span>
    </div>
  );
};

export default Page;
