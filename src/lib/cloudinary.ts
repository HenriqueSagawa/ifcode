export async function upload(formData: FormData) {
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erro ao fazer upload da imagem');
        }

        return data.url;
    } catch (error) {
        console.error('Erro no upload:', error);
        throw error;
    }
} 