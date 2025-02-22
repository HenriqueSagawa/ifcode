import { LogInForm } from "@/components/LogInForm";

export default function Login() {
    return (
        <div className="dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center min-h-screen w-full p-8 [mask-image:radial-gradient(closest-side_at_center,black_70%,transparent_100%)] dark:[mask-image:radial-gradient(closest-side_at_center,white_70%,transparent_100%)]">
            <LogInForm />
        </div>
    )
}