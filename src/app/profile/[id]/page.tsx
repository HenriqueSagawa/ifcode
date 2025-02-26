'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaPhoneAlt, FaEnvelope, FaCalendarAlt, FaGraduationCap, FaClock, FaMoon, FaSun } from 'react-icons/fa';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { UserData } from '@/types/userData';

export default function UserProfile() {
    const router = useRouter();
    const { id } = useParams();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (!id) return;

        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/profile/${id}`);
                
                if (!response.ok) {
                    throw new Error('Falha ao carregar dados do usuário');
                }
                
                const data = await response.json();
                setUserData(data);
            } catch (err) {
                console.error('Erro:', err);
                setError('Não foi possível carregar o perfil. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);


    const formatBirthDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
        } catch (err) {
            return dateString;
        }
    };



    const formatCreatedAt = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return format(date, "dd/MM/yyyy", { locale: ptBR });
        } catch (err) {
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    if (error || !userData?.fullData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Erro</h2>
                <p className="text-gray-700 dark:text-gray-300">{error || 'Usuário não encontrado'}</p>
                <button 
                    onClick={() => router.push('/')}
                    className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Voltar para a página inicial
                </button>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>{`${userData.name} ${userData.lastName} | Perfil`}</title>
                <meta name="description" content={`Perfil de ${userData.name} ${userData.lastName}`} />
            </Head>

            <div className="min-h-screen transition-colors duration-200">

                <div className="h-64 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 relative">

                    
                    
                    {/* Back Button */}
                    <button 
                        onClick={() => router.back()}
                        className="absolute top-4 left-4 px-3 py-1 rounded-md bg-white/30 dark:bg-gray-800/30 text-white hover:bg-white/40 dark:hover:bg-gray-800/40 transition-colors"
                    >
                        Voltar
                    </button>
                    
                    <div className="absolute bottom-0 left-0 w-full transform translate-y-1/2 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-7xl mx-auto flex items-end">
                            <div className="relative h-36 w-36 sm:h-40 sm:w-40 border-4 border-white dark:border-gray-800 rounded-full overflow-hidden bg-white dark:bg-gray-700 shadow-lg">
                                {userData.profileImage ? (
                                    <Image 
                                        src={userData.profileImage} 
                                        alt={`${userData.name} ${userData.lastName}`}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                                        <span className="text-3xl font-bold text-gray-400 dark:text-gray-300">
                                            {userData.name.charAt(0)}{userData.lastName.charAt(0)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="ml-6 text-white pb-4">
                                <h1 className="text-2xl sm:text-3xl font-bold">
                                    {userData.name} {userData.lastName}
                                </h1>
                                <p className="text-blue-100 dark:text-blue-200">
                                    {userData.course}, {userData.period}º período
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Column - Contact Info */}
                        <div className="md:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Informações de Contato</h2>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <FaEnvelope className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                                        <a href={`mailto:${userData.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                                            {userData.email}
                                        </a>
                                    </div>
                                    
                                    {userData.phone && (
                                        <div className="flex items-center">
                                            <FaPhoneAlt className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                                            <a href={`tel:${userData.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                                                {userData.phone}
                                            </a>
                                        </div>
                                    )}
                                    
                                    {userData.github && (
                                        <div className="flex items-center">
                                            <FaGithub className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                                            <a 
                                                href={`https://github.com/${userData.github}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                {userData.github}
                                            </a>
                                        </div>
                                    )}
                                    
                                    {userData.linkedin && (
                                        <div className="flex items-center">
                                            <FaLinkedin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                                            <a 
                                                href={`https://linkedin.com/in/${userData.linkedin}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                {userData.linkedin}
                                            </a>
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {formatBirthDate(userData.birthDate)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <FaClock className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Membro desde {formatCreatedAt(userData.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-6 transition-colors duration-200">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Informações Acadêmicas</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <FaGraduationCap className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {userData.course}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="h-5 w-5 flex items-center justify-center text-gray-500 dark:text-gray-400 mr-3">
                                            <span className="font-semibold">{userData.period}</span>
                                        </div>
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {userData.period}º período
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Ações para o usuário visitante */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-6 transition-colors duration-200">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Ações</h2>
                                <div className="space-y-3">
                                    <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                                        Enviar mensagem
                                    </button>
                                    <button className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                                        Conectar
                                    </button>
                                    <button onClick={() => navigator.clipboard.writeText(`https://www.ifcode.com.br/profile/${id}`)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                        Compartilhar perfil
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Bio & Timeline */}
                        <div className="md:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Sobre</h2>
                                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                                    <p>{userData.bio || "Nenhuma biografia disponível."}</p>
                                </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-6 transition-colors duration-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Projetos</h2>
                                    <Link href={`/profile/${id}/projects`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                        Ver todos
                                    </Link>
                                </div>
                                
                                <div className="p-10 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                                    <p>Nenhum projeto adicionado ainda</p>
                                </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-6 transition-colors duration-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Atividades Recentes</h2>
                                    <Link href={`/profile/${id}/activities`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                        Ver todas
                                    </Link>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="border-l-2 border-blue-500 dark:border-blue-400 pl-4 py-2">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Há 2 dias</div>
                                        <p className="text-gray-700 dark:text-gray-300">Iniciou um novo projeto: <span className="font-medium">Sistema de Gestão Acadêmica</span></p>
                                    </div>
                                    
                                    <div className="border-l-2 border-blue-500 dark:border-blue-400 pl-4 py-2">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Há 1 semana</div>
                                        <p className="text-gray-700 dark:text-gray-300">Fez upload de um novo trabalho: <span className="font-medium">Análise de Algoritmos</span></p>
                                    </div>
                                    
                                    <div className="border-l-2 border-blue-500 dark:border-blue-400 pl-4 py-2">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Há 2 semanas</div>
                                        <p className="text-gray-700 dark:text-gray-300">Recebeu um certificado: <span className="font-medium">JavaScript Avançado</span></p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-6 transition-colors duration-200">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Habilidades</h2>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">React</span>
                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">Node.js</span>
                                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">TypeScript</span>
                                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm">JavaScript</span>
                                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm">Next.js</span>
                                    <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm">Firebase</span>
                                    <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 rounded-full text-sm">Tailwind CSS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}