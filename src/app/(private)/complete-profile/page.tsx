'use client'

import { ProfileStepperForm } from "@/components/StepperForm";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";




export default function ProfileComplete() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }

        async function getData() {
            try {
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("email", "==", session?.user?.email));
                const querySnapshot = await getDocs(q);


                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    const userData = doc.data();
                    if (userData.fullData === true) {
                        router.push('/dashboard');
                        return;
                    }
                } else {
                    return null;
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                return null;
            }
        }

        getData();
        }, [status, session, router]);
return (
    <>
        <ProfileStepperForm />
    </>
)
}