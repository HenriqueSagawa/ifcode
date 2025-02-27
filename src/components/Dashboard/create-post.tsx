// components/dashboard/create-post.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Code, Send, FileUp } from "lucide-react";

export function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("artigo");
  const [contentType, setContentType] = useState("texto");
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica para publicar o post
    console.log({ title, content, postType, contentType, fileName });
    
    // Reset do formulário
    setTitle("");
    setContent("");
    setPostType("artigo");
    setContentType("texto");
    setFileName(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Criar Nova Publicação</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título do Post */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              Título
            </Label>
            <Input
              id="title"
              placeholder="Digite o título da sua publicação"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5"
              required
            />
          </div>

          {/* Tipo de Post e Upload de Imagem em uma linha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postType" className="text-sm font-medium">
                Tipo de Publicação
              </Label>
              <Select 
                value={postType} 
                onValueChange={setPostType}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="artigo">Artigo</SelectItem>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                  <SelectItem value="pergunta">Pergunta</SelectItem>
                  <SelectItem value="discussao">Discussão</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="image" className="text-sm font-medium">
                Anexar Imagem
              </Label>
              <div className="mt-1.5 relative">
                <label
                  htmlFor="image-upload" 
                  className="cursor-pointer flex items-center justify-between w-full px-3 py-2 border rounded-md bg-background hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground truncate">
                      {fileName || "Selecione uma imagem"}
                    </span>
                  </div>
                  <Button type="button" variant="ghost" size="sm" className="h-8">
                    <Image className="h-4 w-4" />
                  </Button>
                </label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          {/* Tabs para Conteúdo */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-sm font-medium">Conteúdo</Label>
              <Tabs 
                value={contentType} 
                onValueChange={setContentType} 
                className="w-auto"
              >
                <TabsList className="h-8 p-0.5">
                  <TabsTrigger 
                    value="texto" 
                    className="text-xs px-3 h-7"
                  >
                    Texto
                  </TabsTrigger>
                  <TabsTrigger 
                    value="codigo" 
                    className="text-xs px-3 h-7 flex items-center gap-1"
                  >
                    <Code className="h-3.5 w-3.5" />
                    Código
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="min-h-40">
              {contentType === "texto" ? (
                <Textarea
                  placeholder="Escreva o conteúdo da sua publicação aqui..."
                  className="min-h-40 resize-y"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              ) : (
                <Textarea
                  placeholder="// Cole ou escreva seu código aqui..."
                  className="min-h-40 resize-y font-mono"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              )}
            </div>
          </div>

          {/* Botão de Publicar */}
          <div className="flex justify-end">
            <Button type="submit" className="gap-2">
              <Send className="h-4 w-4" />
              Publicar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}