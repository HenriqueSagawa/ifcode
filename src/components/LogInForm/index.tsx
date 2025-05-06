// Indica que este é um Client Component no Next.js App Router.
// Necessário para hooks (useState, useEffect, useForm, useSession),
// interações do usuário e manipulação do DOM.
"use client";

import React, { useEffect, useState } from "react";
import { Label } from "../ui/label"; // Componente de Label (provavelmente Shadcn/ui)
import { Input } from "../ui/input"; // Componente de Input (provavelmente Shadcn/ui)
import { cn } from "@/lib/utils"; // Utilitário para mesclar classes Tailwind CSS condicionalmente
import { Button as ButtonHeroUi } from "@heroui/button"; // Componente de Botão da HeroUI
import {
  IconBrandGithub,
  IconBrandGoogle,
} from "@tabler/icons-react"; // Ícones para GitHub e Google da Tabler Icons
import { Checkbox } from "@heroui/checkbox"; // Componente de Checkbox da HeroUI
import { z } from "zod"; // Biblioteca para validação de esquemas
import { zodResolver } from "@hookform/resolvers/zod"; // Resolver para integrar Zod com React Hook Form
import { useForm } from "react-hook-form"; // Hook para gerenciamento de formulários
import { useSession, signIn } from "next-auth/react"; // Hooks do NextAuth para gerenciamento de sessão e login
import { useRouter } from "next/navigation"; // Hook do Next.js para navegação programática
import { AlertMessage } from "../ui/alert-message"; // Componente customizado para exibir mensagens de alerta
import { Loader } from "../Loader"; // Componente de indicador de carregamento
import Link from "next/link"; // Componente do Next.js para navegação

/**
 * @file LogInForm.tsx - Componente de Formulário de Login.
 * @module auth/LogInForm (ou o caminho apropriado)
 *
 * @description
 * O componente `LogInForm` renderiza uma interface completa para o usuário realizar login.
 * Ele suporta login com credenciais (email/senha) e login via provedores OAuth (GitHub e Google).
 *
 * Funcionalidades:
 * - Campos de email e senha com validação usando Zod e React Hook Form.
 * - Opção para mostrar/ocultar senha.
 * - Botão de submissão com indicador de carregamento.
 * - Botões para login com GitHub e Google.
 * - Redirecionamento automático para o dashboard após login bem-sucedido.
 * - Exibição de mensagens de alerta (sucesso/erro) para feedback ao usuário.
 * - Verificação de sessão existente para redirecionar usuários já logados.
 * - Estilização com Tailwind CSS, incluindo um efeito de fundo "dotted".
 *
 * Este componente não recebe props.
 *
 * @returns {JSX.Element} Um fragmento React contendo o formulário de login e o componente de alerta.
 */
