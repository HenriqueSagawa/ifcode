'use server'

import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore"
import { revalidatePath } from "next/cache"
import { postFormSchema, type PostFormData } from "../_components/post-form-schema"
import { db } from "@/lib/firebase"

// Função para fazer upload de uma imagem para o Cloudinary
export async function uploadImage(formData: FormData) {
    try {
        // Construir URL base dinamicamente
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                       (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
        
        const response = await fetch(`${baseUrl}/api/upload`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || data.message || 'Erro ao fazer upload da imagem');
        }

        return {
            success: true,
            url: data.secure_url || data.url // Cloudinary retorna secure_url
        };
    } catch (error) {
        console.error('Erro no upload:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Erro desconhecido no upload'
        };
    }
}

// Função para fazer upload de múltiplas imagens
async function uploadMultipleImages(imageFiles: File[]): Promise<{
    success: boolean;
    urls?: string[];
    failedUploads?: number;
    message?: string;
}> {
    if (imageFiles.length === 0) {
        return { success: true, urls: [] };
    }

    console.log(`Iniciando upload de ${imageFiles.length} imagem(ns)...`);

    const uploadPromises = imageFiles.map(async (file, index) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const result = await uploadImage(formData);
            
            if (result.success && result.url) {
                console.log(`Upload ${index + 1}/${imageFiles.length} concluído: ${result.url}`);
                return { success: true, url: result.url, index };
            } else {
                console.error(`Erro no upload da imagem ${index + 1}:`, result.message);
                return { success: false, error: result.message, index };
            }
        } catch (error) {
            console.error(`Erro inesperado no upload da imagem ${index + 1}:`, error);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Erro desconhecido', 
                index 
            };
        }
    });

    try {
        const results = await Promise.allSettled(uploadPromises);
        const successfulUploads: string[] = [];
        let failedUploads = 0;

        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value.success) {
                successfulUploads.push(result.value.url);
            } else {
                failedUploads++;
                console.error(`Upload ${index + 1} falhou:`, 
                    result.status === 'fulfilled' ? result.value.error : result.reason
                );
            }
        });

        if (successfulUploads.length === 0 && imageFiles.length > 0) {
            return {
                success: false,
                message: 'Todas as imagens falharam no upload. Verifique a conexão e tente novamente.',
                failedUploads
            };
        }

        if (failedUploads > 0) {
            return {
                success: true,
                urls: successfulUploads,
                failedUploads,
                message: `${successfulUploads.length} imagem(ns) enviada(s) com sucesso. ${failedUploads} falhou(aram).`
            };
        }

        return {
            success: true,
            urls: successfulUploads,
            message: `${successfulUploads.length} imagem(ns) enviada(s) com sucesso.`
        };

    } catch (error) {
        console.error('Erro no processo de upload das imagens:', error);
        return {
            success: false,
            message: 'Erro inesperado durante o upload das imagens.'
        };
    }
}

export async function createPost(formData: FormData) {
    try {
        // Extrair dados do FormData
        const title = formData.get('title') as string
        const content = formData.get('content') as string
        const type = formData.get('type') as string
        const programmingLanguage = formData.get('programmingLanguage') as string
        const codeSnippet = formData.get('codeSnippet') as string
        const userId = formData.get('userId') as string
        const imageCount = parseInt(formData.get('imageCount') as string) || 0

        // Extrair arquivos de imagem
        const imageFiles: File[] = []
        for (let i = 0; i < imageCount; i++) {
            const file = formData.get(`image_${i}`) as File
            if (file && file.size > 0) {
                imageFiles.push(file)
            }
        }

        // Criar objeto para validação com Zod
        const postData: PostFormData = {
            title,
            content,
            type: type as PostFormData['type'],
            programmingLanguage,
            codeSnippet,
            imagesUrls: [] // Será preenchido após upload
        }

        // Validação com Zod
        const validation = postFormSchema.safeParse(postData)

        if (!validation.success) {
            console.error('Erro de validação:', validation.error.flatten().fieldErrors)
            return {
                success: false,
                errors: validation.error.flatten().fieldErrors,
                message: "Dados do formulário inválidos"
            }
        }

        const validatedData = validation.data

        console.log("Criando post para o usuário:", userId)
        console.log("Dados do post:", { title, type, programmingLanguage })
        console.log("Imagens recebidas:", imageFiles.length)
        
        let imageUrls: string[] = []
        let uploadMessage = ''

        // 1. Primeiro, fazer upload das imagens se existirem
        if (imageFiles.length > 0) {
            console.log(`Processando ${imageFiles.length} imagem(ns)...`)
            
            const uploadResult = await uploadMultipleImages(imageFiles)
            
            if (!uploadResult.success) {
                console.error('Falha no upload das imagens:', uploadResult.message)
                return {
                    success: false,
                    message: uploadResult.message || 'Erro no upload das imagens',
                    errors: {}
                }
            }
            
            imageUrls = uploadResult.urls || []
            uploadMessage = uploadResult.message || ''
            
            console.log(`Upload concluído. ${imageUrls.length} URL(s) obtida(s):`, imageUrls)
        }

        // 2. Criar documento no Firestore com as URLs das imagens
        const docRef = doc(collection(db, "posts"))
        
        const postDataToSave = {
            id: docRef.id,
            title: validatedData.title,
            type: validatedData.type,
            content: validatedData.content,
            programmingLanguage: validatedData.programmingLanguage,
            codeSnippet: validatedData.codeSnippet || "",
            imagesUrls: imageUrls,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            likes: 0,
            userId: userId,
            status: "published"
        }

        console.log('Salvando post no Firestore:', { id: docRef.id, imagesCount: imageUrls.length })
        await setDoc(docRef, postDataToSave)

        revalidatePath("/dashboard/publicacoes")

        // Mensagem de sucesso personalizada
        let successMessage = "Post criado com sucesso!"
        if (imageFiles.length > 0) {
            successMessage = `Post criado com sucesso! ${uploadMessage}`
        }

        console.log('Post criado com sucesso:', docRef.id)

        return {
            success: true,
            message: successMessage,
            postId: docRef.id,
            uploadedImages: imageUrls.length
        }

    } catch (error) {
        console.error("Erro ao criar post:", error)
        
        return {
            success: false,
            message: "Erro inesperado ao criar post. Tente novamente mais tarde.",
            errors: {}
        }
    }
}