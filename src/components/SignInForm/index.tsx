"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import {
  IconBrandGithub,
  IconBrandGoogle,
} from "@tabler/icons-react";

/**
 * Componente que renderiza o formulário de cadastro (Sign In).
 *
 * Este componente permite que os usuários insiram seus dados pessoais (nome, sobrenome, email e senha)
 * para se cadastrarem na plataforma. Ele também oferece a opção de mostrar/esconder as senhas
 * e fornece botões para cadastro rápido com GitHub e Google.
 *
 * @returns {JSX.Element} O formulário de cadastro renderizado.
 */
export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha.
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para controlar a visibilidade da confirmação de senha.

  /**
   * Função para lidar com o envio do formulário.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - O evento de envio do formulário.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previne o comportamento padrão de envio do formulário.
    console.log("Form submitted"); // Exibe uma mensagem no console ao enviar o formulário.
  };

  return (
    <div className="sm:max-w-md max-w-[80%] w-full mx-auto rounded-2xl p-8 shadow-input bg-white dark:bg-black">
      {/* Container principal do formulário de cadastro. */}
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        {/* Título do formulário. */}
        Bem-vindo ao IF Code
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        {/* Descrição do formulário. */}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi provident totam iusto sunt culpa!
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        {/* Formulário de cadastro. */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          {/* Container para os campos de nome e sobrenome. */}
          <LabelInputContainer>
            {/* Container para o label e input do nome. */}
            <Label htmlFor="firstname">Nome</Label>
            <Input id="firstname" placeholder="Tyler" type="text" />
          </LabelInputContainer>
          <LabelInputContainer>
            {/* Container para o label e input do sobrenome. */}
            <Label htmlFor="lastname">Sobrenome</Label>
            <Input id="lastname" placeholder="Durden" type="text" />
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-4">
          {/* Container para o label e input do email. */}
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="projectmayhem@fc.com" type="email" />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          {/* Container para o label, input e checkbox de mostrar senha. */}
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
          />
          <div className="flex items-center space-x-2">
            {/* Checkbox para mostrar/esconder a senha. */}
            <Checkbox
              id="showPassword"
              checked={showPassword}
              onCheckedChange={() => setShowPassword(!showPassword)} // Atualiza o estado ao marcar/desmarcar o checkbox.
            />
            <label
              htmlFor="showPassword"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Mostrar senha
            </label>
          </div>
        </LabelInputContainer>

        <LabelInputContainer className="mb-8">
          {/* Container para o label, input e checkbox de confirmar senha. */}
          <Label htmlFor="confirmPassword">Confirma senha</Label>
          <Input
            id="confirmPassword"
            placeholder="••••••••"
            type={showConfirmPassword ? "text" : "password"}
          />
          <div className="flex items-center space-x-2">
            {/* Checkbox para mostrar/esconder a confirmação de senha. */}
            <Checkbox
              id="showConfirmPassword"
              checked={showConfirmPassword}
              onCheckedChange={() => setShowConfirmPassword(!showConfirmPassword)} // Atualiza o estado ao marcar/desmarcar o checkbox.
            />
            <label
              htmlFor="showConfirmPassword"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Mostrar senha
            </label>
          </div>
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          {/* Botão de cadastro. */}
          Cadastrar →
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        {/* Linha divisória. */}

        <div className="flex flex-col space-y-4">
          {/* Container para os botões de cadastro com GitHub e Google. */}
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            {/* Botão de cadastro com GitHub. */}
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            {/* Botão de cadastro com Google. */}
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Componente que renderiza o efeito de gradiente na parte inferior dos botões.
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
 * Componente que renderiza um container para o label e o input.
 */
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
