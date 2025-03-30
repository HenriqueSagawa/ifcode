'use client'

import { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { db } from '@/services/firebaseConnection';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { addToast } from '@heroui/toast';

interface LikeButtonProps {
    postId: string;
    userId: string;
    initialLikes: string[];
    onLikeChange?: (newLikes: string[]) => void;
}

export function LikeButton({ postId, userId, initialLikes, onLikeChange }: LikeButtonProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(initialLikes.length);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLiked(initialLikes.includes(userId));
        setLikesCount(initialLikes.length);
    }, [initialLikes, userId]);

    const handleLike = async () => {
        if (!userId) {
            addToast({
                title: "Erro",
                description: "Você precisa estar logado para curtir posts.",
                color: "warning"
            });
            return;
        }

        try {
            setIsLoading(true);
            const postRef = doc(db, "posts", postId);
            const newIsLiked = !isLiked;

            // Atualiza o estado local imediatamente para feedback visual
            setIsLiked(newIsLiked);
            setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);

            // Atualiza no Firestore
            await updateDoc(postRef, {
                likes: newIsLiked 
                    ? arrayUnion(userId)
                    : arrayRemove(userId)
            });

            // Notifica o componente pai sobre a mudança
            if (onLikeChange) {
                const newLikes = newIsLiked 
                    ? [...initialLikes, userId]
                    : initialLikes.filter(id => id !== userId);
                onLikeChange(newLikes);
            }

            addToast({
                title: newIsLiked ? "Post curtido" : "Post descurtido",
                description: newIsLiked 
                    ? "Você curtiu este post!"
                    : "Você removeu sua curtida deste post.",
                color: "success"
            });
        } catch (error) {
            console.error("Error updating like:", error);
            // Reverte as mudanças em caso de erro
            setIsLiked(!isLiked);
            setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
            addToast({
                title: "Erro",
                description: "Não foi possível atualizar sua curtida. Tente novamente.",
                color: "danger"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={isLoading}
            className={`flex items-center gap-1 transition-colors ${
                isLiked 
                    ? 'text-primary hover:text-primary/80' 
                    : 'hover:text-primary'
            }`}
        >
            <ThumbsUp 
                className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} 
                size={16}
            />
            <span className="text-sm">{likesCount}</span>
        </button>
    );
} 