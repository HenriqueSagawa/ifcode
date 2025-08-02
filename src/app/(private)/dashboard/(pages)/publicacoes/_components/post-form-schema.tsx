import { z } from "zod"

export const postFormSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(100, "Título deve ter no máximo 100 caracteres"),
  
  type: z.enum(["article", "question", "project", "tutorial", "discussion"], {
    required_error: "Tipo de post é obrigatório",
    invalid_type_error: "Tipo de post inválido"
  }),
  
  content: z
    .string()
    .min(1, "Conteúdo é obrigatório")
    .min(10, "Conteúdo deve ter pelo menos 10 caracteres")
    .max(5000, "Conteúdo deve ter no máximo 5000 caracteres"),
  
  programmingLanguage: z
    .string()
    .min(1, "Linguagem de programação é obrigatória"),
  
  codeSnippet: z
    .string()
    .optional(),
  
  imagesUrls: z
    .array(z.string().url("URL da imagem inválida"))
    .max(5, "Máximo de 5 imagens permitidas")
    .optional()
    .default([])
})

export type PostFormData = z.infer<typeof postFormSchema>