// src/app/(auth)/login/actions/login.ts

export async function loginUser(formData: {
  username: string;
  password: string;
}) {
  try {
    const res = await fetch(
      "https://eduverse-a4l5.onrender.com/api/token-auth",
      {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      // Handle non-OK responses here
      const errorData = await res.json();
      throw new Error(errorData.detail || "Login failed. Please try again.");
    }

    const resData = await res.json();
    console.log(resData);

    // Store token and other information in localStorage
    localStorage.setItem("token", resData.token);
    // You can also save additional user data if needed
    // localStorage.setItem("is_student", resData.is_student.toString());
    // localStorage.setItem("is_teacher", resData.is_teacher.toString());

    return { success: true, message: "Login successful!" };
  } catch (error: any) {
    console.error("There was a problem with the fetch operation:", error);
    return {
      success: false,
      message: error.message || "Login failed. Please try again.",
    };
  }
}
