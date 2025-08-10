import { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { FirestoreAdapter } from "@auth/firebase-adapter"
import { cert } from "firebase-admin/app"
import { db } from "@/lib/firebase"
import { doc, getDoc, query, collection, where, getDocs, addDoc } from "firebase/firestore"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  // Removemos o adapter para permitir que o JWT funcione com todos os providers
  // O adapter será aplicado condicionalmente nos callbacks
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { 
          label: "Email", 
          type: "email",
          placeholder: "exemplo@email.com"
        },
        password: { 
          label: "Password", 
          type: "password" 
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios")
        }

        try {
          // Buscar usuário no Firestore por email
          const usersRef = collection(db, "users")
          const q = query(usersRef, where("email", "==", credentials.email))
          const querySnapshot = await getDocs(q)
          
          if (querySnapshot.empty) {
            throw new Error("Usuário não encontrado")
          }

          const userDoc = querySnapshot.docs[0]
          const userData = userDoc.data()

          // Verificar se o usuário tem senha (foi criado via credentials)
          if (!userData.password) {
            throw new Error("Esta conta foi criada com login social. Use Google ou GitHub para entrar.")
          }

          // Verificar senha
          const isPasswordValid = await bcrypt.compare(credentials.password, userData.password)
          
          if (!isPasswordValid) {
            throw new Error("Senha incorreta")
          }

          // Retornar dados do usuário
          return {
            id: userDoc.id,
            email: userData.email,
            name: userData.name,
            image: userData.image || null,
          }
        } catch (error) {
          console.error("Erro na autenticação:", error)
          throw new Error(error instanceof Error ? error.message : "Erro interno do servidor")
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        try {
          const userDoc = await getDoc(doc(db, "users", token.sub))
          const userData = userDoc.data()
          
          if (userData) {
            session.user = {
              ...session.user,
              id: token.sub,
              bio: userData.bio || null,
              birthDate: userData.birthDate || null,
              createdAt: userData.createdAt || null,
              github: userData.github || null,
              phone: userData.phone || null,
              image: userData.image || session.user.image,
              bannerImage: userData.bannerImage || null,
              skills: userData.skills || [],
              totalPoints: userData.totalPoints || 0
            }
          } else {
            session.user = {
              ...session.user,
              id: token.sub,
            }
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error)
          session.user = {
            ...session.user,
            id: token.sub,
          }
        }
      }
      
      return session
    },
    
    async jwt({ token, user, account }) {
      if (user && account) {
        // Para providers OAuth, buscar o ID do documento do Firestore
        if (account.provider === "google" || account.provider === "github") {
          try {
            const usersRef = collection(db, "users")
            const q = query(usersRef, where("email", "==", user.email))
            const querySnapshot = await getDocs(q)
            
            if (!querySnapshot.empty) {
              token.sub = querySnapshot.docs[0].id
            }
          } catch (error) {
            console.error("Erro ao buscar usuário no JWT callback:", error)
          }
        } else {
          // Para credentials, usar o ID retornado pelo authorize
          token.sub = user.id
        }
      }
      return token
    },

    async signIn({ user, account, profile }) {
      try {
        // Para login com credentials, o usuário já foi validado no authorize
        if (account?.provider === "credentials") {
          return true
        }
        
        // Para provedores OAuth (Google, GitHub), salvar/atualizar no Firestore manualmente
        if (account?.provider === "google" || account?.provider === "github") {
          const usersRef = collection(db, "users")
          const q = query(usersRef, where("email", "==", user.email))
          const querySnapshot = await getDocs(q)
          
          if (querySnapshot.empty) {
            // Criar novo usuário
            await addDoc(usersRef, {
              email: user.email,
              name: user.name,
              image: user.image,
              provider: account.provider,
              createdAt: new Date(),
              bio: null,
              birthDate: null,
              github: account.provider === "github" ? profile?.sub || null : null,
              phone: null,
              bannerImage: null,
              skills: [],
            })
          } else {
            // Usuário já existe, pode atualizar informações se necessário
            const userDoc = querySnapshot.docs[0]
            const userData = userDoc.data()
            
            // Se o usuário tem senha, significa que foi criado via credentials
            if (userData.password) {
              throw new Error("Esta conta foi criada com email/senha. Use o login com credenciais.")
            }
          }
        }
        
        return true
      } catch (error) {
        console.error("Erro no signIn callback:", error)
        return false
      }
    }
  },
  session: {
    strategy: "jwt",
  },
}