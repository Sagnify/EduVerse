interface UserProfile {
  is_student: boolean;
  is_teacher: boolean;
}

interface StudentProfile {
  phone_number: string;
  profile_pic: string | null;
  address: string;
  gender: string;
  stream: string;
  standard: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  profile: UserProfile;
  student_profile: StudentProfile;
}
