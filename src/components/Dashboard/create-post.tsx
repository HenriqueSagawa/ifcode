// Diretiva do Next.js para Client Component, necessária para useState e interações do formulário.
"use client";

import { useState } from "react"; // Hook do React para gerenciar o estado do componente.
// Importações de componentes UI (presumivelmente Shadcn/ui ou similar)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Componentes para interface de abas
// Importações de ícones da biblioteca lucide-react
import { ImageIcon, Code, Send } from "lucide-react";

/**
 * Componente que renderiza um formulário para criar novas publicações,
 * utilizando uma interface de abas (Tabs) para alternar entre os modos
 * de entrada de conteúdo: Texto, Código e Imagem.
 *
 * NOTA: Esta é uma versão simplificada. A lógica de envio real,
 * manipulação de upload de imagens e seleção de linguagem de código
 * precisam ser implementadas na função `handleSubmit`.
 *
 * @component
 * @returns {JSX.Element} O elemento JSX do formulário de criação de postagem com abas.
 */
export function CreatePost() {
  // Estado para armazenar o título da publicação.
  const [postTitle, setPostTitle] = useState("");
  // Estado para armazenar o conteúdo principal (texto ou código, dependendo da aba selecionada).
  // NOTA: A aba de imagem atualmente não interage com este estado ou implementa upload.
  const [postContent, setPostContent] = useState("");
  // Estado para armazenar o tipo de publicação selecionado (ex: 'article', 'tutorial').
  const [postType, setPostType] = useState("article"); // Valor inicial 'article'

  /**
   * Manipulador para o evento `onSubmit` do formulário.
   * Atualmente, apenas previne o comportamento padrão, exibe os dados
   * do estado no console e limpa os campos de título e conteúdo.
   * A lógica real de envio para uma API precisa ser adicionada aqui.
   *
   * @param {React.FormEvent} e - O evento de submit do formulário.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento da página
    // TODO: Implementar a lógica de envio para a API.
    // Isso incluiria coletar dados das abas (incluindo linguagem do código se selecionada,
    // e URLs das imagens se o upload for implementado).
    console.log("Dados do post a serem enviados (simulação):", {
      title: postTitle,
      content: postContent, // O conteúdo atual (texto ou código)
      type: postType,
      // Adicionar aqui: linguagem do código, URLs das imagens, etc.
    });

    // Limpa o formulário após a submissão (simulada)
    setPostTitle("");
    setPostContent("");
    // O tipo pode ou não ser resetado dependendo da preferência
    // setPostType("article");
  };

  // Renderização do JSX do componente
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Criar Nova Publicação</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Formulário principal */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Título */}
          <div>
            <Label htmlFor="post-title">Título</Label>
            <Input
              id="post-title"
              placeholder="Digite o título da sua publicação"
              value={postTitle} // Controlado pelo estado postTitle
              onChange={(e) => setPostTitle(e.target.value)} // Atualiza o estado ao digitar
              className="mt-1"
              required // Marca como obrigatório (validação básica HTML)
            />
          </div>

          {/* Seção de Conteúdo com Abas */}
          <div>
            <Label>Conteúdo</Label>
            {/* Componente Tabs para alternar entre modos de entrada */}
            <Tabs defaultValue="text" className="w-full mt-2">
              {/* Lista de botões/gatilhos das abas */}
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

              {/* Conteúdo da Aba "Texto" */}
              <TabsContent value="text" className="mt-2">
                <Textarea
                  placeholder="Escreva o conteúdo da sua publicação aqui..."
                  value={postContent} // Controlado pelo estado postContent
                  onChange={(e) => setPostContent(e.target.value)} // Atualiza o estado
                  className="min-h-32"
                  required // Marca como obrigatório (validação básica HTML)
                />
              </TabsContent>

              {/* Conteúdo da Aba "Código" */}
              <TabsContent value="code" className="mt-2">
                <Textarea
                  placeholder="Cole ou escreva seu código aqui..."
                  // NOTA: Atualmente usa o *mesmo* estado `postContent` da aba Texto.
                  // Pode ser necessário um estado separado para o código, dependendo da lógica final.
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="min-h-32 font-mono" // Estilo monoespaçado para código
                />
                {/* Seletor de Linguagem */}
                <div className="mt-2">
                  <Label htmlFor="language" className="text-sm">Linguagem (Opcional)</Label>
                  {/* NOTA: Este Select atualmente não está conectado a nenhum estado.
                      Seu valor precisaria ser armazenado e enviado no handleSubmit. */}
                  <Select>
                    <SelectTrigger id="language" className="w-full mt-1">
                      <SelectValue placeholder="Selecione a linguagem" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Lista de linguagens */}
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="csharp">C#</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="php">PHP</SelectItem>
                      <SelectItem value="ruby">Ruby</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                       <SelectItem value="html">HTML</SelectItem>
                       <SelectItem value="css">CSS</SelectItem>
                       <SelectItem value="sql">SQL</SelectItem>
                       <SelectItem value="bash">Bash/Shell</SelectItem>
                      <SelectItem value="other">Outra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              {/* Conteúdo da Aba "Imagem" */}
              <TabsContent value="image" className="mt-2">
                {/* Placeholder visual para upload de imagem */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Arraste e solte uma imagem aqui ou clique para selecionar</p>
                  {/* Botão para acionar o input de arquivo (lógica não implementada) */}
                  <Button variant="outline" size="sm" type="button">Selecionar Imagem</Button>
                </div>
                {/* Input de arquivo oculto (lógica de upload não implementada) */}
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden" // Mantém o input funcionalmente, mas invisível
                  id="image-upload"
                  // TODO: Adicionar um handler onChange para capturar o arquivo
                />
                {/* TODO: Adicionar preview da imagem selecionada e lógica de upload */}
              </TabsContent>
            </Tabs>
          </div>

          {/* Linha inferior com Tipo de Publicação e Botão de Publicar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4"> {/* Adicionado padding top e gap */}
            {/* Seletor Tipo de Publicação */}
            <div className="w-full sm:w-1/3"> {/* Ajustado width para responsividade */}
              <Label htmlFor="post-type">Tipo de Publicação</Label>
              <Select value={postType} onValueChange={setPostType}> {/* Conectado ao estado postType */}
                <SelectTrigger id="post-type" className="mt-1">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {/* Opções de tipo de postagem */}
                  <SelectItem value="article">Artigo</SelectItem>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                  <SelectItem value="question">Pergunta</SelectItem>
                  <SelectItem value="discussion">Discussão</SelectItem>
                  <SelectItem value="project">Projeto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botão Publicar */}
            <div className="w-full sm:w-auto"> {/* Ajustado width para responsividade */}
               <Button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2"> {/* Centraliza conteúdo no mobile */}
                 <Send className="h-4 w-4" />
                 Publicar
               </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}