export function LogInForm() {
  // Estado para controlar a visibilidade da senha.
  const [showPassword, setShowPassword] = useState(false);
  // Estado para indicar se uma operação de login está em andamento (ex: chamada à API).
  const [isLoading, setIsLoading] = useState(false);
  // Estados para controle e conteúdo do componente AlertMessage.
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("error");

  // Hooks do Next.js e NextAuth.
  const router = useRouter(); // Para navegação.
  const { data: session, status } = useSession(); // Para obter o status da sessão atual.

  /**
   * Efeito para redirecionar o usuário para o dashboard se já estiver autenticado.
   * Executa quando o `status` da sessão ou `router` mudam.
   */
  useEffect(() => {
    if (status === "authenticated") {
      router.push('/dashboard');
    }
  }, [status, router]);

  // Definição do esquema de validação para os dados do formulário usando Zod.
  const UserSchema = z.object({
    email: z.string().min(1, { message: "Email é obrigatório" }).email({ message: "Formato de email inválido" }),
    password: z.string().min(1, { message: "Senha é obrigatória" }),
    // Poderia adicionar validação de tamanho mínimo para senha se necessário:
    // password: z.string().min(1, { message: "Senha é obrigatória" }).min(8, { message: "Senha deve ter no mínimo 8 caracteres" })
  });

  // Inferência do tipo dos dados do formulário a partir do esquema Zod.
  type UserData = z.infer<typeof UserSchema>;

  // Configuração do React Hook Form.
  const {
    register, // Função para registrar inputs.
    handleSubmit, // Função para lidar com a submissão do formulário.
    formState: { errors }, // Objeto contendo os erros de validação.
  } = useForm<UserData>({
    resolver: zodResolver(UserSchema), // Integra Zod para validação.
    mode: "onChange", // Validação ocorre a cada mudança nos campos.
  });

  /**
   * @function onSubmit
   * @description Lida com a submissão do formulário de login com credenciais.
   * Tenta autenticar o usuário usando a função `signIn` do NextAuth.
   * Exibe mensagens de alerta e redireciona em caso de sucesso.
   * @param {UserData} data - Os dados do formulário (email e senha).
   */
  const onSubmit = async (data: UserData) => {
    try {
      setIsLoading(true);
      // Chama a função signIn do NextAuth para o provedor 'credentials'.
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false, // Impede o redirecionamento automático do NextAuth para tratar manualmente.
        callbackUrl: '/dashboard', // URL para onde o NextAuth redirecionaria se `redirect: true`.
      });

      if (result?.error) {
        // Erro durante o login (ex: credenciais inválidas).
        setAlertType('error');
        setAlertMessage(
          result.error === "CredentialsSignin"
            ? "Email ou senha incorretos. Verifique seus dados."
            : "Ocorreu um erro ao tentar fazer login. Tente novamente."
        );
        setShowAlert(true);
        // Esconde o alerta após 3 segundos.
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        // Login bem-sucedido.
        setAlertType('success');
        setAlertMessage("Login realizado com sucesso! Redirecionando...");
        setShowAlert(true);

        // Aguarda um tempo para o usuário ver a mensagem de sucesso antes de redirecionar.
        // Nota: Usar Promise com setTimeout é uma forma de criar um delay assíncrono.
        // Considerar se um delay tão longo (5s) é ideal para a UX.
        await new Promise(resolve => setTimeout(resolve, 2000)); // Reduzido para 2 segundos

        if (result?.url) {
          router.push(result.url); // Redireciona para a callbackUrl ou dashboard.
        } else {
          router.push('/dashboard'); // Fallback de redirecionamento.
        }
      }
    } catch (err) {
      console.error("Erro inesperado durante o login:", err);
      setAlertType('error');
      setAlertMessage("Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Renderização condicional do loader se o status da sessão ainda estiver carregando.
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-12 h-12" /> {/* Ajuste de tamanho do loader */}
      </div>
    );
  }

  return (
    <>
      {/* Container para o componente AlertMessage, posicionado com z-index alto. */}
      <div className="z-50 fixed top-5 right-5"> {/* Posicionamento fixo para o alerta */}
        <AlertMessage
          isOpen={showAlert}
          onClose={() => setShowAlert(false)}
          message={alertMessage}
          type={alertType}
        />
      </div>
      {/* Container principal da página de login com efeito de fundo. */}
      <div className="relative min-h-screen w-full dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex items-center justify-center p-4 sm:p-8 [mask-image:radial-gradient(closest-side_at_center,black_70%,transparent_100%)] dark:[mask-image:radial-gradient(closest-side_at_center,white_70%,transparent_100%)]">
        {/* Card do formulário de login. */}
        <div className="!z-40 sm:max-w-md max-w-[90%] w-full mx-auto my-12 sm:my-24 rounded-2xl p-6 sm:p-8 shadow-input bg-white dark:bg-black">
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
            Bem-vindo ao IF Code
          </h2>
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Acesse sua conta para continuar!
          </p>

          {/* Formulário de login com credenciais. */}
          <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="exemplo@email.com"
                type="email"
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"} // Acessibilidade: indica campo inválido.
              />
              {/* Exibe mensagem de erro para o campo email. */}
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                aria-invalid={errors.password ? "true" : "false"}
              />
              {/* Exibe mensagem de erro para o campo senha. */}
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
            </LabelInputContainer>

            {/* Checkbox para mostrar/ocultar senha. */}
            <div className="flex items-center space-x-2 mb-8">
              <Checkbox
                id="showPassword"
                checked={showPassword}
                onCheckedChange={(checked) => setShowPassword(Boolean(checked))} // Ajuste para API do Checkbox da HeroUI
                color="default" // Ou a cor desejada (ex: "primary")
                size="md"
              />
              <Label htmlFor="showPassword" className="text-sm cursor-pointer">Mostrar senha</Label>
            </div>

            {/* Botão de submissão do formulário. */}
            <ButtonHeroUi
              type="submit"
              className="w-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
              disabled={isLoading}
            >
              {isLoading ? <Loader className="w-5 h-5" /> : "Entrar"} {/* Ajuste de tamanho do loader no botão */}
            </ButtonHeroUi>

            <p className="text-sm text-center mt-4">
              Não possui conta?{" "}
              <Link className="text-blue-500 hover:underline" href="/register">
                Cadastre-se
              </Link>
            </p>

            {/* Divisor visual "OU". */}
            <div className="flex items-center my-8">
                <div className="flex-grow bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent h-[1px]"></div>
                <span className="mx-4 text-xs text-neutral-500 dark:text-neutral-400">OU</span>
                <div className="flex-grow bg-gradient-to-l from-transparent via-neutral-300 dark:via-neutral-700 to-transparent h-[1px]"></div>
            </div>


            {/* Botões para login com provedores OAuth. */}
            <div className="flex flex-col space-y-4">
              <ButtonHeroUi
                className=" relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                type="button"
                onClick={() => { setIsLoading(true); signIn("github"); }} // Adiciona setIsLoading(true) para feedback
                disabled={isLoading}
              >
                <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  Continuar com GitHub
                </span>
                <BottomGradient />
              </ButtonHeroUi>
              <ButtonHeroUi
                className=" relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                type="button"
                onClick={() => { setIsLoading(true); signIn('google'); }} // Adiciona setIsLoading(true) para feedback
                disabled={isLoading}
              >
                <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  Continuar com Google
                </span>
                <BottomGradient />
              </ButtonHeroUi>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

/**
 * @component BottomGradient
 * @description Um componente puramente visual que renderiza dois elementos `span`
 * para criar um efeito de gradiente na parte inferior de um botão quando em hover.
 * Usado pelos botões de login OAuth.
 *
 * Não recebe props.
 * @returns {JSX.Element} Um fragmento React com dois spans para o efeito de gradiente.
 */
const BottomGradient = () => {
  return (
    <>
      {/* Gradiente principal, visível no hover. */}
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      {/* Gradiente secundário (blur), também visível no hover, para um efeito mais suave. */}
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

/**
 * @interface LabelInputContainerProps
 * @description Define as props para o componente `LabelInputContainer`.
 */
interface LabelInputContainerProps {
  /**
   * @prop {React.ReactNode} children - Os elementos filhos a serem renderizados dentro do container (geralmente um Label e um Input).
   */
  children: React.ReactNode;
  /**
   * @prop {string} [className] - Classes CSS adicionais para estilizar o container. Opcional.
   */
  className?: string;
}

/**
 * @component LabelInputContainer
 * @description Um componente wrapper simples para agrupar um Label e um Input (ou outros elementos de formulário)
 * com estilização flex e espaçamento vertical.
 *
 * @param {LabelInputContainerProps} props - As propriedades do componente.
 * @returns {JSX.Element} Um div que envolve os componentes filhos.
 */
const LabelInputContainer = ({
  children,
  className,
}: LabelInputContainerProps) => {
  return (
    // Aplica classes flex, espaçamento e quaisquer classes customizadas.
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};