export interface UserData {
    id?: string;
    name: string;
    email: string;
    bio?: string;
    birthDate?: string;
    createdAt?: string;
    github?: string;
    phone?: string;
    image?: string;
    bannerImage?: string;
    skills?: string[];
    role?: "user" | "moderator" | "admin" | "superadmin";
  }