import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export interface SuspensionStatus {
  isSuspended: boolean;
  suspendedUntil?: string;
  suspensionReason?: string;
}

export async function checkUserSuspension(userId: string): Promise<SuspensionStatus> {
  try {
    if (!userId) return { isSuspended: false };
    
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return { isSuspended: false };
    }
    
    const userData = userSnap.data();
    const suspendedUntil = userData.suspendedUntil;
    
    if (!suspendedUntil) {
      return { isSuspended: false };
    }
    
    const now = new Date();
    const suspensionEnd = new Date(suspendedUntil);
    
    if (now < suspensionEnd) {
      return {
        isSuspended: true,
        suspendedUntil,
        suspensionReason: userData.suspensionReason || "Usuário suspenso"
      };
    } else {
      // Suspension expired, clean it up
      return { isSuspended: false };
    }
  } catch (error) {
    console.error("Erro ao verificar suspensão do usuário:", error);
    return { isSuspended: false };
  }
}

export function isUserSuspended(suspensionStatus: SuspensionStatus): boolean {
  return suspensionStatus.isSuspended;
}
