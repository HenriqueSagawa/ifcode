"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlertMessage } from "@/components/ui/alert-message";
import { Upload } from "lucide-react";

export default function StepperForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState<"success" | "error">("success");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const { data: session } = useSession();
    const router = useRouter();

    const [formData, setFormData] = useState({
        // Dados pessoais
        birthDate: "",
        phone: "",
        
        // Dados acadêmicos
        course: "",
        period: "",
        registration: "",
        
        // Dados de perfil
        github: "",
        linkedin: "",
        bio: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleNext = () => {
        if (validateCurrentStep()) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateCurrentStep = () => {
        switch (currentStep) {
            case 1:
                if (!formData.birthDate || !formData.phone) {
                    setAlertType("error");
                    setAlertMessage("Preencha todos os campos obrigatórios");
                    setShowAlert(true);
                    return false;
                }
                break;
            case 2:
                if (!formData.course || !formData.period || !formData.registration) {
                    setAlertType("error");
                    setAlertMessage("Preencha todos os campos obrigatórios");
                    setShowAlert(true);
                    return false;
                }
                break;
            case 4:
                if (!imageFile) {
                    setAlertType("error");
                    setAlertMessage("Selecione uma foto de perfil");
                    setShowAlert(true);
                    return false;
                }
                break;
        } 
        return true;
    };

    const handleSubmit = async () => {
        try {
            if (!session?.user?.email || !imageFile) return;

            setAlertType("success");
            setAlertMessage("Enviando dados...");
            setShowAlert(true);

            // 1. Upload da imagem para o Cloudinary
            const imageFormData = new FormData();
            imageFormData.append('file', imageFile);

            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: imageFormData
            });

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json();
                throw new Error(errorData.error || 'Erro ao fazer upload da imagem');
            }

            const uploadData = await uploadResponse.json();
            const imageUrl = uploadData.secure_url;

            // 2. Enviar dados para o banco
            const userData = {
                ...formData,
                email: session.user.email,
                profileImage: imageUrl,
                fullData: true
            };

            const updateResponse = await fetch('/api/users/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!updateResponse.ok) {
                const errorData = await updateResponse.json();
                throw new Error(errorData.error || 'Erro ao atualizar dados do usuário');
            }

            const updateData = await updateResponse.json();
            console.log('Atualização bem sucedida:', updateData);

            setAlertType("success");
            setAlertMessage("Perfil atualizado com sucesso!");
            setShowAlert(true);

            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);

        } catch (error) {
            console.error('Erro completo:', error);
            setAlertType("error");
            setAlertMessage(error instanceof Error ? error.message : "Erro ao atualizar perfil");
            setShowAlert(true);
        }
    };

    return (
        <div className="min-h-screen p-8 max-w-2xl mx-auto">
            <AlertMessage
                isOpen={showAlert}
                onClose={() => setShowAlert(false)}
                message={alertMessage}
                type={alertType}
            />

            {/* Stepper Header */}
            <div className="mb-8">
                <div className="flex justify-between">
                    {[1, 2, 3, 4].map((step) => (
                        <div
                            key={step}
                            className={`flex items-center ${
                                step < currentStep
                                    ? "text-green-500"
                                    : step === currentStep
                                    ? "text-primary"
                                    : "text-gray-300"
                            }`}
                        >
                            <div className={`rounded-full transition duration-500 ease-in-out
                                h-12 w-12 py-3 border-2 flex items-center justify-center
                                ${
                                    step < currentStep
                                        ? "bg-green-500 border-green-500"
                                        : step === currentStep
                                        ? "border-primary"
                                        : "border-gray-300"
                                }`}
                            >
                                {step < currentStep ? "✓" : step}
                            </div>
                            <div className="ml-2">
                                {step === 1 && "Dados Pessoais"}
                                {step === 2 && "Dados Acadêmicos"}
                                {step === 3 && "Perfil"}
                                {step === 4 && "Foto"}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Steps */}
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-lg">
                {currentStep === 1 && (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="birthDate">Data de Nascimento</Label>
                            <Input
                                id="birthDate"
                                name="birthDate"
                                type="date"
                                value={formData.birthDate}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Telefone</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="course">Curso</Label>
                            <Select onValueChange={(value) => handleSelectChange("course", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione seu curso" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="informatica">Técnico em Informática</SelectItem>
                                    <SelectItem value="eletrotecnica">Técnico em Eletrotécnica</SelectItem>
                                    <SelectItem value="agronomia">Técnico em Agronomia</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="period">Período</Label>
                            <Select onValueChange={(value) => handleSelectChange("period", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione seu período" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1º Período</SelectItem>
                                    <SelectItem value="2">2º Período</SelectItem>
                                    <SelectItem value="3">3º Período</SelectItem>
                                    <SelectItem value="4">4º Período</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="registration">Matrícula</Label>
                            <Input
                                id="registration"
                                name="registration"
                                value={formData.registration}
                                onChange={handleInputChange}
                                placeholder="Digite sua matrícula"
                            />
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="github">GitHub</Label>
                            <Input
                                id="github"
                                name="github"
                                value={formData.github}
                                onChange={handleInputChange}
                                placeholder="Seu usuário do GitHub"
                            />
                        </div>
                        <div>
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input
                                id="linkedin"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleInputChange}
                                placeholder="Seu perfil do LinkedIn"
                            />
                        </div>
                        <div>
                            <Label htmlFor="bio">Biografia</Label>
                            <Input
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="Conte um pouco sobre você"
                            />
                        </div>
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="space-y-4">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Upload className="w-8 h-8 text-muted-foreground" />
                                )}
                            </div>
                            <Label
                                htmlFor="profileImage"
                                className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                            >
                                Escolher Foto
                                <Input
                                    id="profileImage"
                                    name="profileImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Escolha uma foto de perfil (recomendado: 300x300px)
                            </p>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                    >
                        Voltar
                    </Button>
                    
                    {currentStep < 4 ? (
                        <Button onClick={handleNext}>
                            Próximo
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit}>
                            Finalizar
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}