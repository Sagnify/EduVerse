import { useState, useEffect } from "react";
import { fetchUserDataFromToken } from "@/core/user";

const useUserFetcher = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        fetchUserDataFromToken(token)
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
        setError("Token not found in localStorage");
        setLoading(false);
      }
    }
  }, []);

  return { user, loading, error };
};

export default useUserFetcher;
