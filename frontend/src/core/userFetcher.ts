import { useState, useEffect } from "react";
import { fetchUserData } from "@/core/user";

const useUserFetcher = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
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
          .catch(() => {
            setError("Failed to fetch user data");
            setLoading(false);
          });
      } else {
        setError("userId not found in localStorage");
        setLoading(false);
      }
    }
  }, []);

  return { user, loading, error };
};

export default useUserFetcher;
