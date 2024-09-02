import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { fetchUserDataFromId } from "@/core/user";

// Define the structure of the decoded JWT payload
interface JwtPayload {
  user_id: string;
  // Add other fields if necessary
}

const useUserFetcher = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Decode the JWT token payload
          const decodedToken = jwtDecode<JwtPayload>(token);
          const userId = decodedToken.user_id;

          // Optionally decode the header if needed
          const decodedHeader = jwtDecode(token, { header: true });
          console.log("Decoded Header:", decodedHeader);

          if (userId) {
            fetchUserDataFromId(userId)
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
            setError("User ID not found in token");
            setLoading(false);
          }
        } catch (err) {
          setError("Invalid token");
          setLoading(false);
        }
      } else {
        setError("Token not found in localStorage");
        setLoading(false);
      }
    }
  }, []);

  return { user, loading, error };
};

export default useUserFetcher;
