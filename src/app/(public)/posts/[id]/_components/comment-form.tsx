"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"

interface CommentFormProps {
  onAddComment: (content: string) => void;
  userImage: string;
}

export const CommentForm = ({ onAddComment, userImage }: CommentFormProps) => {
  const [newComment, setNewComment] = useState("")

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment)
      setNewComment("")
    }
  }

  return (
    <div className="mb-8 p-6 bg-gray-900/50 rounded-lg border border-gray-800">
      <div className="flex gap-4">
        <Avatar className="w-10 h-10 ring-2 ring-gray-700">
          <AvatarImage src={userImage} alt="Você" />
          <AvatarFallback className="bg-gray-800 text-green-400 font-semibold">VC</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Compartilhe sua opinião ou faça uma pergunta..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 resize-none min-h-[100px] mb-4 focus:border-green-500"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!newComment.trim()}
              className="bg-green-600 hover:bg-green-700 text-black font-medium px-6"
            >
              Publicar Comentário
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}