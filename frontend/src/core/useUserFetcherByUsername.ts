import { useState, useEffect } from "react";
import { fetchUserDataByUsername } from "@/core/user";

const useUserFetcherByUsername = (username: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (username) {
        fetchUserDataByUsername(username)
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
        setError("Username is required");
        setLoading(false);
      }
    }
  }, [username]);

  return { user, loading, error };
};

export default useUserFetcherByUsername;
