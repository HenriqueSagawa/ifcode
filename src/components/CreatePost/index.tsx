import React, { useRef, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Code,
  ImageIcon,
  Send,
  Trash2
} from "lucide-react";
import { addToast } from '@heroui/toast';

type PostType = 'Artigo' | 'Tutorial' | 'Pergunta' | 'Discussão' | 'Projeto';

// Note: We're removing the zod and hookform imports, and implementing a simpler form approach
// since those libraries appear to be causing issues and aren't available

interface CreatePostProps {
  id: string | number;
  email: string;
  author: string;
  userImage: string;
}

export function CreatePost({ id, email, author, userImage }: CreatePostProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    codeContent: '',
    codeLenguage: '',
    type: 'Artigo' as PostType, // Default to 'Artigo' to match the PostsPage component
  });

  // Simple validation function
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Esse campo é obrigatório";
    }
    
    if (!formData.content.trim()) {
      newErrors.content = "Esse campo é obrigatório";
    }
    
    if (selectedImages.length > 5) {
      newErrors.images = "Máximo de 5 imagens permitidas";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);

      const imagesUrls = await Promise.all(
        (selectedImages || []).map(uploadToCloudinary)
      );

      const finalPostData = {
        ...formData,
        idUser: id,
        emailUser: email,
        images: imagesUrls,
        author: author,
        userImage: userImage,
      }

      const response = await fetch("/api/posts", {
        method: 'POST',
        body: JSON.stringify(finalPostData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const dataResponse = await response.json();

      if (!response.ok) {
        throw new Error(dataResponse.error || "Erro ao cadastrar postagem");
      }

      // Since addToast might not be available, use a simple alert
      addToast({
        title: "Publicado com sucesso",
        description: "Suas publicação foi enviada e já pode ser visualizada",
        color: "success",
        variant: "bordered"
      })

      // Reset form
      setFormData({
        title: '',
        content: '',
        codeContent: '',
        codeLenguage: '',
        type: 'Artigo',
      });
      setSelectedImages([]);

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Ocorreu um erro ao enviar a postagem.");
    } finally {
      setLoading(false);
    }
  }

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao fazer upload da mensagem");
    }

    const data = await response.json();
    return data.secure_url;
  }
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      setSelectedImages(prevImages => [...prevImages, ...newImages]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setSelectedImages(prevImages =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Simple spinner component
  const Spinner = () => <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Criar Nova Publicação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="post-title">Título</Label>
            <Input
              id="post-title"
              name="title"
              placeholder="Digite o título da sua publicação"
              className="mt-1"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          <div>
            <Label>Conteúdo</Label>
            <Textarea
              name="content"
              placeholder="Escreva o conteúdo da sua publicação aqui..."
              className="min-h-32 mt-2"
              value={formData.content}
              onChange={handleChange}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content}</p>
            )}
          </div>

          <div className="mt-4">
            <Label className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Código (Opcional)
            </Label>
            <div className="mt-2">
              <Select
                value={formData.codeLenguage}
                onValueChange={(value) => handleSelectChange('codeLenguage', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a linguagem do código" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="c#">C#</SelectItem>
                  <SelectItem value="c++">C++</SelectItem>
                  <SelectItem value="php">PHP</SelectItem>
                  <SelectItem value="ruby">Ruby</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="other">Outra</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              name="codeContent"
              placeholder="Cole ou digite seu código aqui..."
              className="min-h-32 mt-2 font-mono"
              value={formData.codeContent}
              onChange={handleChange}
            />
          </div>

          <div className="mt-4">
            <Label className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Imagens (Opcional)
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center mt-2">
              <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">
                Selecione uma ou mais imagens
              </p>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={triggerFileInput}
              >
                Selecionar Imagens
              </Button>
            </div>

            {selectedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      type="button"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {errors.images && (
              <p className="text-red-500 text-sm">{errors.images}</p>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="w-1/3">
              <Label htmlFor="post-type">Tipo de Publicação</Label>
              <Select 
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger id="post-type" className="mt-1">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Artigo">Artigo</SelectItem>
                  <SelectItem value="Tutorial">Tutorial</SelectItem>
                  <SelectItem value="Pergunta">Pergunta</SelectItem>
                  <SelectItem value="Discussão">Discussão</SelectItem>
                  <SelectItem value="Projeto">Projeto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              {!loading ? (
                <Button type="submit" className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Publicar
                </Button>
              ) : (
                <Button disabled className="flex items-center gap-2">
                  <Spinner />
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}