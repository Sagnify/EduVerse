// actions/signup.ts
export interface UserProfile {
  phoneNumber?: string;
  address?: string;
  gender?: string;
  stream?: string;
  standard?: string;
  bio?: string;
}

export interface SignupData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isStudent: boolean;
  isTeacher: boolean;
  studentProfile?: UserProfile;
  teacherProfile?: UserProfile;
}

export async function signup(data: SignupData) {
  try {
    const response = await fetch(
      "https://eduverse-a4l5.onrender.com/api/users/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          password: data.password,
          profile: {
            is_student: data.isStudent,
            is_teacher: data.isTeacher,
          },
          student_profile: data.isStudent
            ? {
                phone_number: data.studentProfile?.phoneNumber || "",
                address: data.studentProfile?.address || "",
                gender: data.studentProfile?.gender || "",
                stream: data.studentProfile?.stream || "",
                standard: data.studentProfile?.standard || "",
              }
            : null,
          teacher_profile: data.isTeacher
            ? {
                phone_number: data.teacherProfile?.phoneNumber || "",
                bio: data.teacherProfile?.bio || "",
                rating: "0.00",
              }
            : {}, // Sending an empty object instead of null
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error response:", errorData);
      throw new Error(JSON.stringify(errorData));
    }

    return response.json();
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}
