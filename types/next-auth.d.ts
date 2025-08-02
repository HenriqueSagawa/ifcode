import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: User & DefaultSession["user"]
    }
}

interface User {
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
    fullData?: any;
    skills?: string[];
}