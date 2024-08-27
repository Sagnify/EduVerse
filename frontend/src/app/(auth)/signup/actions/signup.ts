// actions/signup.ts

export async function signupUser(formData: {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  profile: {
    is_student: boolean;
    is_teacher: boolean;
  };
  student_profile?: {
    phone_number: string;
    profile_pic: File | null | string;
    address: string;
    gender: string;
    stream: string;
    standard: string;
  };
  teacher_profile?: {
    phone_number: string;
    profile_pic: File | null | string;
    rating: number;
    bio: string;
  };
}) {
  // Set default profile picture if not provided
  if (formData.student_profile && !formData.student_profile.profile_pic) {
    formData.student_profile.profile_pic = "default_profile_pic.jpg";
  }
  if (formData.teacher_profile && !formData.teacher_profile.profile_pic) {
    formData.teacher_profile.profile_pic = "default_profile_pic.jpg";
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/api/users", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Signup failed. Please try again.");
    }

    const resData = await res.json();
    console.log(resData);

    return { success: true, message: "Signup successful! Please log in." };
  } catch (error: any) {
    console.error("There was a problem with the fetch operation:", error);
    return {
      success: false,
      message: error.message || "Signup failed. Please try again.",
    };
  }
}
