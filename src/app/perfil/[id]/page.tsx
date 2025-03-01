'use client'

import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Avatar } from "@heroui/avatar"
import { FaGithub, FaShareAlt } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import Link from "next/link";
import { Spinner } from "@heroui/spinner";
import { SuccessMessage } from "@/components/ui/success-message";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import {addToast} from "@heroui/toast";

interface UserProps {
  name: string,
  id: string,
  email: string,
  phone: string,
  github: string,
  profileImage: string,
  bannerImage: string,
  createdAt: Date,
  bio: string,
  birthDate: string,
  fullData?: any,
  lastName: string,
  password: string,
  profession: string,
  skills: string[]
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProps>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();
  const { id } = useParams();

  useEffect(() => {

    async function fetchData() {
      try {
        setLoading(true);

        const response = await fetch(`/api/profile/${id}`);

        if (!response.ok) {
          throw new Error("Erro ao carregar o perfil");
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError('Não foi possível carregar o perfil. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();


  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner color="success" label="Seja paciente! Não quebre o monitor" size="lg" />
      </div>
    );
  }

  if (error) {
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

  const shareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
  };


  return (
    <div className="max-w-4xl mx-auto p-4">

      <div className="relative">
        <img
          src={user?.bannerImage}
          alt="Banner"
          className="w-full h-40 object-cover rounded-lg"
        />
        <Avatar
          src={user?.profileImage}
          className="absolute bottom-[-40px] left-4 w-24 h-24 border-4 border-white rounded-full"
        />
      </div>
      <div className="mt-12 p-4 text-center">
        <h1 className="text-2xl font-bold">
          {user?.name} {user?.lastName}
        </h1>
        <p className="text-gray-500">Membro desde {new Date(user?.createdAt ?? '').toLocaleDateString()}</p>
        <p className="mt-2 text-gray-700">{user?.bio}</p>
        <div className="flex justify-center gap-4 mt-4">
          <Link href="" className="text-gray-600">
            <MdEmail size={24} />
          </Link>
          <Link href='' target="_blank" className="text-gray-600">
            <FaGithub size={24} />
          </Link>
          <Link href='' className="text-gray-600">
            <MdPhone size={24} />
          </Link>
        </div>
        <Button
          variant="shadow"
          color="success"
          className="mt-4"
          onPress={() => {
            shareProfile();
            addToast({
              title: "Url do Perfil",
              description: "Url do perfil copiado com sucesso!",
              color: "success"
            })
          }}
          startContent={<FaShareAlt />}
        >
          Compartilhar Perfil
        </Button>
      </div>
      <Card className="mt-6 p-4">
        <h2 className="text-xl font-semibold">Habilidades</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {user?.skills.map((skill, index) => (
            <span key={index} className="bg-gray-200 text-zinc-900 px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </Card>
      <Card className="mt-6 p-4">
        <h2 className="text-xl font-semibold">Posts Recentes</h2>
        <div className="mt-2 space-y-4">

        </div>
      </Card>
    </div>
  );
}
