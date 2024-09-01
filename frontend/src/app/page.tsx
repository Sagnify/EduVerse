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
    <div className="px-24 ">
      <h1>
        Welcome, {user!.first_name} {user!.last_name}
      </h1>
      <p>Email: {user!.email}</p>
      <p>Username: {user!.username}</p>
      <h2>Profile</h2>
      <p>Student: {user!.profile.is_student ? "Yes" : "No"}</p>
      <p>Teacher: {user!.profile.is_teacher ? "Yes" : "No"}</p>
      <h2>Student Profile</h2>
      <p>Phone: {user!.student_profile.phone_number}</p>
      <p>Address: {user!.student_profile.address}</p>
      <p>Stream: {user!.student_profile.stream}</p>
      <p>Standard: {user!.student_profile.standard}</p>
    </div>
  );
};

export default Page;
