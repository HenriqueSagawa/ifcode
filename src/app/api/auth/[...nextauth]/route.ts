import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "email" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials: any, req): Promise<any> {
                try {
                    const usersRef = collection(db, "users");
                    const q = query(usersRef, where("email", "==", credentials?.email));
                    const querySnapshot = await getDocs(q);

                    if (querySnapshot.empty) {
                        throw new Error("Usuário não encontrado");
                    }

                    const user = querySnapshot.docs[0].data();
                    const isValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isValid) {
                        return null;
                    }

                    return {
                        id: querySnapshot.docs[0].id,
                        name: user.name,
                        email: user.email,
                        image: user.image
                    }
                } catch (err) {
                    return null;
                }
            }
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                    prompt: "select_account"
                }
            }
        }),
        
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
            authorization: {
                params: {
                    prompt: "select_account"
                }
            }
        }),

    ],
    secret: process.env.NEXTAUTH_SECRET as string
});

export { handler as GET, handler as POST };