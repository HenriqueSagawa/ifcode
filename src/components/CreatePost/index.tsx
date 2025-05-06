import React, { useRef, useState } from 'react';
// Importações de componentes UI (presumivelmente Shadcn/ui ou similar)
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
// Importações de ícones da biblioteca lucide-react
import {
  Code,
  ImageIcon,
  Send,
  Trash2
} from "lucide-react";
// Importação da função para exibir notificações toast
import { addToast } from '@heroui/toast';

// Define os tipos possíveis para uma publicação.
type PostType = 'Artigo' | 'Tutorial' | 'Pergunta' | 'Discussão' | 'Projeto';

// Interface para as propriedades esperadas pelo componente CreatePost.
interface CreatePostProps {
  id: string | number; // ID do usuário que está criando o post.
  email: string;       // Email do usuário.
  author: string;      // Nome do autor/usuário.
  userImage: string;   // URL da imagem de perfil do usuário.
}

/**
 * Componente que renderiza um formulário dentro de um Card para criar novas publicações.
 * Permite ao usuário inserir título, conteúdo, código (opcional), imagens (opcional),
 * selecionar o tipo de postagem e enviar para a API.
 * Inclui validação básica, upload de imagens para uma API separada, e feedback visual (loading, erros, sucesso).
 *
 * @component
 * @param {CreatePostProps} props - Propriedades contendo informações do usuário logado.
 * @returns {JSX.Element} O elemento JSX do formulário de criação de postagem.
 */
