"use server";

import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  increment,
  updateDoc,
  runTransaction,
  getDoc,
} from "firebase/firestore";
import { createLikeNotification, getUserDetails, getPostDetails } from "@/actions/notifications";

export async function toggleLike(postId: string, userId: string) {
  if (!postId || !userId) {
    throw new Error("PostId e UserId são obrigatórios");
  }

  console.log("Toggling like for post:", postId, "by user:", userId);

  try {
    const result = await runTransaction(db, async (transaction) => {
      const likesRef = collection(db, "likes");
      const q = query(likesRef, where("postId", "==", postId), where("userId", "==", userId));
      const snapshot = await getDocs(q);

      const postRef = doc(db, "posts", postId);

      if (snapshot.empty) {
        // Curtir - criar novo documento de like
        const newLikeRef = doc(collection(db, "likes"));
        transaction.set(newLikeRef, {
          postId,
          userId,
          createdAt: new Date(),
        });

        transaction.update(postRef, {
          likes: increment(1),
        });

        return { liked: true, shouldCreateNotification: true };
      } else {
        transaction.delete(snapshot.docs[0].ref);

        transaction.update(postRef, {
          likes: increment(-1),
        });

        return { liked: false, shouldCreateNotification: false };
      }
    });

    if (result.shouldCreateNotification) {
      try {
        const [userDetails, postDetails] = await Promise.all([
          getUserDetails(userId),
          getPostDetails(postId)
        ]);

        if (userDetails && postDetails && postDetails.ownerId !== userId) {
          await createLikeNotification({
            postId,
            postOwnerId: postDetails.ownerId,
            postTitle: postDetails.title,
            postImage: postDetails.image,
            actionUserId: userId,
            actionUserName: userDetails.name,
            actionUserAvatar: userDetails.avatar
          });
          
          console.log("Notificação de curtida criada com sucesso");
        }
      } catch (notificationError) {
        console.error("Erro ao criar notificação de curtida:", notificationError);
      }
    }

    return { liked: result.liked };
  } catch (error) {
    console.error("Erro ao alternar curtida:", error);
    throw new Error("Falha ao processar curtida");
  }
}

export async function checkIfLiked(postId: string, userId: string) {
  if (!postId || !userId) {
    return false;
  }

  try {
    const q = query(
      collection(db, "likes"), 
      where("postId", "==", postId), 
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error("Erro ao verificar curtida:", error);
    return false;
  }
}

export async function getPostStats(postId: string) {
  if (!postId) {
    return { likes: 0, isLiked: false };
  }

  try {
    const postRef = doc(db, "posts", postId);
    const likesRef = collection(db, "likes");
    const q = query(likesRef, where("postId", "==", postId));
    
    const [postDoc, likesSnapshot] = await Promise.all([
      getDocs(query(collection(db, "posts"), where("__name__", "==", postId))),
      getDocs(q)
    ]);

    const likes = postDoc.docs[0]?.data()?.likes || likesSnapshot.size;

    return {
      likes,
      likesCount: likesSnapshot.size
    };
  } catch (error) {
    console.error("Erro ao obter estatísticas do post:", error);
    return { likes: 0, likesCount: 0 };
  }
}