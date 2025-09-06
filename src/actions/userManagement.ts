"use server";

import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, query, collection, where, getDocs } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Buscar usuário por email
export async function searchUserByEmail(email: string): Promise<{
  success: boolean;
  message: string;
  user?: any;
}> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return { success: false, message: "Usuário não autenticado" };
    }

    // Verificar se o usuário tem permissão para gerenciar usuários
    const currentUserDoc = await getDoc(doc(db, "users", session.user.id));
    const currentUserData = currentUserDoc.data();
    
    if (!currentUserData || (currentUserData.role !== "admin" && currentUserData.role !== "superadmin")) {
      return { success: false, message: "Acesso negado. Apenas administradores podem gerenciar usuários" };
    }

    // Buscar usuário por email
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: false, message: "Usuário não encontrado" };
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    return {
      success: true,
      message: "Usuário encontrado",
      user: {
        id: userDoc.id,
        name: userData.name,
        email: userData.email,
        role: userData.role || "user",
        image: userData.image,
        createdAt: userData.createdAt
      }
    };
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return { success: false, message: "Erro interno do servidor" };
  }
}

// Promover usuário a administrador
export async function promoteUserToAdmin(userId: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return { success: false, message: "Usuário não autenticado" };
    }

    // Verificar se o usuário atual tem permissão
    const currentUserDoc = await getDoc(doc(db, "users", session.user.id));
    const currentUserData = currentUserDoc.data();
    
    if (!currentUserData || (currentUserData.role !== "admin" && currentUserData.role !== "superadmin")) {
      return { success: false, message: "Acesso negado. Apenas administradores podem promover usuários" };
    }

    // Buscar o usuário a ser promovido
    const targetUserDoc = await getDoc(doc(db, "users", userId));
    if (!targetUserDoc.exists()) {
      return { success: false, message: "Usuário não encontrado" };
    }

    const targetUserData = targetUserDoc.data();

    // Verificar se o usuário alvo é superadmin (não pode ser modificado)
    if (targetUserData.role === "superadmin") {
      return { success: false, message: "Não é possível modificar um super administrador" };
    }

    // Verificar se o usuário atual é superadmin ou se o alvo não é superadmin
    if (currentUserData.role !== "superadmin" && targetUserData.role === "superadmin") {
      return { success: false, message: "Apenas super administradores podem modificar outros super administradores" };
    }

    // Promover o usuário
    await updateDoc(doc(db, "users", userId), {
      role: "admin",
      updatedAt: new Date().toISOString()
    });

    return { 
      success: true, 
      message: `Usuário ${targetUserData.name} foi promovido a administrador com sucesso` 
    };
  } catch (error) {
    console.error("Erro ao promover usuário:", error);
    return { success: false, message: "Erro interno do servidor" };
  }
}

// Remover privilégios de administrador
export async function demoteUserFromAdmin(userId: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return { success: false, message: "Usuário não autenticado" };
    }

    // Verificar se o usuário atual é superadmin
    const currentUserDoc = await getDoc(doc(db, "users", session.user.id));
    const currentUserData = currentUserDoc.data();
    
    if (!currentUserData || currentUserData.role !== "superadmin") {
      return { success: false, message: "Acesso negado. Apenas super administradores podem remover privilégios de admin" };
    }

    // Buscar o usuário a ser rebaixado
    const targetUserDoc = await getDoc(doc(db, "users", userId));
    if (!targetUserDoc.exists()) {
      return { success: false, message: "Usuário não encontrado" };
    }

    const targetUserData = targetUserDoc.data();

    // Verificar se o usuário alvo é superadmin (não pode ser modificado)
    if (targetUserData.role === "superadmin") {
      return { success: false, message: "Não é possível modificar um super administrador" };
    }

    // Rebaixar o usuário
    await updateDoc(doc(db, "users", userId), {
      role: "user",
      updatedAt: new Date().toISOString()
    });

    return { 
      success: true, 
      message: `Privilégios de administrador removidos de ${targetUserData.name}` 
    };
  } catch (error) {
    console.error("Erro ao rebaixar usuário:", error);
    return { success: false, message: "Erro interno do servidor" };
  }
}

// Listar todos os administradores
export async function listAdministrators(): Promise<{
  success: boolean;
  message: string;
  administrators?: any[];
}> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return { success: false, message: "Usuário não autenticado" };
    }

    // Verificar se o usuário tem permissão
    const currentUserDoc = await getDoc(doc(db, "users", session.user.id));
    const currentUserData = currentUserDoc.data();
    
    if (!currentUserData || (currentUserData.role !== "admin" && currentUserData.role !== "superadmin")) {
      return { success: false, message: "Acesso negado. Apenas administradores podem listar outros administradores" };
    }

    // Buscar todos os usuários com role admin ou superadmin
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "in", ["admin", "superadmin"]));
    const querySnapshot = await getDocs(q);
    
    const administrators = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      message: "Administradores listados com sucesso",
      administrators
    };
  } catch (error) {
    console.error("Erro ao listar administradores:", error);
    return { success: false, message: "Erro interno do servidor" };
  }
}
