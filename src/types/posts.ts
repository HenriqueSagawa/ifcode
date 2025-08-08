export type postType = "article" | "question" | "project" | "tutorial" | "discussion";
type postStatus = "published" | "archived" | "deleted";

export interface PostProps {
    id?: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    type: postType;
    programmingLanguage: string;
    codeSnippet: string;
    imagesUrls: string[];
    likes: number;
    userId: string;
    status: postStatus;
}

export type commentStatus  = "accepted" | "rejected" | "pending";

export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    likes: number;
    isLiked: boolean;
    userId: string;
    receivedUserId?: string;
    status: commentStatus;
  }

export interface NewPost {
    title: string
    content: string
    type: postType
    language: string
    code: string
    images: string[]
  }