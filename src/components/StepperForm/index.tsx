// Indica que este é um Client Component no Next.js App Router.
// Necessário para hooks (useState, useEffect, useForm, useSession),
// interações do usuário, animações com Framer Motion e chamadas à API.
'use client';

import React, { useState, useEffect } from 'react';
// Importações de Next.js e NextAuth
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
// Componentes de UI da biblioteca HeroUI (ou similar)
import { Button } from '@heroui/button';
import { Input, Textarea } from '@heroui/input';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Progress } from '@heroui/progress';
import { Divider } from '@heroui/divider';
import { Spinner } from '@heroui/spinner'; // Assumindo que Spinner é da HeroUI
// Animações
import { motion, AnimatePresence } from 'framer-motion';
// Ícones
import { Github, Briefcase, Calendar, Phone, Plus, Upload } from 'lucide-react';
// Gerenciamento de formulário e validação
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/**
 * @constant formSchema
 * @description Define o esquema de validação para os dados do formulário de perfil do usuário
 *              utilizando a biblioteca Zod. Cada campo tem suas próprias regras de validação.
 */
const formSchema = z.object({
    birthDate: z.string().min(1, { message: "Data de nascimento é obrigatória." })
                // Adicionar validação de formato de data se necessário, ex: .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido (AAAA-MM-DD)")
                .refine(dateStr => !isNaN(new Date(dateStr).getTime()), { message: "Data inválida."}), // Verifica se a data é válida
    phoneNumber: z.string()
                .min(10, { message: "Número de telefone deve ter pelo menos 10 dígitos." })
                .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, { message: "Formato de telefone inválido. Use (XX) XXXXX-XXXX."}) // Exemplo de regex para formato brasileiro
                .or(z.string().length(0)), // Permite campo vazio se não for obrigatório inicialmente
    profession: z.string().min(1, { message: "Profissão é obrigatória." }),
    github: z.string().url({ message: "Por favor, insira uma URL válida para o GitHub (ex: https://github.com/usuario)." }).optional().or(z.literal('')), // Valida URL e permite opcional ou vazio
    skills: z.array(z.string().min(1, {message: "Habilidade não pode ser vazia."})).max(15, {message: "Máximo de 15 habilidades."}), // Array de strings para habilidades
    bio: z.string().max(500, {message: "Biografia deve ter no máximo 500 caracteres."}).optional(),
    profilePicture: z.any().optional(), // Validação de arquivo pode ser mais específica se necessário
    profileBanner: z.any().optional()   // Validação de arquivo pode ser mais específica se necessário
});

/**
 * @type FormSchemaType
 * @description Infere o tipo dos dados do formulário a partir do `formSchema` do Zod.
 */
type FormSchemaType = z.infer<typeof formSchema>;

// Constantes para o formulário
const TOTAL_STEPS = 4; // Número total de etapas no formulário.

/**
 * @file ProfileStepperForm.tsx - Componente de Formulário de Perfil em Etapas (Stepper).
 * @module components/ProfileStepperForm (ou o caminho apropriado)
 *
 * @description
 * O `ProfileStepperForm` é um componente multifacetado que guia o usuário através de um processo
 * de preenchimento de perfil em várias etapas. Ele utiliza `react-hook-form` para gerenciamento
 * de estado e validação com `zod`, e `framer-motion` para transições animadas entre as etapas.
 *
 * Funcionalidades Principais:
 * - Formulário dividido em 4 etapas: Informações Pessoais, Profissionais, Biografia e Mídias.
 * - Barra de progresso e navegação por etapas clicáveis.
 * - Validação de campos em tempo real e antes de avançar para a próxima etapa.
 * - Gerenciamento dinâmico de um array de "habilidades" (adição/remoção).
 * - Upload de arquivos para foto de perfil e banner com preview.
 * - Submissão final dos dados para uma API (`/api/users/update`) para atualizar o perfil do usuário.
 * - Upload de imagens para um serviço de nuvem (ex: Cloudinary) antes de salvar as URLs no perfil.
 * - Feedback visual com indicadores de carregamento (Spinner).
 * - Redirecionamento para o dashboard após a conclusão bem-sucedida.
 *
 * O componente depende da sessão do usuário (`next-auth/react`) para associar os dados ao usuário correto.
 *
 * Não recebe props diretamente, mas utiliza `useSession` para obter dados do usuário.
 *
 * @returns {JSX.Element} Um card contendo o formulário de perfil em etapas.
 */
