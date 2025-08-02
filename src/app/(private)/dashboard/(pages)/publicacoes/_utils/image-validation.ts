export function validateImageFiles(files: File[]): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxFiles = 5;

    if (files.length > maxFiles) {
        errors.push(`Máximo de ${maxFiles} imagens permitidas`);
    }

    files.forEach((file, index) => {
        if (!allowedTypes.includes(file.type)) {
            errors.push(`Imagem ${index + 1}: Tipo não suportado. Use JPEG, PNG, WebP ou GIF`);
        }
        
        if (file.size > maxSize) {
            errors.push(`Imagem ${index + 1}: Tamanho muito grande. Máximo 5MB`);
        }
    });

    return {
        valid: errors.length === 0,
        errors
    };
}

// Função para converter File para base64 (útil para previews)
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Função para redimensionar imagem (opcional, para otimizar uploads)
export function resizeImage(file: File, maxWidth: number = 1920, maxHeight: number = 1080, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            // Calcular novas dimensões mantendo aspect ratio
            let { width, height } = img;
            
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            
            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Desenhar imagem redimensionada
            ctx?.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob((blob) => {
                if (blob) {
                    const resizedFile = new File([blob], file.name, {
                        type: file.type,
                        lastModified: Date.now()
                    });
                    resolve(resizedFile);
                } else {
                    resolve(file); // Fallback para arquivo original
                }
            }, file.type, quality);
        };
        
        img.src = URL.createObjectURL(file);
    });
}