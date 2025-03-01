"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, Code, Send } from "lucide-react";

export function CreatePost() {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState("article");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar funcionalidade para publicar o post
    console.log({
      title: postTitle,
      content: postContent,
      type: postType
    });
    
    // Limpar formulário após envio
    setPostTitle("");
    setPostContent("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Criar Nova Publicação</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="post-title">Título</Label>
            <Input
              id="post-title"
              placeholder="Digite o título da sua publicação"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Conteúdo</Label>
            <Tabs defaultValue="text" className="w-full mt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="text">Texto</TabsTrigger>
                <TabsTrigger value="code">
                  <Code className="h-4 w-4 mr-1" />
                  Código
                </TabsTrigger>
                <TabsTrigger value="image">
                  <ImageIcon className="h-4 w-4 mr-1" />
                  Imagem
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="mt-2">
                <Textarea
                  placeholder="Escreva o conteúdo da sua publicação aqui..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="min-h-32"
                />
              </TabsContent>
              
              <TabsContent value="code" className="mt-2">
                <Textarea
                  placeholder="Cole ou escreva seu código aqui..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="min-h-32 font-mono"
                />
                <div className="mt-2">
                  <Label htmlFor="language" className="text-sm">Linguagem</Label>
                  <Select>
                    <SelectTrigger id="language" className="w-full mt-1">
                      <SelectValue placeholder="Selecione a linguagem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="csharp">C#</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="php">PHP</SelectItem>
                      <SelectItem value="ruby">Ruby</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                      <SelectItem value="other">Outra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="image" className="mt-2">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Arraste e solte uma imagem aqui ou clique para selecionar</p>
                  <Button variant="outline" size="sm">Selecionar Imagem</Button>
                </div>
                <Input 
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  id="image-upload"
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="w-1/3">
              <Label htmlFor="post-type">Tipo de Publicação</Label>
              <Select value={postType} onValueChange={setPostType}>
                <SelectTrigger id="post-type" className="mt-1">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Artigo</SelectItem>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                  <SelectItem value="question">Pergunta</SelectItem>
                  <SelectItem value="discussion">Discussão</SelectItem>
                  <SelectItem value="project">Projeto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Publicar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}