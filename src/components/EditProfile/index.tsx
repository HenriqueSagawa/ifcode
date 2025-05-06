// Diretiva do Next.js para Client Component, necessária para useState, useRef, e interações do usuário/modal.
"use client";

// Importações de Componentes e Hooks
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure, // Hook do HeroUI para controlar o estado de abertura do Modal
} from "@heroui/modal";
import { Mail, Phone, User, Pencil, Github, Plus, X, Upload } from "lucide-react"; // Ícones
import { addToast } from "@heroui/toast"; // Para exibir notificações
import { Button } from "@heroui/button"; // Componente Botão do HeroUI
import { Input, Textarea } from "@heroui/input"; // Componentes Input/Textarea do HeroUI
import { useState, useRef } from "react"; // Hooks do React para estado e referências
import { doc, updateDoc } from "firebase/firestore"; // Funções do Firestore para referenciar e atualizar documentos
import { db } from "@/services/firebaseConnection"; // Instância do Firestore inicializada

/**
 * Interface que define a estrutura dos dados do usuário.
 * Usada tanto para receber os dados iniciais quanto para gerenciar o estado do formulário.
 * @typedef {object} userDataProps
 * @property {string} [id] - ID único do usuário no Firestore (essencial para atualização).
 * @property {string} [name] - Nome do usuário.
 * @property {string} [email] - Email do usuário.
 * @property {string} [phone] - Telefone do usuário (opcional).
 * @property {string} [github] - Link ou nome de usuário do GitHub (opcional).
 * @property {string} [bio] - Biografia curta do usuário (opcional).
 * @property {string[]} [skills] - Array de strings representando as habilidades do usuário (opcional).
 * @property {string} [profileImage] - URL da imagem de perfil atual (opcional).
 * @property {string} [bannerImage] - URL da imagem de banner/capa atual (opcional).
 */
interface userDataProps {
    id?: string; // Essencial para saber qual documento atualizar
    name?: string;
    email?: string;
    phone?: string;
    github?: string;
    bio?: string;
    skills?: string[];
    profileImage?: string;
    bannerImage?: string;
}

/**
 * Componente que fornece um botão para abrir um Modal (Dialog)
 * permitindo ao usuário editar suas informações de perfil.
 * Inclui campos para nome, email, telefone, GitHub, bio, skills (com adição/remoção)
 * e upload de imagens de perfil e banner. Salva as alterações no Firestore.
 *
 * @component
 * @param {{ user: userDataProps }} props - Props contendo os dados atuais do usuário.
 * @returns {JSX.Element} Retorna um botão que abre o modal de edição.
 */
