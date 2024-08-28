"use client";
import { fetchUserData } from "@/core/user";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      fetchUserData(userId)
        .then((data) => {
          if (data) {
            setUser(data);
          } else {
            setError("User not found");
          }
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch user data");
          setLoading(false);
        });
    } else {
      setError("userId not found in localStorage");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && (!user || error)) {
      router.push("/login");
    }
  }, [loading, user, error, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
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