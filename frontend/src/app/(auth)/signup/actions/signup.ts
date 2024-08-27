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
  displayName: string;
  password: string;
  isStudent: boolean;
  isTeacher: boolean;
  studentProfile?: UserProfile;
  teacherProfile?: UserProfile;
}

export async function signup(data: SignupData) {
  const response = await fetch("/api/users/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: data.username,
      first_name: data.displayName,
      last_name: "", // You can adjust this based on your requirements
      email: "", // You can adjust this based on your requirements
      profile: {
        is_student: data.isStudent,
        is_teacher: data.isTeacher,
      },
      student_profile: data.isStudent
        ? {
            phone_number: data.studentProfile?.phoneNumber,
            address: data.studentProfile?.address,
            gender: data.studentProfile?.gender,
            stream: data.studentProfile?.stream,
            standard: data.studentProfile?.standard,
          }
        : null,
      teacher_profile: data.isTeacher
        ? {
            phone_number: data.teacherProfile?.phoneNumber,
            bio: data.teacherProfile?.bio,
            rating: "0.00", // Default value for rating
          }
        : null,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to sign up");
  }

  return response.json();
}