export function ProfileStepperForm() {
    // Hooks de sessão e roteamento
    const { data: session, status: sessionStatus } = useSession();
    const router = useRouter();

    // Estados do componente
    const [currentStep, setCurrentStep] = useState<number>(1); // Etapa atual do formulário.
    const [newSkill, setNewSkill] = useState<string>(''); // Valor do input para nova habilidade.
    const [profilePreview, setProfilePreview] = useState<string | null>(null); // URL de preview da foto de perfil.
    const [bannerPreview, setBannerPreview] = useState<string | null>(null); // URL de preview do banner.
    const [loading, setLoading] = useState<boolean>(false); // Estado de carregamento durante submissões.
    const [direction, setDirection] = useState<number>(0); // Direção da animação entre etapas (1 para frente, -1 para trás).

    // Configuração do React Hook Form
    const {
        control,
        register, // Não está sendo usado diretamente, Controller é preferido para componentes de UI customizados.
        handleSubmit,
        formState: { errors, isValid }, // `isValid` pode ser usado para habilitar/desabilitar botões.
        setValue,
        getValues,
        trigger // Para validar campos programaticamente.
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: { // Valores iniciais para o formulário.
            birthDate: '',
            phoneNumber: '',
            profession: '',
            github: '',
            skills: [],
            bio: '',
            profilePicture: null,
            profileBanner: null
        },
        mode: 'onChange' // Validação ocorre a cada mudança no campo.
    });

    // Configuração do useFieldArray para gerenciar dinamicamente o campo 'skills'.
    const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
        control,
        name: 'skills'
    });

    // Calcula o valor da barra de progresso.
    const progressValue = (currentStep / TOTAL_STEPS) * 100;

    /**
     * @function addSkillToList
     * @description Adiciona uma nova habilidade à lista de habilidades do usuário,
     *              se ela não for vazia e ainda não existir na lista.
     */
    const addSkillToList = () => {
        if (newSkill.trim() && !getValues('skills').includes(newSkill.trim())) {
            appendSkill(newSkill.trim());
            setNewSkill(''); // Limpa o input da nova habilidade.
        }
        // Adicionar feedback visual se a skill já existe ou está vazia, se desejado.
    };

    /**
     * @function handleFileUpload
     * @description Processa a mudança de um input de arquivo, atualiza o estado do formulário
     *              com o arquivo selecionado e gera uma URL de preview.
     * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança do input.
     * @param {'profilePicture' | 'profileBanner'} fileType - O tipo de arquivo sendo carregado.
     */
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'profilePicture' | 'profileBanner') => {
        const file = e.target.files?.[0] || null;
        if (file) {
            // Validação básica do tipo e tamanho do arquivo (pode ser expandida)
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecione um arquivo de imagem (JPG, PNG, etc.).');
                e.target.value = ''; // Limpa o input
                return;
            }
            // Exemplo: Limitar tamanho a 5MB
            // if (file.size > 5 * 1024 * 1024) {
            //     alert('O arquivo é muito grande. O tamanho máximo é 5MB.');
            //     return;
            // }

            setValue(fileType, file, { shouldValidate: true }); // Define o valor no form e valida.

            // Limpa preview anterior para evitar memory leaks com URL.createObjectURL
            if (fileType === 'profilePicture' && profilePreview) URL.revokeObjectURL(profilePreview);
            if (fileType === 'profileBanner' && bannerPreview) URL.revokeObjectURL(bannerPreview);

            const fileUrl = URL.createObjectURL(file);
            if (fileType === 'profilePicture') {
                setProfilePreview(fileUrl);
            } else {
                setBannerPreview(fileUrl);
            }
        }
    };

    /**
     * @function proceedToNextStep
     * @description Valida os campos da etapa atual e, se válidos, avança para a próxima etapa.
     */
    const proceedToNextStep = async () => {
        let fieldsToValidate: (keyof FormSchemaType)[] = [];
        switch (currentStep) {
            case 1: fieldsToValidate = ['birthDate', 'phoneNumber']; break;
            case 2: fieldsToValidate = ['profession', 'github', 'skills']; break;
            // Etapa 3 (Bio) e 4 (Mídias) podem não ter campos obrigatórios para avançar,
            // ou a validação de arquivo acontece no `handleFileUpload`.
            // A validação final ocorre no `onSubmit`.
            default: break;
        }

        const isStepValid = fieldsToValidate.length > 0 ? await trigger(fieldsToValidate) : true;

        if (isStepValid && currentStep < TOTAL_STEPS) {
            setCurrentStep(prev => prev + 1);
            setDirection(1); // Animação para frente.
        }
    };

    /**
     * @function returnToPreviousStep
     * @description Navega para a etapa anterior do formulário.
     */
    const returnToPreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            setDirection(-1); // Animação para trás.
        }
    };

    /**
     * @function uploadImageToCloud
     * @description Faz upload de um arquivo de imagem para um serviço de nuvem (via API local).
     * @param {File | null | undefined} file - O arquivo de imagem a ser carregado.
     * @returns {Promise<string | null>} A URL da imagem carregada ou null se não houver arquivo ou erro.
     * @throws {Error} Se o upload falhar.
     */
    const uploadImageToCloud = async (file: File | null | undefined): Promise<string | null> => {
        if (!file) return null;

        const formData = new FormData();
        formData.append('file', file);
        // formData.append('upload_preset', 'seu_upload_preset_do_cloudinary'); // Exemplo para Cloudinary

        const response = await fetch("/api/upload", { // Endpoint da API local que lida com o upload para o Cloudinary.
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "Erro desconhecido no upload da imagem." }));
            console.error("Erro no upload da imagem:", errorData);
            throw new Error(errorData.error || "Falha ao fazer upload da imagem.");
        }

        const data = await response.json();
        return data.secure_url; // URL segura retornada pelo Cloudinary (ou similar).
    };

    /**
     * @function handleFormSubmit
     * @description Processa a submissão final do formulário.
     * Faz upload das imagens, formata os dados e envia para a API de atualização do usuário.
     * @param {FormSchemaType} data - Os dados validados do formulário.
     */
    const handleFormSubmit = async (data: FormSchemaType) => {
        if (!session?.user?.email) {
            console.error("Sessão do usuário ou email não encontrado.");
            // Adicionar feedback ao usuário aqui.
            return;
        }
        try {
            setLoading(true);
            // Faz upload das imagens, se fornecidas.
            const profileImageUrl = await uploadImageToCloud(data.profilePicture);
            const bannerImageUrl = await uploadImageToCloud(data.profileBanner);

            const userDataToSubmit = {
                birthDate: data.birthDate,
                phone: data.phoneNumber,
                github: data.github || null, // Envia null se vazio
                bio: data.bio || null,
                profession: data.profession,
                profileImage: profileImageUrl,
                bannerImage: bannerImageUrl,
                skills: data.skills,
                email: session.user.email // Associa os dados ao email do usuário logado.
            };

            // Chamada à API para atualizar o perfil do usuário.
            const response = await fetch("/api/users/update", {
                method: "PUT",
                body: JSON.stringify(userDataToSubmit),
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Erro desconhecido ao atualizar perfil." }));
                throw new Error(errorData.error || "Falha ao atualizar o perfil do usuário.");
            }

            // const result = await response.json(); // Dados do usuário atualizado, se necessário.
            // Adicionar toast de sucesso aqui.
            router.push("/dashboard"); // Redireciona para o dashboard.

        } catch (error: any) {
            console.error("Erro ao enviar formulário:", error);
            // Adicionar feedback de erro ao usuário (ex: toast).
            // setErrorState(error.message || "Ocorreu um erro."); // Se tiver um estado para erro geral.
        } finally {
            setLoading(false);
        }
    };

    // Variantes para animação das etapas com Framer Motion.
    const formStepVariants = {
        enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 })
    };

    /**
     * @function navigateToSpecificStep
     * @description Permite a navegação direta para uma etapa específica,
     *              validando as etapas anteriores se o usuário estiver avançando.
     * @param {number} step - O número da etapa para a qual navegar.
     */
    const navigateToSpecificStep = async (step: number) => {
        if (step === currentStep) return; // Não faz nada se já estiver na etapa.

        let canNavigate = true;
        if (step > currentStep) { // Se estiver avançando, valida as etapas intermediárias.
            for (let i = currentStep; i < step; i++) {
                let fieldsToValidate: (keyof FormSchemaType)[] = [];
                if (i === 1) fieldsToValidate = ['birthDate', 'phoneNumber'];
                else if (i === 2) fieldsToValidate = ['profession', 'github', 'skills'];
                // Adicionar validação para outras etapas se necessário.

                if (fieldsToValidate.length > 0) {
                    canNavigate = await trigger(fieldsToValidate);
                    if (!canNavigate) break; // Interrompe se uma etapa intermediária for inválida.
                }
            }
        }

        if (canNavigate) {
            setDirection(step > currentStep ? 1 : -1);
            setCurrentStep(step);
        }
    };

    // Efeito para limpar URLs de preview de objeto quando o componente é desmontado
    // ou quando os previews mudam, para evitar memory leaks.
    useEffect(() => {
        return () => {
            if (profilePreview) URL.revokeObjectURL(profilePreview);
            if (bannerPreview) URL.revokeObjectURL(bannerPreview);
        };
    }, [profilePreview, bannerPreview]);


    // Renderiza um loader enquanto a sessão está carregando.
    if (sessionStatus === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner label="Carregando perfil..." color="primary" size="lg" />
            </div>
        );
    }

    // Se não autenticado, poderia redirecionar para login ou mostrar mensagem.
    if (sessionStatus === "unauthenticated") {
        router.push("/login"); // Ou mostrar uma mensagem/componente de acesso negado.
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Você precisa estar logado para acessar esta página.</p>
            </div>
        );
    }

    // Renderização do formulário
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-100 dark:from-slate-900 dark:to-sky-900 p-4 md:p-8 flex items-center justify-center">
            <Card className="w-full max-w-2xl mx-auto shadow-2xl rounded-xl overflow-hidden"> {/* Ajustado max-w e estilo */}
                <CardHeader className="flex flex-col items-center gap-3 p-6 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <h1 className="text-2xl font-bold text-center text-slate-700 dark:text-slate-200">Complete Seu Perfil</h1>
                    {/* Barra de Progresso */}
                    <Progress
                        aria-label="Progresso do formulário"
                        value={progressValue}
                        className="w-full max-w-md mt-2"
                        color="primary"
                        showValueLabel={true}
                        size="md"
                        label={`${currentStep} de ${TOTAL_STEPS}`}
                    />
                    {/* Navegação por Etapas (Stepper Dots/Numbers) */}
                    <div className="flex justify-around w-full max-w-md mx-auto mt-4">
                        {[...Array(TOTAL_STEPS).keys()].map((_, index) => {
                            const stepNumber = index + 1;
                            const stepLabels = ['Pessoal', 'Profissional', 'Biografia', 'Mídias'];
                            return (
                                <div key={stepNumber} className="flex flex-col items-center">
                                    <Button
                                        isIconOnly
                                        variant={stepNumber === currentStep ? "solid" : "flat"}
                                        color={stepNumber === currentStep ? "primary" : stepNumber < currentStep ? "success" : "default"}
                                        className="rounded-full w-8 h-8 text-xs"
                                        size="sm"
                                        onClick={() => navigateToSpecificStep(stepNumber)}
                                        aria-label={`Ir para etapa ${stepNumber}: ${stepLabels[index]}`}
                                    >
                                        {stepNumber}
                                    </Button>
                                    <span className="text-xs mt-1 text-slate-600 dark:text-slate-400 hidden md:block">
                                        {stepLabels[index]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </CardHeader>

                <Divider className="my-0" /> {/* Remove margem padrão do Divider */}

                <CardBody className="p-6 md:p-8">
                    <form onSubmit={handleSubmit(handleFormSubmit)}>
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={currentStep} // Chave para o Framer Motion identificar a mudança de etapa.
                                custom={direction}
                                variants={formStepVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.5 }}
                                className="w-full min-h-[300px]" // Altura mínima para evitar "pulos" na UI.
                            >
                                {/* ETAPA 1: INFORMAÇÕES PESSOAIS */}
                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Informações Pessoais</h2>
                                        {/* Campo Data de Nascimento */}
                                        <Controller
                                            name="birthDate"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    label="Data de Nascimento"
                                                    type="date"
                                                    variant="bordered"
                                                    startContent={<Calendar className="w-5 h-5 text-default-400" />}
                                                    isRequired
                                                    isInvalid={!!errors.birthDate}
                                                    errorMessage={errors.birthDate?.message}
                                                    className="w-full"
                                                />
                                            )}
                                        />
                                        {/* Campo Número de Telefone */}
                                        <Controller
                                            name="phoneNumber"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    label="Número de Telefone"
                                                    type="tel"
                                                    placeholder="(XX) XXXXX-XXXX"
                                                    variant="bordered"
                                                    startContent={<Phone className="w-5 h-5 text-default-400" />}
                                                    isInvalid={!!errors.phoneNumber}
                                                    errorMessage={errors.phoneNumber?.message}
                                                    className="w-full"
                                                    // Adicionar máscara de input aqui se a lib de UI não prover
                                                />
                                            )}
                                        />
                                    </div>
                                )}

                                {/* ETAPA 2: INFORMAÇÕES PROFISSIONAIS */}
                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Informações Profissionais</h2>
                                        {/* Campo Profissão */}
                                        <Controller
                                            name="profession"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    label="Profissão / Área de Atuação"
                                                    placeholder="Ex: Desenvolvedor Web, Estudante de ADS"
                                                    variant="bordered"
                                                    startContent={<Briefcase className="w-5 h-5 text-default-400" />}
                                                    isRequired
                                                    isInvalid={!!errors.profession}
                                                    errorMessage={errors.profession?.message}
                                                    className="w-full"
                                                />
                                            )}
                                        />
                                        {/* Campo GitHub */}
                                        <Controller
                                            name="github"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    label="Link do Perfil GitHub (Opcional)"
                                                    placeholder="https://github.com/seu-usuario"
                                                    variant="bordered"
                                                    startContent={<Github className="w-5 h-5 text-default-400" />}
                                                    isInvalid={!!errors.github}
                                                    errorMessage={errors.github?.message}
                                                    className="w-full"
                                                />
                                            )}
                                        />
                                        {/* Campo Habilidades (Skills) */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                Habilidades (máx. 15)
                                            </label>
                                            <div className="flex gap-2 items-center mb-2">
                                                <Input
                                                    value={newSkill}
                                                    onChange={(e) => setNewSkill(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillToList())}
                                                    placeholder="Ex: React, Node.js, Python"
                                                    variant="bordered"
                                                    className="flex-grow"
                                                />
                                                <Button
                                                    isIconOnly
                                                    color="primary"
                                                    variant="ghost"
                                                    onClick={addSkillToList}
                                                    aria-label="Adicionar habilidade"
                                                    type="button" // Evitar submissão do form
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </Button>
                                            </div>
                                            {errors.skills && <p className="text-xs text-danger-500">{errors.skills.message || errors.skills.root?.message}</p>}
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {skillFields.map((skillItem, index) => (
                                                    <Chip
                                                        key={skillItem.id}
                                                        onClose={() => removeSkill(index)}
                                                        variant="flat"
                                                        color="secondary" // Cor diferente para destaque
                                                        size="sm"
                                                    >
                                                        {getValues(`skills.${index}`)}
                                                    </Chip>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ETAPA 3: BIOGRAFIA */}
                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Sua Biografia (Opcional)</h2>
                                        <Controller
                                            name="bio"
                                            control={control}
                                            render={({ field }) => (
                                                <Textarea
                                                    {...field}
                                                    label="Conte-nos sobre você"
                                                    placeholder="Sua jornada, paixões, o que te move no mundo da tecnologia..."
                                                    variant="bordered"
                                                    minRows={5}
                                                    maxRows={10}
                                                    isInvalid={!!errors.bio}
                                                    errorMessage={errors.bio?.message}
                                                    className="w-full"
                                                />
                                            )}
                                        />
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Máximo de 500 caracteres.</p>
                                    </div>
                                )}

                                {/* ETAPA 4: MÍDIAS */}
                                {currentStep === 4 && (
                                    <div className="space-y-8">
                                        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Mídias de Perfil (Opcional)</h2>
                                        {/* Upload Foto de Perfil */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Foto de Perfil</label>
                                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                                <div className="w-28 h-28 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden shrink-0">
                                                    {profilePreview ? (
                                                        <img src={profilePreview} alt="Preview da Foto de Perfil" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                                                    )}
                                                </div>
                                                <Controller
                                                    name="profilePicture"
                                                    control={control}
                                                    render={({ field: { onChange, value, ...restField }}) => ( // Desestrutura para manipular onChange
                                                        <Input
                                                            {...restField} // Passa o restante das props do field
                                                            type="file"
                                                            accept="image/png, image/jpeg, image/gif"
                                                            onChange={(e) => handleFileUpload(e, 'profilePicture')} // Usa nosso handler customizado
                                                            variant="bordered"
                                                            className="max-w-xs"
                                                            labelPlacement="outside-left"
                                                            label=" " // Label vazia para alinhar, se necessário
                                                            description="JPG, PNG ou GIF (Máx. 2MB)"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        {/* Upload Banner do Perfil */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Banner do Perfil</label>
                                            <div className="w-full h-32 md:h-40 bg-slate-200 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden rounded-lg mb-2">
                                                {bannerPreview ? (
                                                    <img src={bannerPreview} alt="Preview do Banner do Perfil" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                                                )}
                                            </div>
                                            <Controller
                                                name="profileBanner"
                                                control={control}
                                                render={({ field: { onChange, value, ...restField }}) => (
                                                    <Input
                                                        {...restField}
                                                        type="file"
                                                        accept="image/png, image/jpeg, image/gif"
                                                        onChange={(e) => handleFileUpload(e, 'profileBanner')}
                                                        variant="bordered"
                                                        className="max-w-xs"
                                                        description="JPG, PNG ou GIF (Máx. 5MB)"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Botões de Navegação do Stepper */}
                        <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <Button
                                variant="ghost" // Estilo mais sutil para "Voltar"
                                color="default"
                                onClick={returnToPreviousStep}
                                isDisabled={currentStep === 1 || loading} // Desabilita se na primeira etapa ou carregando
                                type="button"
                            >
                                Voltar
                            </Button>

                            {currentStep === TOTAL_STEPS ? (
                                <Button color="primary" type="submit" isLoading={loading} isDisabled={loading || !isValid}> {/* Usa isLoading da HeroUI e desabilita se form inválido */}
                                    {loading ? 'Enviando...' : 'Salvar Perfil'}
                                </Button>
                            ) : (
                                <Button color="primary" type='button' onClick={proceedToNextStep} isDisabled={loading}>
                                    Próximo
                                </Button>
                            )}
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};