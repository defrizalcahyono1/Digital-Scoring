export interface Profile {
  id: number;
  full_name: string;
  username: string;
  email: string;
  role: string;
  photo: string | null;
  created_at: string;
  updated_at: string;
}


export interface UpdateProfilePayload {
  full_name: string;
  username: string;
  email: string;
  photo?: File | null;
}