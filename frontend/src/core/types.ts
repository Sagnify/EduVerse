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

interface PostProps {
  post: {
    uuid: string;
    caption: string;
    user: User;
    created_at: string;
    total_vote: number;
    post_img_url?: string;
    has_upvoted: boolean;
    has_downvoted: boolean;
  };
}

interface Comment {
  id: number;
  post: number;
  user: User;
  created_at: string;
  comment_caption: string;
}

interface LibraryProps {
  library: {
    id: number;
    uuid: string;
    user: User;
    visibility: false;
    asset_url: string;
    created_at: string;
    title: string;
    description: string;
    stream: number;
    standard: number;
    is_verified: false;
  };
}