export function fetchUserDataFromToken(token: string): Promise<User> {
  const url = `https://eduverse-a4l5.onrender.com/api/users/?token=${token}&show_my=true`;

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

export function fetchUserDataByUsername(username: string): Promise<User> {
  const url = `https://eduverse-a4l5.onrender.com/api/users/?username=${username}`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      return response.json();
    })
    .then((data: User[]) => {
      if (data.length > 0) {
        return data[0]; // Assuming the array contains only one user
      } else {
        throw new Error("User not found");
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      throw error;
    });
}
