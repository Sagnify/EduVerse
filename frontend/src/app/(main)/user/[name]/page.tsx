"use client";
import useUserFetcherByUsername from "@/core/useUserFetcherByUsername";
import React from "react";

export default function Page({ params }: { params: { name: string } }) {
  const { user, loading, error } = useUserFetcherByUsername(params.name);

  if (loading) {
    return <div>Loading user profile...</div>;
  }

  if (error) {
    return <div>Error fetching user data: {error}</div>;
  }

  if (!user) {
    return <div>No user found with the username: {params.name}</div>;
  }

  return (
    <div>
      <h1>
        Welcome, {user.first_name} {user.last_name}
      </h1>
      <p>Email: {user.email}</p>
      <p>Username: {user.username}</p>
      <h2>Profile</h2>
      <p>Student: {user.profile?.is_student ? "Yes" : "No"}</p>
      <p>Teacher: {user.profile?.is_teacher ? "Yes" : "No"}</p>
      <h2>Student Profile</h2>
      <p>Phone: {user.student_profile?.phone_number ?? "N/A"}</p>
      <p>Address: {user.student_profile?.address ?? "N/A"}</p>
      <p>Stream: {user.student_profile?.stream ?? "N/A"}</p>
      <p>Standard: {user.student_profile?.standard ?? "N/A"}</p>
    </div>
  );
}
