// Indica que este é um Client Component no Next.js App Router.
// Necessário para uso de hooks como useState, useEffect e interações do lado do cliente.
'use client'

import { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react'; // Ícone de "joinha"
import { db } from '@/services/firebaseConnection'; // Instância do Firestore Database
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'; // Funções do Firestore para manipulação de documentos
import { addToast } from '@heroui/toast'; // Função para exibir notificações (toasts)

/**
 * @interface LikeButtonProps
 * @description Define as propriedades esperadas pelo componente LikeButton.
 */
interface LikeButtonProps {
    /**
     * @prop {string} postId - O ID único do post ao qual este botão de like pertence.
     */
    postId: string;
    /**
     * @prop {string} userId - O ID único do usuário atualmente logado.
     * Essencial para registrar quem curtiu o post. Se não fornecido ou vazio,
     * o usuário não poderá curtir.
     */
    userId: string;
    /**
     * @prop {string[]} initialLikes - Um array contendo os IDs dos usuários que já curtiram este post.
     * Usado para inicializar o estado de "curtido" e a contagem de likes.
     */
    initialLikes: string[];
    /**
     * @prop {(newLikes: string[]) => void} [onLikeChange] - Callback opcional que é chamado
     * quando o estado de like do post é alterado com sucesso.
     * Recebe o novo array de IDs de usuários que curtiram o post.
     */
    onLikeChange?: (newLikes: string[]) => void;
}

/**
 * @file LikeButton.tsx - Componente de Botão de Like/Unlike para Posts.
 * @module components/LikeButton
 *
 * @description
 * O componente `LikeButton` permite que os usuários curtam ou descurtam um post.
 * Ele gerencia o estado local de "curtido" e a contagem de likes, e sincroniza essas
 * informações com o Firestore Database.
 *
 * Funcionalidades:
 * - Exibe um ícone de "joinha" e a contagem atual de likes.
 * - Permite ao usuário logado clicar para curtir ou descurtir.
 * - Atualiza o estado visual imediatamente (otimismo) e depois persiste no Firestore.
 * - Desabilita o botão durante a operação de atualização.
 * - Exibe toasts de sucesso ou erro.
 * - Pode notificar um componente pai sobre a mudança no estado de likes através da prop `onLikeChange`.
 *
 * @param {LikeButtonProps} props - As propriedades do componente.
 * @returns {JSX.Element} Um botão interativo para curtir/descurtir posts.
 *
 * @example
 * <LikeButton
 *   postId="post123"
 *   userId="userABC"
 *   initialLikes={["userXYZ", "userDEF"]}
 *   onLikeChange={(updatedLikes) => console.log("Likes atualizados:", updatedLikes)}
 * />
 */
export function LikeButton({ postId, userId, initialLikes, onLikeChange }: LikeButtonProps) {
    // Estado para controlar se o usuário atual curtiu o post.
    const [isLiked, setIsLiked] = useState(false);
    // Estado para armazenar e exibir a contagem de likes do post.
    const [likesCount, setLikesCount] = useState(initialLikes.length);
    // Estado para controlar o carregamento durante a operação de like/unlike, desabilitando o botão.
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Efeito para inicializar o estado do botão (isLiked e likesCount)
     * baseado nas props `initialLikes` e `userId`.
     * Este efeito é executado quando o componente é montado e sempre que
     * `initialLikes` ou `userId` mudarem.
     */
    useEffect(() => {
        setIsLiked(initialLikes.includes(userId));
        setLikesCount(initialLikes.length);
    }, [initialLikes, userId]); // Dependências do efeito

    /**
     * @function handleLike
     * @description Lida com o clique no botão de like/unlike.
     * Verifica se o usuário está logado, atualiza o estado local de forma otimista,
     * envia a atualização para o Firestore e, em caso de sucesso, chama o callback `onLikeChange`.
     * Exibe toasts para feedback ao usuário.
     * Em caso de erro, reverte as alterações locais e exibe um toast de erro.
     */
    const handleLike = async () => {
        // Impede a ação se o usuário não estiver logado.
        if (!userId) {
            addToast({
                title: "Erro de Autenticação",
                description: "Você precisa estar logado para curtir ou descurtir posts.",
                color: "warning"
            });
            return;
        }

        // Previne múltiplos cliques enquanto uma operação está em andamento.
        if (isLoading) return;

        try {
            setIsLoading(true); // Inicia o estado de carregamento.
            const postRef = doc(db, "posts", postId); // Referência ao documento do post no Firestore.
            const newIsLiked = !isLiked; // Determina o novo estado de "curtido".

            // Atualização Otimista da UI:
            // Modifica o estado local imediatamente para dar feedback rápido ao usuário.
            setIsLiked(newIsLiked);
            setLikesCount(prevCount => newIsLiked ? prevCount + 1 : prevCount - 1);

            // Persistência no Firestore:
            // Atualiza o array 'likes' no documento do post.
            // arrayUnion adiciona o userId se não existir.
            // arrayRemove remove o userId se existir.
            await updateDoc(postRef, {
                likes: newIsLiked
                    ? arrayUnion(userId)
                    {/* COMENTÁRIO: Se curtiu, adiciona o ID do usuário ao array 'likes'. */}
                    : arrayRemove(userId)
                    {/* COMENTÁRIO: Se descurtiu, remove o ID do usuário do array 'likes'. */}
            });

            // Notifica o componente pai sobre a mudança, se o callback foi fornecido.
            if (onLikeChange) {
                const newLikesArray = newIsLiked
                    ? [...initialLikes, userId] // Adiciona o userId ao array de likes atual.
                    : initialLikes.filter(id => id !== userId); // Remove o userId do array de likes.
                onLikeChange(newLikesArray);
            }

            // Feedback de sucesso ao usuário.
            addToast({
                title: newIsLiked ? "Post Curtido!" : "Curtida Removida",
                description: newIsLiked
                    ? "Obrigado pelo seu feedback!"
                    : "Sua curtida foi removida deste post.",
                color: "success"
            });

        } catch (error) {
            console.error("Erro ao atualizar curtida:", error);

            // Reversão da UI em caso de erro na persistência:
            // Desfaz as alterações otimistas se a operação no Firestore falhar.
            setIsLiked(isLiked); // Volta ao estado anterior de 'isLiked'.
            setLikesCount(prevCount => newIsLiked ? prevCount - 1 : prevCount + 1); // Ajusta a contagem de volta.

            // Feedback de erro ao usuário.
            addToast({
                title: "Erro na Operação",
                description: "Não foi possível atualizar sua curtida no momento. Tente novamente mais tarde.",
                color: "danger"
            });
        } finally {
            setIsLoading(false); // Finaliza o estado de carregamento, independentemente do resultado.
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={isLoading} // Desabilita o botão durante o carregamento.
            // Classes de estilização condicional para o estado 'curtido' e 'hover'.
            className={`flex items-center gap-1 transition-colors duration-150 ease-in-out ${
                isLiked
                    ? 'text-primary hover:text-primary/80 dark:text-primary-dark dark:hover:text-primary-dark/80' // Estilo quando curtido
                    : 'text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-dark' // Estilo quando não curtido
            }`}
            aria-pressed={isLiked} // Para acessibilidade, indica se o botão está "pressionado" (curtido).
            aria-label={isLiked ? "Descurtir post" : "Curtir post"} // Rótulo acessível que muda com o estado.
        >
            <ThumbsUp
                // Classes para preencher o ícone quando 'isLiked' é verdadeiro.
                className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`}
                size={16} // Tamanho do ícone.
            />
            {/* Exibe a contagem de likes. */}
            <span className="text-sm font-medium">{likesCount}</span>
        </button>
    );
}