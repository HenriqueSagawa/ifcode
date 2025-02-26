"use client"

import { DashboardContent } from "@/components/Dashboard/DashboardContent";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";

interface UserData {
    name: string;
    email: string;
    birthDate: string;
    phone: string;
    course: string;
    period: string;
    registration: string;
    github: string;
    linkedin: string;
    bio: string;
    profileImage: string;
    createdAt: string;
    fullData: boolean;
}

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkUserData() {
            if (status === "authenticated" && session?.user?.email) {
                try {
                    const usersRef = collection(db, "users");
                    const q = query(usersRef, where("email", "==", session.user.email));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const userData = querySnapshot.docs[0].data() as UserData;
                        
                        if (userData.fullData === false) {
                            router.push("/complete-profile");
                        } else {
                            setUserData(userData);
                        }
                    }
                } catch (error) {
                    console.error("Erro ao verificar dados do usuário:", error);
                } finally {
                    setLoading(false);
                }
            }
        }

        checkUserData();
    }, [session, status, router]);

    if (status === "loading" || loading) {
        return <div>Carregando...</div>;
    }

    if (status === "unauthenticated") {
        router.push("/login");
        return null;
    }

    return (
        <div className="min-h-screen">
            <DashboardContent userData={userData} />
        </div>
    );
}