export function fetchUserData(userId: string): Promise<User> {
  const url = `http://127.0.0.1:8000/api/users/?user_id=${userId}`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      return response.json();
    })
    .then((data: User) => {
      return data;
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      throw error;
    });
}
