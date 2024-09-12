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
    comment_count: number;
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

interface SeriesProps {
  series: {
    id: number;
    title: string;
    description: string;
    created_at: string;
    user: User;
    lectures: LectureProps[];
    lecture_count: number;
  };
}

interface LectureProps {
  lectures: {
    id: number;
    lecture_url: string;
    thumbnail_url: string;
    title: string;
    description: string;
    stream: string;
    subject: string;
    standard: string;
    asset_sel: string;
    rating: number;
    visibility: boolean;
    is_verified: boolean;
    series: number;
  };
}

interface IndividualLectureProps {
  id: number;
  lecture_url: string;
  thumbnail_url: string;
  title: string;
  description: string;
  stream: string;
  subject: string;
  standard: string;
  user: User;
  asset_sel: string | null;
  rating: number;
  visibility: boolean;
  is_verified: boolean;
  series: number;
}