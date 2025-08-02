// src/app/api/upload/route.ts

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: "Nenhum arquivo enviado" },
                { status: 400 }
            );
        }

        // Validar tipo de arquivo
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Tipo de arquivo não suportado. Use JPEG, PNG, WebP ou GIF" },
                { status: 400 }
            );
        }

        // Validar tamanho (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "Arquivo muito grande. Máximo 5MB" },
                { status: 400 }
            );
        }

        console.log(`Fazendo upload de: ${file.name} (${file.size} bytes)`);

        // Converter o arquivo para buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload para o Cloudinary
        const result = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    folder: "ifcode-posts", // Pasta específica para posts
                    transformation: [
                        { quality: "auto:good" }, // Otimização automática
                        { fetch_format: "auto" }  // Formato automático
                    ]
                },
                (error, result) => {
                    if (error) {
                        console.error("Erro no Cloudinary:", error);
                        reject(error);
                    } else {
                        console.log("Upload concluído:", result?.secure_url);
                        resolve(result);
                    }
                }
            ).end(buffer);
        });

        // Retornar resposta padronizada
        return NextResponse.json({
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes
        });

    } catch (error) {
        console.error("Erro no upload:", error);
        
        // Retornar erro padronizado
        return NextResponse.json(
            { 
                error: "Erro interno no servidor durante o upload",
                message: error instanceof Error ? error.message : "Erro desconhecido"
            },
            { status: 500 }
        );
    }
}