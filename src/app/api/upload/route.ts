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

        // Converter o arquivo para buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload para o Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    folder: "profile-images",
                },
                (error, result) => {
                    if (error) reject(error);
                    resolve(result);
                }
            ).end(buffer);
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Erro no upload:", error);
        return NextResponse.json(
            { error: "Erro ao fazer upload da imagem" },
            { status: 500 }
        );
    }
} 