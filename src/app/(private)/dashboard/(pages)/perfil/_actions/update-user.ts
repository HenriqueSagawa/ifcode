'use server'

import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { UserData } from '@/types/userData'
import { revalidatePath } from 'next/cache'

export async function updateUserProfile(userData: UserData) {
    try {
        
        if (!userData.id) {
            throw new Error('User ID is required to update the profile.');
        }

        const userRef = doc(db, 'users', userData.id);

        const updateData: any = {
            updatedAt: new Date().toISOString(),
        }

        if (userData.name !== undefined) updateData.name = userData.name
        if (userData.email !== undefined) updateData.email = userData.email
        if (userData.bio !== undefined) updateData.bio = userData.bio
        if (userData.birthDate !== undefined) updateData.birthDate = userData.birthDate
        if (userData.github !== undefined) updateData.github = userData.github
        if (userData.phone !== undefined) updateData.phone = userData.phone
        if (userData.skills !== undefined) updateData.skills = userData.skills
        if (userData.image !== undefined) updateData.image = userData.image
        if (userData.bannerImage !== undefined) updateData.bannerImage = userData.bannerImage


        await updateDoc(userRef, updateData)

        revalidatePath('/dashboard/perfil')

        return { 
            success: true, 
            message: 'Perfil atualizado com sucesso!', 
            data: { userData } 
        }
    } catch (error) {
        console.error('❌ Erro ao atualizar perfil:', error)
        return {
            success: false,
            message: 'Erro ao atualizar perfil. Tente novamente mais tarde.',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        }
    }
}

export async function updateProfileImage(userId: string, imageUrl: string) {
    try {
        if (!userId) {
            throw new Error('User ID é obrigatório')
        }
        
        if (!imageUrl) {
            throw new Error('URL da imagem é obrigatória')
        }

        const userRef = doc(db, 'users', userId);
        
        const docSnap = await getDoc(userRef)
        
        if (!docSnap.exists()) {
            await setDoc(userRef, {
                id: userId,
                image: imageUrl,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
        } else {
            await updateDoc(userRef, {
                image: imageUrl,
                updatedAt: new Date().toISOString(),
            })
        }

        revalidatePath('/dashboard/perfil');
        
        return {
            success: true,
            message: 'Imagem de perfil atualizada com sucesso!'
        };
    } catch (error) {
        console.error('❌ Erro detalhado ao atualizar imagem de perfil:')
        console.error('Error name:', error instanceof Error ? error.name : 'Unknown')
        console.error('Error message:', error instanceof Error ? error.message : error)
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
        
        return {
            success: false,
            message: `Erro ao atualizar imagem de perfil: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        };
    }
}

export async function updateBannerImage(userId: string, imageUrl: string) {
    try {
        
        if (!userId) {
            throw new Error('User ID é obrigatório')
        }
        
        if (!imageUrl) {
            throw new Error('URL da imagem é obrigatória')
        }

        const userRef = doc(db, 'users', userId);
        
        const docSnap = await getDoc(userRef)

        if (!docSnap.exists()) {
            await setDoc(userRef, {
                id: userId,
                bannerImage: imageUrl,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
        } else {
            await updateDoc(userRef, {
                bannerImage: imageUrl,
                updatedAt: new Date().toISOString(),
            });
        }
        
        revalidatePath('/dashboard/perfil');
        
        return {
            success: true,
            message: 'Imagem de banner atualizada com sucesso!'
        };
    } catch (error) {
        console.error('❌ Erro detalhado ao atualizar imagem de banner:')
        console.error('Error name:', error instanceof Error ? error.name : 'Unknown')
        console.error('Error message:', error instanceof Error ? error.message : error)
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
        
        return {
            success: false,
            message: `Erro ao atualizar imagem de banner: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        };
    }
}