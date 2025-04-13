'use client';

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatMessage } from "@/services/gemini/chat.service";
import ReactMarkdown from "react-markdown";

interface MessageProps {
  message: ChatMessage;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2 mb-4`}>
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      
      <Card className={`max-w-[80%] p-3 ${isUser ? "bg-muted" : "bg-muted/50"}`}>
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-invert max-w-none dark:prose-invert">
            <ReactMarkdown>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </Card>

      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://github.com/shadcn.png" alt="Usuário" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
} 