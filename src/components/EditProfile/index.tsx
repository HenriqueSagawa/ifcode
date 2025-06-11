import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/modal";

import {
    Phone,
    User,
    Pencil,
    Github,
    Plus,
    X,
    Upload
} from "lucide-react";

import { addToast } from "@heroui/toast";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { useState, useRef } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";

interface userDataProps {
    id?: string; // Add ID for document reference
    name?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    github?: string;
    bio?: string;
    skills?: string[];
    profileImage?: string;
    bannerImage?: string;
}

export function EditProfile({ user }: { user: userDataProps }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    // Initialize form data state with user data
    const [formData, setFormData] = useState<userDataProps>({
        name: user?.name || "",
        lastName: user?.lastName || "",
        phone: user?.phone || "",
        github: user?.github || "",
        bio: user?.bio || "",
        skills: user?.skills || [],
        profileImage: user?.profileImage || "",
        bannerImage: user?.bannerImage || ""
    });
    
    // Refs for file inputs
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);
    
    // State for file uploads
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    
    // State for loading and error handling
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Initialize skills state and new skill input
    const [skills, setSkills] = useState<string[]>(user?.skills || []);
    const [newSkill, setNewSkill] = useState("");

    // Handle field changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle file changes
    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setBannerFile(e.target.files[0]);
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPhotoFile(e.target.files[0]);
        }
    };

    // Skills management
    const addSkill = () => {
        if (newSkill.trim() !== "") {
            const skillExists = Array.isArray(skills) && skills.includes(newSkill.trim());
            
            if (!skillExists) {
                const updatedSkills = [...skills, newSkill.trim()];
                setSkills(updatedSkills);
                setFormData(prev => ({ ...prev, skills: updatedSkills }));
                setNewSkill("");
            }
        }
    };

    const removeSkill = (skillToRemove: string) => {
        const updatedSkills = skills.filter(skill => skill !== skillToRemove);
        setSkills(updatedSkills);
        setFormData(prev => ({ ...prev, skills: updatedSkills }));
    };

    // Function to upload image to Cloudinary
    const uploadToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao fazer upload da imagem');
        }
        
        const data = await response.json();
        return data.secure_url; // Return the secure URL from Cloudinary
    };

    // Function to update user data in Firebase
    const updateUserProfile = async (onClose: () => void) => {
        if (!user.id) {
            setError("ID de usuário não encontrado");
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            
            const userDocRef = doc(db, "users", user.id);
            
            // Object to hold updated data
            const updatedData: Record<string, any> = { 
                name: formData.name,
                lastName: formData.lastName,
                phone: formData.phone,
                github: formData.github,
                bio: formData.bio,
                skills: formData.skills
            };
            
            // Upload banner to Cloudinary if changed
            if (bannerFile) {
                try {
                    const bannerUrl = await uploadToCloudinary(bannerFile);
                    updatedData.bannerImage = bannerUrl;
                } catch (err) {
                    console.error("Erro ao fazer upload do banner:", err);
                    setError("Erro ao fazer upload do banner. Tente novamente.");
                    setIsLoading(false);
                    return;
                }
            }

            if (photoFile) {
                try {
                    const photoUrl = await uploadToCloudinary(photoFile);
                    updatedData.profileImage = photoUrl;
                } catch (err) {
                    console.error("Erro ao fazer upload da foto de perfil:", err);
                    setError("Erro ao fazer upload da foto de perfil. Tente novamente.");
                    setIsLoading(false);
                    return;
                }
            }
            
            await updateDoc(userDocRef, updatedData);
            
            setIsLoading(false);
            addToast({
                title: "Perfil Atualizado",
                description: "Atualize a página para visualizar",
                color: "success",
            })
            onClose();
            
            
        } catch (err) {
            setIsLoading(false);
            setError("Erro ao atualizar perfil: " + (err instanceof Error ? err.message : String(err)));
            console.error("Error updating profile:", err);
        }
    };

    return (
        <>
            <Button onPressEnd={onOpen} size="sm" className="bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 flex items-center gap-1">
                <Pencil className="h-4 w-4" />
                Editar perfil
            </Button>
            <Modal backdrop="blur" isOpen={isOpen} placement="bottom-center" className="!max-h-[95vh] overflow-y-auto" onOpenChange={onOpenChange} size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Editar Perfil</ModalHeader>
                            <ModalBody>
                                {error && (
                                    <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">
                                        {error}
                                    </div>
                                )}
                                
                                {/* Banner Upload */}
                                <div className="w-full h-32 mb-6 border border-dashed rounded-lg relative overflow-hidden">
                                    {(formData.bannerImage || bannerFile) && (
                                        <div className="absolute inset-0">
                                            <img 
                                                src={bannerFile ? URL.createObjectURL(bannerFile) : formData.bannerImage} 
                                                alt="Banner" 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <input 
                                            type="file" 
                                            id="banner-upload" 
                                            className="hidden" 
                                            accept="image/*"
                                            ref={bannerInputRef}
                                            onChange={handleBannerChange}
                                        />
                                        <label htmlFor="banner-upload" className="cursor-pointer flex flex-col items-center">
                                            <Upload className="w-6 h-6 text-white" />
                                            <span className="text-sm text-white mt-1">Capa do perfil</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Profile Photo */}
                                <div className="flex justify-center mb-6">
                                    <div className="w-24 h-24 border border-dashed rounded-full relative overflow-hidden">
                                        {(formData.profileImage || photoFile) && (
                                            <div className="absolute inset-0">
                                                <img 
                                                    src={photoFile ? URL.createObjectURL(photoFile) : formData.profileImage} 
                                                    alt="Foto de perfil" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <input 
                                                type="file" 
                                                id="photo-upload" 
                                                className="hidden" 
                                                accept="image/*"
                                                ref={photoInputRef}
                                                onChange={handlePhotoChange}
                                            />
                                            <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center">
                                                <Upload className="w-5 h-5 text-white" />
                                                <span className="text-xs text-white mt-1">Foto</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Nome */}
                                <Input
                                    endContent={
                                        <User className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                    name="name"
                                    label="Nome"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    variant="bordered"
                                    className="mb-4"
                                />

                                {/* Sobrenome */}
                                <Input
                                    endContent={
                                        <User className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                    name="lastName"
                                    label="Sobrenome"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    variant="bordered"
                                    className="mb-4"
                                />

                                {/* Telefone */}
                                <Input
                                    endContent={
                                        <Phone className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                    name="phone"
                                    label="Telefone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    variant="bordered"
                                    className="mb-4"
                                />

                                {/* GitHub */}
                                <Input
                                    endContent={
                                        <Github className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                    name="github"
                                    label="GitHub"
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

                                {/* Habilidades */}
                                <div className="mb-4">
                                    <p className="text-sm mb-2">Habilidades</p>
                                    
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Adicionar habilidade"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                                            variant="bordered"
                                            className="flex-1"
                                        />
                                        <Button
                                            onClick={addSkill}
                                            className="flex items-center gap-1"
                                            color="primary"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Adicionar
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {Array.isArray(skills) && skills.map((skill, index) => (
                                            <div key={index} className="bg-gray-100 text-zinc-900 px-3 py-1 rounded-full flex items-center gap-1">
                                                <span className="text-sm">{skill}</span>
                                                <button
                                                    onClick={() => removeSkill(skill)}
                                                    className="text-gray-500 hover:text-red-500"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose} disabled={isLoading}>
                                    Cancelar
                                </Button>
                                <Button 
                                    color="primary" 
                                    onClick={() => updateUserProfile(onClose)}
                                    disabled={isLoading}
                                >
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