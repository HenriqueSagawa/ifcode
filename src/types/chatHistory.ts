export interface ChatHistory {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  role: "user" | "model";
  content: string;
  timestamp: Date;
}
