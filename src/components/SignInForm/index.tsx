// Indica que este é um Client Component no Next.js App Router.
// Necessário para hooks (useState, useEffect, useForm, useSession),
// interações do usuário e chamadas à API.
"use client";

import React, { useEffect, useState } from "react";
import { Label } from "../ui/label"; // Componente de Label (provavelmente Shadcn/ui)
import { Input } from "../ui/input"; // Componente de Input (provavelmente Shadcn/ui)
import { cn } from "@/lib/utils"; // Utilitário para mesclar classes Tailwind CSS
import { Checkbox } from "@heroui/checkbox"; // Componente Checkbox da HeroUI
import { Loader } from "../Loader"; // Componente de indicador de carregamento
import { SuccessMessage } from "../ui/success-message"; // Componente para exibir mensagens de sucesso
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconArrowRight
} from "@tabler/icons-react"; // Ícones da Tabler Icons
import { z } from "zod"; // Biblioteca para validação de esquemas
import { zodResolver } from "@hookform/resolvers/zod"; // Resolver para Zod com React Hook Form
import { useForm } from "react-hook-form"; // Hook para gerenciamento de formulários
import { Button } from "@heroui/button"; // Componente de Botão da HeroUI (renomeado ou diferente do Shadcn)
import { useRouter } from "next/navigation"; // Hook do Next.js para navegação (não utilizado diretamente aqui, mas importado)
import { useSession, signIn } from "next-auth/react"; // Hooks do NextAuth para sessão e login
import Link from "next/link"; // Componente Link do Next.js

/**
 * @file SignInForm.tsx - Componente de Formulário de Cadastro de Usuário.
 * @module auth/SignInForm (ou o caminho apropriado)
 *
 * @description
 * O componente `SignInForm` renderiza uma interface para o usuário criar uma nova conta.
 * Ele suporta cadastro com nome, sobrenome, email e senha, com validação robusta,
 * e também oferece opções de cadastro/login rápido via provedores OAuth (GitHub e Google).
 *
 * Funcionalidades:
 * - Campos de nome, sobrenome, email, senha e confirmação de senha.
 * - Validação detalhada dos campos usando Zod e React Hook Form, incluindo:
 *   - Requisitos de força para a senha (mínimo de 8 caracteres, maiúscula, minúscula, número, especial).
 *   - Confirmação de que as senhas digitadas coincidem.
 * - Opções para mostrar/ocultar senha e confirmação de senha.
 * - Chamada a uma API (`/api/users`) para registrar o novo usuário.
 * - Exibição de mensagens de sucesso ou erro.
 * - Indicador de carregamento durante a submissão.
 * - Login automático do usuário via NextAuth (provedor 'credentials') após cadastro bem-sucedido.
 * - Links para login com GitHub e Google.
 * - Redirecionamento para o dashboard se o usuário já estiver autenticado (via `useSession`).
 *
 * Este componente não recebe props.
 *
 * @returns {JSX.Element} Um fragmento React contendo o formulário de cadastro e o componente de mensagem de sucesso.
 */