export function EditProfile({ user }: { user: userDataProps }) {
    // Hook do HeroUI para controlar o estado de abertura/fechamento do Modal.
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    // Estado para armazenar os dados do formulário durante a edição.
    // Inicializado com os dados do usuário recebidos via props.
    const [formData, setFormData] = useState<userDataProps>({
        name: user?.name || "",
        email: user?.email || "", // Geralmente email não é editável, mas mantido aqui conforme código
        phone: user?.phone || "",
        github: user?.github || "",
        bio: user?.bio || "",
        skills: user?.skills || [], // Inicializa com array vazio se não houver skills
        profileImage: user?.profileImage || "",
        bannerImage: user?.bannerImage || ""
    });

    // Refs para acessar os inputs de arquivo ocultos programaticamente.
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);

    // Estados para armazenar os *novos* arquivos selecionados para upload.
    const [bannerFile, setBannerFile] = useState<File | null>(null); // Para a nova imagem de banner
    const [photoFile, setPhotoFile] = useState<File | null>(null);   // Para a nova imagem de perfil

    // Estados para controle de feedback durante o salvamento.
    const [isLoading, setIsLoading] = useState(false); // Indica se o processo de salvar está em andamento
    const [error, setError] = useState<string | null>(null); // Armazena mensagens de erro

    // Estado específico para gerenciar a lista de skills exibida e o input de nova skill.
    const [skills, setSkills] = useState<string[]>(user?.skills || []); // Lista de skills atual
    const [newSkill, setNewSkill] = useState(""); // Valor do input para adicionar nova skill

    /**
     * Manipulador genérico para atualizações nos campos de input e textarea (exceto arquivos e skills).
     * Atualiza o estado `formData` com o novo valor do campo modificado.
     * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - O evento de mudança.
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * Manipulador para o input de arquivo do banner.
     * Atualiza o estado `bannerFile` com o arquivo selecionado.
     * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança do input de arquivo.
     */
    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setBannerFile(e.target.files[0]);
        }
    };

    /**
     * Manipulador para o input de arquivo da foto de perfil.
     * Atualiza o estado `photoFile` com o arquivo selecionado.
     * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança do input de arquivo.
     */
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPhotoFile(e.target.files[0]);
        }
    };

    /**
     * Adiciona uma nova skill à lista de skills se ela não estiver vazia e não existir ainda.
     * Atualiza tanto o estado `skills` (para UI) quanto `formData.skills` (para envio).
     * Limpa o input `newSkill` após adicionar.
     */
    const addSkill = () => {
        const trimmedSkill = newSkill.trim();
        if (trimmedSkill !== "") {
            // Garante que skills seja sempre um array antes de verificar includes
            const currentSkills = Array.isArray(skills) ? skills : [];
            const skillExists = currentSkills.includes(trimmedSkill);

            if (!skillExists) {
                const updatedSkills = [...currentSkills, trimmedSkill];
                setSkills(updatedSkills); // Atualiza estado local para UI
                setFormData(prev => ({ ...prev, skills: updatedSkills })); // Atualiza formData para envio
                setNewSkill(""); // Limpa o input
            } else {
                addToast({ title: "Habilidade já adicionada", color: "warning" });
            }
        }
    };

    /**
     * Remove uma skill da lista com base no nome da skill.
     * Atualiza tanto o estado `skills` quanto `formData.skills`.
     * @param {string} skillToRemove - A skill a ser removida.
     */
    const removeSkill = (skillToRemove: string) => {
        // Garante que skills seja sempre um array
        const currentSkills = Array.isArray(skills) ? skills : [];
        const updatedSkills = currentSkills.filter(skill => skill !== skillToRemove);
        setSkills(updatedSkills); // Atualiza estado local para UI
        setFormData(prev => ({ ...prev, skills: updatedSkills })); // Atualiza formData para envio
    };

    /**
     * Função auxiliar para fazer upload de um arquivo para uma API externa (presumivelmente Cloudinary via /api/upload).
     * @async
     * @param {File} file - O arquivo a ser enviado.
     * @returns {Promise<string>} Uma Promise que resolve com a URL segura do arquivo após o upload.
     * @throws {Error} Lança um erro se o upload falhar (capturado pela API ou pela requisição).
     */
    const uploadToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file); // Nome 'file' deve corresponder ao esperado pela API /api/upload

        // Faz a requisição POST para a API de upload interna que interage com Cloudinary.
        const response = await fetch('/api/upload', { // Endpoint da sua API Next.js
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "Erro desconhecido no upload" })); // Tenta pegar erro JSON, senão erro genérico
            console.error("API Upload Error Response:", errorData);
            throw new Error(errorData.error || 'Erro ao fazer upload da imagem');
        }

        const data = await response.json();
        if (!data.secure_url) {
             throw new Error('URL segura não retornada pela API de upload.');
        }
        return data.secure_url; // Retorna a URL segura da imagem hospedada (ex: Cloudinary)
    };

    /**
     * Função principal para salvar as alterações do perfil.
     * Valida o ID do usuário, faz upload de novas imagens (se houver) para Cloudinary,
     * e atualiza o documento do usuário no Firestore com os novos dados.
     * Gerencia os estados de loading e error.
     * @async
     * @param {() => void} onClose - Função callback para fechar o modal após sucesso.
     */
    const updateUserProfile = async (onClose: () => void) => {
        // Verifica se o ID do usuário existe (necessário para referenciar o documento no Firestore).
        if (!user.id) {
            setError("Erro crítico: ID de usuário não encontrado. Não é possível salvar.");
            console.error("User ID is missing in updateUserProfile");
            return;
        }

        try {
            setIsLoading(true); // Inicia o carregamento
            setError(null); // Limpa erros anteriores

            // Cria a referência para o documento específico do usuário no Firestore.
            const userDocRef = doc(db, "users", user.id);

            // Cria um objeto para armazenar apenas os campos que serão atualizados.
            // Inclui campos de texto e a lista de skills.
            const updatedData: Record<string, any> = {
                name: formData.name,
                email: formData.email, // Cuidado ao permitir edição de email se for usado para login
                phone: formData.phone,
                github: formData.github,
                bio: formData.bio,
                skills: formData.skills // Usa a lista de skills atualizada
            };

            // Faz upload do novo banner para Cloudinary SE um novo arquivo foi selecionado.
            if (bannerFile) {
                try {
                    const bannerUrl = await uploadToCloudinary(bannerFile);
                    updatedData.bannerImage = bannerUrl; // Adiciona a URL ao objeto de atualização
                    setFormData(prev => ({...prev, bannerImage: bannerUrl})); // Atualiza preview local
                    setBannerFile(null); // Limpa o arquivo após upload
                } catch (uploadError) {
                    console.error("Erro ao fazer upload do banner:", uploadError);
                    // Define erro específico e interrompe o processo
                    setError("Falha no upload do banner. Verifique o arquivo e tente novamente.");
                    setIsLoading(false);
                    return; // Impede a atualização do Firestore se o upload falhar
                }
            }

            // Faz upload da nova foto de perfil para Cloudinary SE um novo arquivo foi selecionado.
            if (photoFile) {
                try {
                    const photoUrl = await uploadToCloudinary(photoFile);
                    updatedData.profileImage = photoUrl; // Adiciona a URL ao objeto de atualização
                     setFormData(prev => ({...prev, profileImage: photoUrl})); // Atualiza preview local
                    setPhotoFile(null); // Limpa o arquivo após upload
                } catch (uploadError) {
                    console.error("Erro ao fazer upload da foto de perfil:", uploadError);
                    // Define erro específico e interrompe o processo
                    setError("Falha no upload da foto de perfil. Verifique o arquivo e tente novamente.");
                    setIsLoading(false);
                    return; // Impede a atualização do Firestore se o upload falhar
                }
            }

            // Atualiza o documento no Firestore com os dados coletados (incluindo novas URLs de imagem, se houver).
            await updateDoc(userDocRef, updatedData);

            setIsLoading(false); // Finaliza o carregamento
            addToast({ // Exibe notificação de sucesso
                title: "Perfil Atualizado",
                description: "Suas informações foram salvas.", // Ajustado texto
                color: "success",
            });
            onClose(); // Fecha o modal

        } catch (err) {
            // Trata erros gerais (ex: erro de rede, permissão do Firestore).
            setIsLoading(false); // Garante que o loading pare em caso de erro
            const errorMessage = "Erro ao atualizar perfil: " + (err instanceof Error ? err.message : String(err));
            setError(errorMessage); // Exibe a mensagem de erro no modal
            console.error("Error updating profile in Firestore:", err);
        }
    };

    // --- Renderização do JSX ---
    return (
        <>
            {/* Botão que aciona a abertura do Modal */}
            <Button onPressEnd={onOpen} size="sm" className="bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 flex items-center gap-1">
                <Pencil className="h-4 w-4" />
                Editar perfil
            </Button>

            {/* Componente Modal do HeroUI */}
            <Modal
                backdrop="blur" // Efeito de fundo
                isOpen={isOpen} // Controlado pelo hook useDisclosure
                placement="bottom-center" // Posição do modal
                className="!max-h-[95vh] overflow-y-auto" // Permite scroll interno se conteúdo for grande
                onOpenChange={onOpenChange} // Função para fechar o modal (ex: clicando fora)
                size="2xl" // Tamanho do modal
            >
                <ModalContent>
                    {/* Função filho que recebe `onClose` para fechar o modal programaticamente */}
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Editar Perfil</ModalHeader>
                            <ModalBody>
                                {/* Exibição de mensagem de erro, se houver */}
                                {error && (
                                    <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-md mb-4 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Seção de Upload do Banner */}
                                <div className="w-full h-32 mb-6 border border-dashed rounded-lg relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    {/* Preview da imagem (nova ou existente) */}
                                    {(formData.bannerImage || bannerFile) && (
                                        <div className="absolute inset-0">
                                            {/* Usa URL.createObjectURL para preview do novo arquivo, ou a URL existente */}
                                            <img
                                                src={bannerFile ? URL.createObjectURL(bannerFile) : formData.bannerImage}
                                                alt="Banner"
                                                className="w-full h-full object-cover"
                                                // Revoga a URL temporária quando não for mais necessária (boa prática)
                                                onLoad={bannerFile ? (e) => URL.revokeObjectURL((e.target as HTMLImageElement).src) : undefined}
                                            />
                                        </div>
                                    )}
                                    {/* Overlay com botão de upload */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors duration-200">
                                        {/* Input de arquivo oculto */}
                                        <input
                                            type="file"
                                            id="banner-upload"
                                            className="hidden"
                                            accept="image/*"
                                            ref={bannerInputRef}
                                            onChange={handleBannerChange}
                                        />
                                        {/* Label que ativa o input oculto */}
                                        <label htmlFor="banner-upload" className="cursor-pointer flex flex-col items-center p-4">
                                            <Upload className="w-6 h-6 text-white" />
                                            <span className="text-sm text-white mt-1">Alterar Capa</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Seção de Upload da Foto de Perfil */}
                                <div className="flex justify-center -mt-20 mb-6"> {/* -mt para sobrepor um pouco o banner */}
                                    <div className="w-24 h-24 border-4 border-white dark:border-gray-800 rounded-full relative overflow-hidden bg-gray-200 dark:bg-gray-700">
                                         {/* Preview da imagem (nova ou existente) */}
                                        {(formData.profileImage || photoFile) && (
                                            <div className="absolute inset-0">
                                                <img
                                                    src={photoFile ? URL.createObjectURL(photoFile) : formData.profileImage}
                                                    alt="Foto de perfil"
                                                    className="w-full h-full object-cover"
                                                    onLoad={photoFile ? (e) => URL.revokeObjectURL((e.target as HTMLImageElement).src) : undefined}
                                                />
                                            </div>
                                        )}
                                         {/* Overlay com botão de upload */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors duration-200 opacity-0 hover:opacity-100">
                                            <input
                                                type="file"
                                                id="photo-upload"
                                                className="hidden"
                                                accept="image/*"
                                                ref={photoInputRef}
                                                onChange={handlePhotoChange}
                                            />
                                            <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center text-center">
                                                <Upload className="w-5 h-5 text-white" />
                                                <span className="text-xs text-white mt-1">Alterar Foto</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Campos de Texto */}
                                {/* Nome */}
                                <Input
                                    endContent={<User className="text-default-400" />}
                                    name="name"
                                    label="Nome"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    variant="bordered"
                                    className="mb-4"
                                />
                                {/* Email */}
                                <Input
                                    endContent={<Mail className="text-default-400" />}
                                    name="email"
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    variant="bordered"
                                    className="mb-4"
                                    // isReadOnly // Considerar tornar email não editável
                                />
                                {/* Telefone */}
                                <Input
                                    endContent={<Phone className="text-default-400" />}
                                    name="phone"
                                    label="Telefone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    variant="bordered"
                                    className="mb-4"
                                />
                                {/* GitHub */}
                                <Input
                                    endContent={<Github className="text-default-400" />}
                                    name="github"
                                    label="GitHub (usuário ou link)"
                                    value={formData.github}
                                    onChange={handleInputChange}
                                    variant="bordered"
                                    className="mb-4"
                                />
                                {/* Biografia */}
                                <Textarea
                                    name="bio"
                                    label="Biografia"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    variant="bordered"
                                    className="mb-4"
                                    minRows={3}
                                />

                                {/* Seção de Habilidades */}
                                <div className="mb-4">
                                    <p className="text-sm mb-2 font-medium">Habilidades</p>
                                    {/* Input e Botão para adicionar nova skill */}
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Adicionar habilidade (ex: React)"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            // Permite adicionar com Enter
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                                            variant="bordered"
                                            className="flex-1"
                                        />
                                        <Button
                                            onClick={addSkill}
                                            className="flex items-center gap-1"
                                            color="primary"
                                            type="button" // Previne submit do form ao clicar
                                        >
                                            <Plus className="w-4 h-4" />
                                            Adicionar
                                        </Button>
                                    </div>
                                    {/* Display das skills adicionadas com botão de remoção */}
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {/* Verifica se 'skills' é um array antes de mapear */}
                                        {Array.isArray(skills) && skills.map((skill, index) => (
                                            <div key={index} className="bg-gray-100 dark:bg-gray-700 text-zinc-900 dark:text-zinc-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                                                <span className="text-sm">{skill}</span>
                                                {/* Botão para remover a skill */}
                                                <button
                                                    type="button" // Previne submit do form
                                                    onClick={() => removeSkill(skill)}
                                                    className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                                                    aria-label={`Remover ${skill}`}
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                {/* Botão Cancelar */}
                                <Button color="danger" variant="flat" onPress={onClose} disabled={isLoading}>
                                    Cancelar
                                </Button>
                                {/* Botão Salvar (com estado de loading) */}
                                <Button
                                    color="primary"
                                    onClick={() => updateUserProfile(onClose)} // Chama a função de salvar
                                    disabled={isLoading} // Desabilitado durante o salvamento
                                >
                                    {/* Texto condicional indicando salvamento */}
                                    {isLoading ? "Salvando..." : "Salvar alterações"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}