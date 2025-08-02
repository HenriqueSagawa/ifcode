export async function uploadImage(formData: FormData) {
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erro ao fazer upload da imagem');
        }

        return {
            success: true,
            url: data.url
        };
    } catch (error) {
        console.error('Erro no upload:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Erro desconhecido no upload'
        };
    }
}