"use client";
import { useState, useEffect } from "react";
import { fetchUserDataFromUsername } from "@/core/user"; // Adjust the path to your actual function

export default function Page({ params }: { params: { name: string } }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await fetchUserDataFromUsername(params.name);
        setUser(userData);
      } catch (err) {
        setError("Failed to fetch user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.name]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user found</div>;
  }

  return (
    <div className="">
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
}
