'use client'

import { LogInForm } from "@/components/LogInForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("dashboard");
        }
    })

    return (
        <div className="">
            <LogInForm />
        </div>
    )
}