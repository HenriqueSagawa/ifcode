import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";
import { create } from "domain";

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
                        throw new Error("Email ou senha incorretos");
                    }

                    const user = querySnapshot.docs[0].data();

                    if (user?.provider === 'google') {
                        throw new Error('Esta conta foi registrada pelo Google. Por favor, use o botão "Entrar com Google"');
                    }
                    if (user?.provider === 'github') {
                        throw new Error('Esta conta foi registrada pelo Github. Por favor, use o botão "Entrar com Github"');
                    }

                    if (!user.password) {
                        throw new Error('Email ou senha incorretos');
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isValid) {
                        throw new Error('Email ou senha incorretos');
                    }

                    return {
                        id: querySnapshot.docs[0].id,
                        name: user.name,
                        email: user.email,
                        image: user.image
                    }
                } catch (err: any) {
                    throw new Error(err.message);
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

    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google' || account?.provider === "github") {
                try {
                    const usersRef = collection(db, "users");
                    const q = query(usersRef, where("email", "==", user.email));
                    const querySnapshot = await getDocs(q);

                    if (querySnapshot.empty) {
                        console.log(`Criando novo usuário via ${account.provider}:`, user.email);

                        const newUser = {
                            name: user.name,
                            email: user.email,
                            provider: account.provider,
                            createdAt: new Date().toISOString(),
                            fullData: false,
                        }

                        const docRef = await addDoc(usersRef, newUser);
                        return true;
                    } else {
                        console.log(`Usuário já existe via ${account.provider}:`, user.email);                    }
                } catch (error) {
                    console.error("Erro ao buscar ou criar usuário:", error);
                    return false;
                }
                            console.log(`Usuário já existe via ${account.provider}:`, user.email);
                            return true;
                        }
            return true;
        }
    },

    secret: process.env.NEXTAUTH_SECRET as string
});

export { handler as GET, handler as POST };