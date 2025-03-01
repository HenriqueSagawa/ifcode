'use client';

import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { Button } from '@heroui/button';
import { Input, Textarea } from '@heroui/input';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Progress } from '@heroui/progress';
import { Divider } from '@heroui/divider';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Briefcase, Calendar, Phone, Plus, Upload } from 'lucide-react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


// Definição do esquema de validação com Zod
const formSchema = z.object({
    birthDate: z.string().min(1, { message: "Data de nascimento é obrigatória" }),
    phoneNumber: z.string().min(10, { message: "Número de telefone deve ter pelo menos 10 dígitos" }),
    profession: z.string().min(1, { message: "Profissão é obrigatória" }),
    github: z.string().optional(),
    skills: z.array(z.string()),
    bio: z.string().optional(),
    profilePicture: z.any().optional(),
    profileBanner: z.any().optional()
});



type FormSchemaType = z.infer<typeof formSchema>;

export function ProfileStepperForm() {

    const { data: session, status } = useSession();
    const route = useRouter();

    const [currentStep, setCurrentStep] = useState<number>(1);
    const [newSkill, setNewSkill] = useState<string>('');
    const [profilePreview, setProfilePreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);


    // Configuração do React Hook Form com Zod
    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        getValues,
        trigger
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            birthDate: '',
            phoneNumber: '',
            profession: '',
            github: '',
            skills: [],
            bio: '',
            profilePicture: null,
            profileBanner: null
        },
        mode: 'onChange'
    });

    // Configuração do Field Array para as habilidades
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'skills'
    });

    // Calcula o progresso com base na etapa atual
    const progressValue = (currentStep / 4) * 100;

    // Adiciona uma nova habilidade
    const addSkill = () => {
        if (newSkill && !getValues('skills').includes(newSkill)) {
            append(newSkill);
            setNewSkill('');
        }
    };

    // Manipula o upload de arquivos
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'profilePicture' | 'profileBanner') => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setValue(fileType, file);

            // Cria uma URL temporária para a visualização
            const fileUrl = URL.createObjectURL(file);
            if (fileType === 'profilePicture') {
                setProfilePreview(fileUrl);
            } else {
                setBannerPreview(fileUrl);
            }
        }
    };

    // Navega para a próxima etapa com validação
    const nextStep = async (e: any) => {
        e.preventDefault();
        let isStepValid = false;

        if (currentStep === 1) {
            isStepValid = await trigger(['birthDate', 'phoneNumber']);
        } else if (currentStep === 2) {
            isStepValid = await trigger(['profession']);
        } else if (currentStep === 3) {
            isStepValid = true;
        }

        if (isStepValid && currentStep < 4) {
            setCurrentStep(prevStep => prevStep + 1);
            setDirection(1);
        }
    };

    // Navega para a etapa anterior
    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prevStep => prevStep - 1);
            setDirection(-1);
        }
    };

    const uploadImageToCloudinary = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Erro ao fazer upload da imagem");
        }

        const data = await response.json();
        return data.secure_url;
    }

    // Envia o formulário
    const onSubmit = async (data: FormSchemaType) => {
        try {
            const profileImageUrl = await uploadImageToCloudinary(data.profilePicture);
            const bannerImageUrl = await uploadImageToCloudinary(data.profileBanner);

            console.log("Imagens enviadas com sucesso:", profileImageUrl, bannerImageUrl);

            const userData = {
                birthDate: data.birthDate,
                phone: data.phoneNumber,
                github: data.github,
                bio: data.bio,
                profession: data.profession,
                profileImage: profileImageUrl,
                bannerImage: bannerImageUrl,
                skills: data.skills,
                email: session?.user?.email
            }

            const response = await fetch("/api/users/update", {
                method: "PUT",
                body: JSON.stringify(userData),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Erro ao atualizar usuário");
            }

            const result = await response.json();
            console.log(result.message);
            route.push("/dashboard");
        } catch (error) {
            console.error("Erro ao enviar formulário:", error)
        }
    };

    // Define as variants para as animações
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    // Direção da animação
    const [direction, setDirection] = useState<number>(0);

    // Função atualizada para navegar
    const navigateToStep = async (step: number) => {
        let canNavigate = true;

        // Validamos as etapas anteriores antes de permitir a navegação
        if (step > 1 && currentStep < step) {
            if (step >= 2) {
                canNavigate = await trigger(['birthDate', 'phoneNumber']);
                if (!canNavigate) return;
            }

            if (step >= 3) {
                canNavigate = await trigger(['profession']);
                if (!canNavigate) return;
            }
        }

        if (canNavigate && step <= Math.max(currentStep, 2)) {
            setDirection(step > currentStep ? 1 : -1);
            setCurrentStep(step);
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
            <Card className="w-full max-w-4xl mx-auto shadow-xl">
                <CardHeader className="flex flex-col gap-2 p-6">
                    <h1 className="text-2xl font-bold text-center">Formulário de Perfil</h1>
                    <Progress
                        aria-label="Progresso do formulário"
                        value={progressValue}
                        className="max-w-md mx-auto w-full mt-2"
                        color="primary"
                        showValueLabel={true}
                        size="md"
                    />

                    <div className="flex justify-between w-full max-w-md mx-auto mt-4">
                        {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex flex-col items-center">
                                <Button
                                    isIconOnly
                                    className={`rounded-full ${step === currentStep
                                        ? 'bg-primary text-white'
                                        : step < currentStep
                                            ? 'bg-primary-400 text-white'
                                            : 'bg-default-100'
                                        }`}
                                    size="sm"
                                    onClick={() => navigateToStep(step)}
                                    aria-label={`Ir para etapa ${step}`}
                                >
                                    {step}
                                </Button>
                                <span className="text-xs mt-1 hidden md:block">
                                    {step === 1 && 'Pessoal'}
                                    {step === 2 && 'Profissional'}
                                    {step === 3 && 'Biografia'}
                                    {step === 4 && 'Mídias'}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardHeader>

                <Divider />

                <CardBody className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={currentStep}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                className="w-full"
                            >
                                {/* Etapa 1: Informações Pessoais */}
                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-semibold">Informações Pessoais</h2>

                                        <div>
                                            <Controller
                                                name="birthDate"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        label="Data de Nascimento"
                                                        type="date"
                                                        variant="bordered"
                                                        radius="sm"
                                                        startContent={<Calendar className="w-4 h-4 text-default-400" />}
                                                        isRequired
                                                        isInvalid={!!errors.birthDate}
                                                        errorMessage={errors.birthDate?.message}
                                                    />
                                                )}
                                            />
                                        </div>

                                        <div>
                                            <Controller
                                                name="phoneNumber"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        label="Número de Telefone"
                                                        type="tel"
                                                        placeholder="(99) 99999-9999"
                                                        variant="bordered"
                                                        radius="sm"
                                                        startContent={<Phone className="w-4 h-4 text-default-400" />}
                                                        isRequired
                                                        isInvalid={!!errors.phoneNumber}
                                                        errorMessage={errors.phoneNumber?.message}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Etapa 2: Informações Profissionais */}
                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-semibold">Informações Profissionais</h2>

                                        <div>
                                            <Controller
                                                name="profession"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        label="Profissão"
                                                        variant="bordered"
                                                        radius="sm"
                                                        startContent={<Briefcase className="w-4 h-4 text-default-400" />}
                                                        isRequired
                                                        isInvalid={!!errors.profession}
                                                        errorMessage={errors.profession?.message}
                                                    />
                                                )}
                                            />
                                        </div>

                                        <div>
                                            <Controller
                                                name="github"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        label="GitHub"
                                                        placeholder="seu-usuario-github"
                                                        variant="bordered"
                                                        radius="sm"
                                                        startContent={<Github className="w-4 h-4 text-default-400" />}
                                                    />
                                                )}
                                            />
                                        </div>

                                        <div>
                                            <div className="flex gap-2 mb-2">
                                                <Input
                                                    label="Habilidades"
                                                    value={newSkill}
                                                    onChange={(e) => setNewSkill(e.target.value)}
                                                    variant="bordered"
                                                    radius="sm"
                                                    className="flex-grow"
                                                />
                                                <Button
                                                    isIconOnly
                                                    color="primary"
                                                    onClick={addSkill}
                                                    aria-label="Adicionar habilidade"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {/* Aqui está a correção principal - renderizar o valor da string diretamente em vez do objeto inteiro */}
                                                {fields.map((field, index) => (
                                                    <Chip
                                                        key={field.id}
                                                        onClose={() => remove(index)}
                                                        variant="flat"
                                                        color="primary"
                                                    >
                                                        {/* O erro estava aqui. Precisamos acessar o valor do field */}
                                                        {getValues(`skills.${index}`)}
                                                    </Chip>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Etapa 3: Biografia */}
                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-semibold">Sua Biografia</h2>

                                        <Controller
                                            name="bio"
                                            control={control}
                                            render={({ field }) => (
                                                <Textarea
                                                    {...field}
                                                    label="Biografia"
                                                    placeholder="Conte um pouco sobre você e sua experiência profissional..."
                                                    variant="bordered"
                                                    radius="sm"
                                                    minRows={6}
                                                    maxRows={12}
                                                />
                                            )}
                                        />
                                        <p className="text-xs text-default-500">Este campo não é obrigatório.</p>
                                    </div>
                                )}

                                {/* Etapa 4: Mídias */}
                                {currentStep === 4 && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-semibold">Mídias de Perfil</h2>

                                        <div className="space-y-4">
                                            <p className="text-sm text-default-500">Foto de Perfil</p>
                                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                                <div className="w-32 h-32 rounded-full bg-default-100 border-2 border-dashed border-default-300 flex items-center justify-center overflow-hidden">
                                                    {profilePreview ? (
                                                        <img src={profilePreview} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Upload className="w-6 h-6 text-default-400" />
                                                    )}
                                                </div>

                                                <div>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange(e, 'profilePicture')}
                                                        className="max-w-xs"
                                                        description="Recomendado: 400x400px. JPG ou PNG. (Opcional)"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-sm text-default-500">Banner do Perfil</p>
                                            <div className="flex flex-col gap-4">
                                                <div className="w-full h-32 md:h-40 bg-default-100 border-2 border-dashed border-default-300 flex items-center justify-center overflow-hidden rounded-lg">
                                                    {bannerPreview ? (
                                                        <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Upload className="w-6 h-6 text-default-400" />
                                                    )}
                                                </div>

                                                <div>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange(e, 'profileBanner')}
                                                        className="max-w-xs"
                                                        description="Recomendado: 1200x400px. JPG ou PNG. (Opcional)"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-between mt-8">
                            <Button
                                variant="flat"
                                onClick={prevStep}
                                isDisabled={currentStep === 1}
                            >
                                Voltar
                            </Button>

                            {currentStep === 4 ? (
                                <Button color="primary" type="submit">
                                    Enviar
                                </Button>
                            ) : (
                                <Button color="primary" type='button' onClick={nextStep}>
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