export function SignInForm() {
  // Hooks do NextAuth para verificar se o usuário já está logado.
  const { data: session, status } = useSession();
  const router = useRouter(); // Para redirecionamento

  // Estados para controle da UI e do formulário.
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [formData, setFormData] = useState(...); // Este estado não parece ser usado, pode ser removido.
  const [error, setError] = useState(""); // Mensagem de erro geral do formulário.
  const [loading, setLoading] = useState(false); // Indica se o formulário está em processo de submissão.
  const [showSuccess, setShowSuccess] = useState(false); // Controla a visibilidade da mensagem de sucesso.

  /**
   * Efeito para redirecionar o usuário para o dashboard se já estiver autenticado.
   * Executa quando o `status` da sessão ou `router` mudam.
   */
  useEffect(() => {
    if (status === "authenticated") {
      router.push('/dashboard');
    }
  }, [status, router]);

  // Definição do esquema de validação para os dados de cadastro usando Zod.
  const UserSchema = z.object({
    name: z.string()
      .min(1, { message: "Nome é obrigatório." })
      .max(50, { message: "Nome deve ter no máximo 50 caracteres." }),
    lastName: z.string()
      .min(1, { message: "Sobrenome é obrigatório." })
      .max(50, { message: "Sobrenome deve ter no máximo 50 caracteres." }),
    email: z.string()
      .min(1, { message: "Email é obrigatório."})
      .email({ message: "Por favor, insira um email válido." }),
    password: z.string()
      .min(8, { message: "Senha deve ter no mínimo 8 caracteres." })
      .max(50, { message: "Senha deve ter no máximo 50 caracteres." })
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula.")
      .regex(/\d/, "A senha deve conter pelo menos um número.")
      .regex(/[@$!%*?&]/, "A senha deve conter pelo menos um caractere especial (@, $, !, %, *, ?, &)."),
    passwordConfirm: z.string()
      .min(1, { message: "Confirmação de senha é obrigatória." }), // Garante que o campo não está vazio.
  }).refine((data) => data.password === data.passwordConfirm, {
    // Validação customizada para verificar se a senha e a confirmação de senha são iguais.
    message: "As senhas não coincidem.",
    path: ["passwordConfirm"], // Associa o erro ao campo 'passwordConfirm'.
  });

  // Inferência do tipo dos dados do formulário a partir do esquema Zod.
  type UserData = z.infer<typeof UserSchema>;

  // Configuração do React Hook Form.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserData>({
    resolver: zodResolver(UserSchema), // Integra Zod para validação.
    mode: "onChange", // Validação ocorre a cada mudança nos campos.
  });

  /**
   * @function onSubmit
   * @description Lida com a submissão do formulário de cadastro.
   * Envia os dados do novo usuário para a API `/api/users`.
   * Em caso de sucesso, exibe uma mensagem, armazena dados no localStorage (revisar necessidade),
   * e tenta fazer login automático com as credenciais recém-criadas.
   * @param {UserData} dataUser - Os dados do formulário validados.
   */
  const onSubmit = async (dataUser: UserData) => {
    setError(""); // Limpa erros anteriores.
    setLoading(true); // Ativa o indicador de carregamento.

    try {
      // Chamada à API para criar o usuário.
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: dataUser.name,
          lastName: dataUser.lastName,
          email: dataUser.email,
          password: dataUser.password,
        }), // Envia apenas os campos necessários para a API.
      });

      const responseData: any = await response.json(); // Lê a resposta da API.

      if (!response.ok) {
        // Se a resposta não for OK (status >= 400), lança um erro.
        throw new Error(responseData.error || "Erro ao cadastrar usuário. Tente novamente.");
      }

      // Cadastro bem-sucedido.
      setShowSuccess(true);
      setLoading(false);

      // Armazenar dados no localStorage:
      // Considerar a sensibilidade dos dados armazenados aqui.
      // Se `responseData` contiver tokens ou informações sensíveis,
      // o localStorage pode não ser o local mais seguro.
      // NextAuth gerencia a sessão de forma mais segura (geralmente com cookies HttpOnly).
      localStorage.setItem('userData', JSON.stringify(responseData)); // Se necessário, garanta que apenas dados não-sensíveis são guardados.

      // Após um delay, tenta fazer login com as novas credenciais.
      setTimeout(() => {
        setShowSuccess(false);
        signIn("credentials", {
          email: dataUser.email,
          password: dataUser.password,
          callbackUrl: "/dashboard", // Redireciona para o dashboard após login.
        });
      }, 3000); // Delay de 3 segundos para o usuário ver a mensagem de sucesso.

    } catch (err: any) {
      console.error("Erro no cadastro:", err);
      setError(err.message || "Ocorreu um erro desconhecido durante o cadastro.");
      setLoading(false);
    }
  };

  // Renderização condicional do loader se o status da sessão ainda estiver carregando.
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-12 h-12" />
      </div>
    );
  }

  return (
    <>
      {/* Container para a mensagem de sucesso, posicionado de forma fixa. */}
      <div className="z-50 fixed top-5 right-5">
        <SuccessMessage
          isOpen={showSuccess}
          onClose={() => setShowSuccess(false)}
          message="Cadastro realizado com sucesso! Você será redirecionado para o login em instantes."
        />
      </div>
      {/* Container principal da página de cadastro com efeito de fundo. */}
      <div className="relative min-h-screen w-full dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex items-center justify-center p-4 sm:p-8 [mask-image:radial-gradient(closest-side_at_center,black_70%,transparent_100%)] dark:[mask-image:radial-gradient(closest-side_at_center,white_70%,transparent_100%)]">
        {/* Card do formulário de cadastro. */}
        <div className="z-30 sm:max-w-md max-w-[90%] w-full mx-auto my-12 sm:my-24 rounded-2xl p-6 sm:p-8 shadow-input bg-white dark:bg-black">
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
            Crie sua conta no IF Code
          </h2>
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            É rápido e fácil. Comece agora mesmo!
          </p>

          {/* Formulário de cadastro. */}
          <form onSubmit={handleSubmit(onSubmit)} className="my-8 space-y-4">
            {/* Campos de Nome e Sobrenome em linha para telas maiores. */}
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <LabelInputContainer className="w-full">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Ex: João" type="text" {...register("name")} aria-invalid={errors.name ? "true" : "false"} />
                {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
              </LabelInputContainer>
              <LabelInputContainer className="w-full">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input id="lastName" placeholder="Ex: Silva" type="text" {...register("lastName")} aria-invalid={errors.lastName ? "true" : "false"} />
                {errors.lastName && <span className="text-red-500 text-xs mt-1">{errors.lastName.message}</span>}
              </LabelInputContainer>
            </div>

            <LabelInputContainer>
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="seuemail@exemplo.com" type="email" {...register("email")} aria-invalid={errors.email ? "true" : "false"} />
              {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="showPasswordCheckbox" // ID único para o checkbox
                  checked={showPassword}
                  onCheckedChange={(checked) => setShowPassword(Boolean(checked))} // Ajuste para API do Checkbox
                  color="default"
                  size="md"
                />
                <Label htmlFor="showPasswordCheckbox" className="text-sm cursor-pointer">Mostrar senha</Label>
              </div>
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="passwordConfirm">Confirmar Senha</Label>
              <Input
                id="passwordConfirm"
                placeholder="••••••••"
                type={showConfirmPassword ? "text" : "password"}
                {...register("passwordConfirm")}
                aria-invalid={errors.passwordConfirm ? "true" : "false"}
              />
              {errors.passwordConfirm && <span className="text-red-500 text-xs mt-1">{errors.passwordConfirm.message}</span>}
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="showConfirmPasswordCheckbox" // ID único
                  checked={showConfirmPassword}
                  onCheckedChange={(checked) => setShowConfirmPassword(Boolean(checked))}
                  color="default"
                  size="md"
                />
                 <Label htmlFor="showConfirmPasswordCheckbox" className="text-sm cursor-pointer">Mostrar senha</Label>
              </div>
            </LabelInputContainer>

            {/* Exibição de erro geral do formulário. */}
            {error && <p className="text-red-500 text-sm text-center py-2">{error}</p>}

            {/* Botão de submissão do formulário. */}
            <Button
              type="submit"
              className="w-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? <Loader className="w-5 h-5" /> : "Criar Conta"}
              {!loading && <IconArrowRight className="h-4 w-4" />}
            </Button>

            <p className="text-sm text-center mt-4">
              Já possui uma conta?{" "}
              <Link className="text-blue-500 hover:underline" href="/login">
                Faça login
              </Link>
            </p>

            {/* Divisor visual "OU". */}
             <div className="flex items-center my-6">
                <div className="flex-grow bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent h-[1px]"></div>
                <span className="mx-4 text-xs text-neutral-500 dark:text-neutral-400">OU CRIE COM</span>
                <div className="flex-grow bg-gradient-to-l from-transparent via-neutral-300 dark:via-neutral-700 to-transparent h-[1px]"></div>
            </div>

            {/* Botões para login/cadastro com provedores OAuth. */}
            <div className="flex flex-col space-y-4">
              <Button
                className="border relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                type="button" // Especificar type="button" para não submeter o formulário principal.
                onClick={() => { setLoading(true); signIn("github", { callbackUrl: "/dashboard" }); }}
                disabled={loading}
              >
                <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  GitHub
                </span>
                <BottomGradient />
              </Button>
              <Button
                className="border relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                type="button"
                onClick={() => { setLoading(true); signIn('google', { callbackUrl: "/dashboard" }); }}
                disabled={loading}
              >
                <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  Google
                </span>
                <BottomGradient />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

/**
 * @component BottomGradient
 * @description Componente visual para efeito de gradiente em botões OAuth.
 * (Documentação idêntica à versão anterior, pode ser reutilizada ou referenciada).
 * @returns {JSX.Element}
 */
const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

/**
 * @interface LabelInputContainerProps
 * @description Props para o componente LabelInputContainer.
 * (Documentação idêntica à versão anterior).
 */
interface LabelInputContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * @component LabelInputContainer
 * @description Wrapper para Label e Input.
 * (Documentação idêntica à versão anterior).
 * @param {LabelInputContainerProps} props
 * @returns {JSX.Element}
 */
const LabelInputContainer = ({
  children,
  className,
}: LabelInputContainerProps) => {
  return (
    <div className={cn("flex flex-col space-y-1 w-full", className)}> {/* Reduzido space-y para melhor compactação */}
      {children}
    </div>
  );
};