import { Timestamp } from "firebase/firestore";

export interface CommentData {
  id: string;
  postId: string;
  userId: string;
  authorName: string;
  authorImage?: string | null;
  content: string;
  createdAt: Timestamp;
}