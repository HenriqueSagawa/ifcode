"use client"

import { SignInForm } from "@/components/SignInForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Register() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
        router.push('/');
    }
  })

    return (
        <div className="z-20 ">
            <SignInForm />
        </div>
    )
}