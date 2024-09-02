export function fetchUserDataFromId(userId: string): Promise<User> {
  const url = `https://eduverse-a4l5.onrender.com/api/users/?user_id=${userId}`;

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

export function fetchUserDataFromUsername(username: string): Promise<User> {
  const url = `https://eduverse-a4l5.onrender.com/api/users/?username=${username}`;

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
