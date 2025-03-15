"use client";
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Checkbox } from "@heroui/checkbox";
import { Loader } from "../Loader";
import { SuccessMessage } from "../ui/success-message";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconArrowRight
  
} from "@tabler/icons-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

export function SignInForm() {
  const { data: session, status } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);


  const User = z.object({
    name: z.string()
      .min(1, { message: "Nome é obrigatório" })
      .max(50, { message: "Nome deve ter no máximo 50 caracteres" }),
    lastName: z.string()
      .min(1, { message: "O sobrenome é obrigatório" })
      .max(50, { message: "O sobrenome deve ter no máximo 50 caracteres" }),
    email: z.string()
      .email({ message: "Email inválido" }),
    password: z.string()
      .min(8, { message: "Senha deve ter no mínimo 8 caracteres" })
      .max(50, { message: "Senha deve ter no máximo 50 caracteres" })
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/\d/, "A senha deve conter pelo menos um número")
      .regex(/[@$!%*?&]/, "A senha deve conter pelo menos um caractere especial (@, $, !, %, *, ?, &)"),
    passwordConfirm: z.string()
      .min(8, { message: "Senha deve ter no mínimo 8 caracteres" }),
  }).refine((data) => data.password === data.passwordConfirm, {
    message: "As senhas não coincidem",
    path: ["passwordConfirm"],
  });

  type UserData = z.infer<typeof User>;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UserData>({
    resolver: zodResolver(User),
    mode: "onChange"
  });

  const onSubmit = async (dataUser: UserData) => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataUser)
      });

      const data: any = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar usuário");
      }

      setShowSuccess(true);
      setLoading(false);
    
      localStorage.setItem('userData', JSON.stringify(data));

      setTimeout(() => {
        setShowSuccess(false);
        signIn("credentials", {
          email: dataUser.email,
          password: dataUser.password,
          callbackUrl: "/dashboard"
        });
      }, 3000);

    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <>
      <div className="z-50">
        <SuccessMessage
          isOpen={showSuccess}
          onClose={() => setShowSuccess(false)}
          message="Cadastro realizado com sucesso! Você será redirecionado em instantes."
        />
      </div>
      <div className="relative min-h-screen w-full dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex items-center justify-center p-8 [mask-image:radial-gradient(closest-side_at_center,black_70%,transparent_100%)] dark:[mask-image:radial-gradient(closest-side_at_center,white_70%,transparent_100%)]">
        <div className="z-30 sm:max-w-md max-w-[80%] w-full mx-auto my-24 rounded-2xl p-8 shadow-input bg-white dark:bg-black">
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
            Bem-vindo ao IF Code
          </h2>
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Crie já sua conta!
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
              <LabelInputContainer>
                <Label htmlFor="firstname">Nome</Label>
                <Input id="firstname" placeholder="Neymar" type="text" {...register("name")} />
                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="lastname">Sobrenome</Label>
                <Input id="lastname" placeholder="Junior" type="text" {...register("lastName")} />
                {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName.message}</span>}
              </LabelInputContainer>
            </div>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="neymarjunior@gmail.com" type="email" {...register("email")} />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                {...register("password")}
              />
              {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showPassword"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  color="default"
                  size="md"
                >
                  Mostrar senha
                </Checkbox>
              </div>
            </LabelInputContainer>
            <LabelInputContainer className="mb-8">
              <Label htmlFor="confirmPassword">Confirma senha</Label>
              <Input
                id="confirmPassword"
                placeholder="••••••••"
                type={showConfirmPassword ? "text" : "password"}
                {...register("passwordConfirm")}
              />
              {errors.passwordConfirm && <span className="text-red-500 text-sm">{errors.passwordConfirm.message}</span>}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showConfirmPassword"
                  checked={showConfirmPassword}
                  onChange={() => setShowConfirmPassword(!showConfirmPassword)}
                  color="default"
                  size="md"
                >
                  Mostrar senha
                </Checkbox>

              </div>
            </LabelInputContainer>

            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 shadow border" disabled={loading}>
              {loading ? <Loader className="" /> : "Avançar"} <IconArrowRight className="h-4 w-4" />
            </Button>

            <p className="text-sm mt-2 text-center">Já possuí conta? <Link className="text-blue-500" href="/login">Entre</Link></p>

            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

            <div className="flex flex-col space-y-4">
              <Button
                className="border relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                onClick={() => signIn("github")}
              >
                <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  GitHub
                </span>
                <BottomGradient />
              </Button>
              <Button
                className="border relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                onClick={() => signIn('google')}
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

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

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