export function CreatePost({ id, email, author, userImage }: CreatePostProps) {
  // Estado para armazenar os arquivos de imagem selecionados pelo usuário.
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  // Estado para controlar o estado de carregamento durante o envio do formulário.
  const [loading, setLoading] = useState(false);
  // Estado para armazenar mensagens de erro de validação do formulário.
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Estado para armazenar os dados dos campos do formulário.
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    codeContent: '', // Conteúdo do bloco de código (opcional)
    codeLenguage: '', // Linguagem selecionada para o bloco de código
    type: 'Artigo' as PostType, // Tipo da postagem, default 'Artigo'
  });

  /**
   * Valida os campos obrigatórios do formulário (título, conteúdo) e o limite de imagens.
   * Atualiza o estado `errors` com as mensagens de erro apropriadas.
   * @returns {boolean} Retorna `true` se o formulário for válido, `false` caso contrário.
   */
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Esse campo é obrigatório";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Esse campo é obrigatório";
    }

    if (selectedImages.length > 5) {
      newErrors.images = "Máximo de 5 imagens permitidas";
    }

    setErrors(newErrors); // Atualiza o estado de erros
    return Object.keys(newErrors).length === 0; // Retorna true se não houver erros
  };

  /**
   * Manipulador genérico para o evento `onChange` dos inputs e textareas.
   * Atualiza a propriedade correspondente no estado `formData`.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - O evento de mudança.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value // Atualiza a chave 'name' com o novo 'value'
    }));
    // Limpa o erro do campo específico ao começar a digitar nele
    if (errors[name]) {
        setErrors(prev => ({...prev, [name]: ''}));
    }
  };

  /**
   * Manipulador específico para o evento `onValueChange` dos componentes Select.
   * Atualiza a propriedade correspondente no estado `formData`.
   * @param {string} name - O nome do campo (chave no estado `formData`).
   * @param {string} value - O novo valor selecionado.
   */
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Manipulador para o evento `onSubmit` do formulário.
   * Valida o formulário. Se válido:
   * 1. Define o estado de carregamento (`loading`).
   * 2. Faz upload das imagens selecionadas (se houver) para a API `/api/upload`.
   * 3. Monta o objeto final `finalPostData` com dados do formulário, URLs das imagens e informações do usuário.
   * 4. Envia `finalPostData` para a API `/api/posts`.
   * 5. Trata a resposta da API (sucesso ou erro).
   * 6. Exibe uma notificação toast em caso de sucesso.
   * 7. Reseta o formulário e o estado de loading.
   * 8. Exibe um alerta em caso de erro.
   * @async
   * @param {React.FormEvent} e - O evento de submit.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne recarregamento da página

    // Valida o formulário antes de prosseguir
    if (!validateForm()) {
      addToast({ title: "Erro de Validação", description: "Por favor, corrija os campos indicados.", color: "danger"});
      return;
    }

    try {
      setLoading(true); // Ativa o estado de carregamento

      // Faz upload das imagens para o servidor (usando a API /api/upload) em paralelo.
      const imagesUrls = await Promise.all(
        (selectedImages || []).map(uploadFile) // Renomeado para uploadFile para clareza
      );

      // Monta o objeto de dados final para enviar à API de posts.
      const finalPostData = {
        ...formData,
        idUser: id, // Adiciona ID do usuário
        emailUser: email, // Adiciona email do usuário
        images: imagesUrls, // Adiciona array de URLs das imagens (pode estar vazio)
        author: author, // Adiciona nome do autor
        userImage: userImage, // Adiciona imagem do usuário
      };

      // Envia os dados para a API de criação de posts.
      const response = await fetch("/api/posts", {
        method: 'POST',
        body: JSON.stringify(finalPostData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const dataResponse = await response.json(); // Lê a resposta JSON

      // Verifica se a resposta da API foi bem-sucedida.
      if (!response.ok) {
        // Lança um erro com a mensagem da API ou uma mensagem padrão.
        throw new Error(dataResponse.error || "Erro ao cadastrar postagem");
      }

      // Exibe notificação de sucesso.
      addToast({
        title: "Publicado com sucesso",
        description: "Sua publicação foi enviada e já pode ser visualizada",
        color: "success",
        variant: "bordered"
      });

      // Reseta os campos do formulário e as imagens selecionadas.
      setFormData({
        title: '',
        content: '',
        codeContent: '',
        codeLenguage: '',
        type: 'Artigo',
      });
      setSelectedImages([]);
      setErrors({}); // Limpa os erros

    } catch (error: any) {
      // Trata erros (de upload ou da API de posts).
      console.error("Erro no handleSubmit:", error);
      // Exibe um alerta (ou poderia ser um toast de erro).
      addToast({
        title: "Erro ao Publicar",
        description: error.message || "Ocorreu um erro inesperado.",
        color: "danger",
      });
    } finally {
      // Garante que o estado de carregamento seja desativado, mesmo se ocorrer erro.
      setLoading(false);
    }
  };

  /**
   * Função auxiliar para fazer upload de um único arquivo para a API `/api/upload`.
   * @async
   * @param {File} file - O arquivo a ser enviado.
   * @returns {Promise<string>} Uma Promise que resolve com a URL segura do arquivo após o upload.
   * @throws {Error} Lança um erro se o upload falhar.
   */
  const uploadFile = async (file: File): Promise<string> => {
    // Cria um objeto FormData para enviar o arquivo.
    const formData = new FormData();
    formData.append('file', file); // Anexa o arquivo ao FormData

    // Faz a requisição POST para a API de upload.
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData // Envia o FormData no corpo da requisição
    });

    // Verifica se o upload foi bem-sucedido.
    if (!response.ok) {
      const errorData = await response.json();
      // Lança um erro com a mensagem da API ou uma mensagem padrão.
      throw new Error(errorData.error || "Erro ao fazer upload da imagem");
    }

    // Extrai a URL segura da resposta JSON.
    const data = await response.json();
    return data.secure_url; // Retorna a URL da imagem hospedada
  };

  // Ref para o input de arquivo (usado para acioná-lo programaticamente).
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Manipulador para o evento `onChange` do input de arquivo.
   * Adiciona os novos arquivos selecionados ao estado `selectedImages`.
   * @param {React.ChangeEvent<HTMLInputElement>} event - O evento de mudança do input de arquivo.
   */
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      // Concatena as novas imagens com as já existentes no estado.
      setSelectedImages(prevImages => {
        const updatedImages = [...prevImages, ...newImages];
        // Valida novamente o limite de imagens após adicionar
        if (updatedImages.length > 5) {
            setErrors(prev => ({...prev, images: "Máximo de 5 imagens permitidas"}));
            addToast({title:"Limite Excedido", description: "Você pode selecionar no máximo 5 imagens.", color:"warning"});
            return prevImages; // Retorna o array anterior se o limite for excedido
        } else {
             setErrors(prev => ({...prev, images: ''})); // Limpa erro de imagem se estiver dentro do limite
             return updatedImages;
        }
      });
    }
  };

  /**
   * Remove uma imagem da lista `selectedImages` com base no seu índice.
   * @param {number} indexToRemove - O índice da imagem a ser removida.
   */
  const removeImage = (indexToRemove: number) => {
    setSelectedImages(prevImages => {
        const updatedImages = prevImages.filter((_, index) => index !== indexToRemove);
        // Limpa o erro de imagem se a remoção colocar abaixo do limite
        if (updatedImages.length <= 5 && errors.images) {
             setErrors(prev => ({...prev, images: ''}));
        }
        return updatedImages;
    });
  };

  /**
   * Aciona programaticamente o clique no input de arquivo oculto.
   */
  const triggerFileInput = () => {
    fileInputRef.current?.click(); // Simula um clique no input file
  };

  /**
   * Componente simples para exibir um spinner de carregamento.
   * @returns {JSX.Element} O elemento JSX do spinner.
   */
  const Spinner = () => <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>;

  // Renderização do JSX do componente
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Criar Nova Publicação
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Formulário principal */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Título */}
          <div>
            <Label htmlFor="post-title">Título</Label>
            <Input
              id="post-title"
              name="title" // Corresponde à chave em `formData`
              placeholder="Digite o título da sua publicação"
              className="mt-1"
              value={formData.title} // Controlado pelo estado
              onChange={handleChange} // Handler para atualização
            />
            {/* Exibe erro de validação, se houver */}
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Campo Conteúdo */}
          <div>
            <Label htmlFor="post-content">Conteúdo</Label> {/* Adicionado htmlFor */}
            <Textarea
              id="post-content" // Adicionado id
              name="content"
              placeholder="Escreva o conteúdo da sua publicação aqui..."
              className="min-h-32 mt-1" // Ajustado margin
              value={formData.content}
              onChange={handleChange}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
          </div>

          {/* Seção Código (Opcional) */}
          <div className="mt-4">
            <Label className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Código (Opcional)
            </Label>
            {/* Seletor de Linguagem */}
            <div className="mt-2">
              <Select
                value={formData.codeLenguage}
                // Usa handleSelectChange para atualizar o estado
                onValueChange={(value) => handleSelectChange('codeLenguage', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a linguagem do código" />
                </SelectTrigger>
                <SelectContent>
                  {/* Lista de linguagens disponíveis */}
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem> {/* Ajustado valor */}
                  <SelectItem value="cpp">C++</SelectItem>   {/* Ajustado valor */}
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
            {/* Textarea para o Código */}
            <Textarea
              name="codeContent"
              placeholder="Cole ou digite seu código aqui..."
              className="min-h-32 mt-2 font-mono" // `font-mono` para estilo de código
              value={formData.codeContent}
              onChange={handleChange}
            />
          </div>

          {/* Seção Imagens (Opcional) */}
          <div className="mt-4">
            <Label className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Imagens (Opcional, máx. 5)
            </Label>
            {/* Área de Dropzone/Seleção */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center mt-2 text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Arraste e solte ou clique para selecionar imagens
              </p>
              {/* Input de arquivo oculto */}
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*" // Aceita qualquer tipo de imagem
                multiple // Permite seleção múltipla
                onChange={handleImageUpload} // Handler para seleção
                className="hidden" // Oculta o input padrão
                id="image-upload"
              />
              {/* Botão que aciona o input de arquivo */}
              <Button
                variant="outline"
                size="sm"
                type="button" // Impede o submit do formulário
                onClick={triggerFileInput} // Aciona o input oculto
              >
                Selecionar Imagens
              </Button>
            </div>

            {/* Preview das Imagens Selecionadas */}
            {selectedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    {/* Exibe a imagem usando URL.createObjectURL */}
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border" // Adicionado border
                      // Revoga a URL do objeto quando a imagem não é mais necessária (boa prática)
                      onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                    />
                    {/* Botão para remover a imagem */}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-80 group-hover:opacity-100 transition-opacity" // Estilo e efeito hover
                      type="button"
                      onClick={() => removeImage(index)} // Chama a função de remoção
                      aria-label="Remover imagem"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {/* Exibe erro de validação de imagem, se houver */}
            {errors.images && (
              <p className="text-red-500 text-sm mt-1">{errors.images}</p>
            )}
          </div>

          {/* Linha inferior com Tipo de Publicação e Botão de Publicar */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
             {/* Seletor Tipo de Publicação */}
            <div className="w-full sm:w-1/3">
              <Label htmlFor="post-type">Tipo de Publicação</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value as PostType)}
              >
                <SelectTrigger id="post-type" className="mt-1">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {/* Opções de tipo de postagem */}
                  <SelectItem value="Artigo">Artigo</SelectItem>
                  <SelectItem value="Tutorial">Tutorial</SelectItem>
                  <SelectItem value="Pergunta">Pergunta</SelectItem>
                  <SelectItem value="Discussão">Discussão</SelectItem>
                  <SelectItem value="Projeto">Projeto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botão Publicar / Loading */}
            <div className='w-full sm:w-auto'>
              {/* Renderização condicional: Botão normal ou botão de loading */}
              {!loading ? (
                // Botão padrão de Publicar
                <Button type="submit" className="w-full sm:w-auto flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Publicar
                </Button>
              ) : (
                // Botão desabilitado com Spinner durante o carregamento
                <Button disabled className="w-full sm:w-auto flex items-center gap-2">
                  <Spinner />
                  Publicando...
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}