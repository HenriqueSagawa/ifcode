"use client";
import React, { use, useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Button as ButtonHeroUi } from "@heroui/button";
import {
  IconBrandGithub,
  IconBrandGoogle,
} from "@tabler/icons-react";
import { Checkbox } from "@heroui/checkbox";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlertMessage } from "../ui/alert-message";
import { Loader } from "../Loader";
import Link from "next/link";

export function LogInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<'success' | 'error'>('error');
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push('/dashboard');
    }
  }, [status, router]);

  const User = z.object({
    email: z.string().min(1, { message: "Email é obrigatório" }).email(),
    password: z.string().min(1, { message: "Senha é obrigatória" })

  });

  type UserData = z.infer<typeof User>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserData>({
    resolver: zodResolver(User),
    mode: "onChange"
  })

  const onSubmit = async (data: UserData) => {
    try {
      setIsLoading(true);
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: '/dashboard'
      });

      if (result?.error) {
        setAlertType('error');
        setAlertMessage(
          result.error.includes("Esta conta foi registrada pelo")
            ? result.error // Usar a mensagem de erro original do NextAuth
            : "Email ou senha incorretos"
        );
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      } else {
        setAlertType('success');
        setAlertMessage("Login realizado com sucesso!");
        setShowAlert(true);

        await new Promise(resolve => setTimeout(resolve, 5000));
        
        if (result?.url) {
          router.push(result.url);
        }
      }
    } catch (err) {
      console.log(err);
      setAlertType('error');
      setAlertMessage("Erro ao fazer login");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="z-50">
        <AlertMessage
          isOpen={showAlert}
          onClose={() => setShowAlert(false)}
          message={alertMessage}
          type={alertType}
        />
      </div>
      <div className="relative min-h-screen w-full dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex items-center justify-center p-8 [mask-image:radial-gradient(closest-side_at_center,black_70%,transparent_100%)] dark:[mask-image:radial-gradient(closest-side_at_center,white_70%,transparent_100%)]">

        <div className="!z-40 sm:max-w-md max-w-[80%] w-full mx-auto my-24 rounded-2xl p-8 shadow-input bg-white dark:bg-black">
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
            Bem-vindo ao IF Code
          </h2>
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Acesse sua conta!
          </p>

          <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
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
            </LabelInputContainer>

            <div className="flex items-center space-x-2 mb-8">
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

            <ButtonHeroUi type="submit" className="w-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900" disabled={isLoading}>
              {isLoading ? <Loader className="" /> : "Entrar"}
            </ButtonHeroUi>

            <p className="text-sm text-center mt-2">Não possuí conta? <Link className="text-blue-500" href="/register">Cadastre-se</Link></p>

            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

            <div className="flex flex-col space-y-4">
              <ButtonHeroUi
                className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                type="button"
                onClick={() => signIn("github")}
              >
                <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  GitHub
                </span>
                <BottomGradient />
              </ButtonHeroUi>
              <ButtonHeroUi
                className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                type="button"
                onClick={() => signIn('google')}
              >
                <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  Google
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
