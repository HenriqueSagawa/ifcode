import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { FirestoreAdapter } from "@auth/firebase-adapter"
import { cert } from "firebase-admin/app"
import { db } from "@/lib/firebase" // ajuste o caminho conforme sua estrutura
import { doc, getDoc } from "firebase/firestore"

export const authOptions: NextAuthOptions = {
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        // Busca os dados completos do usuário no Firestore
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
            }
          } else {
            // Se não encontrou dados adicionais, marca como incompleto
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
      // Na primeira vez que o usuário faz login
      if (user && account) {
        token.sub = user.id
      }
      return token
    },
  },
  session: {
    strategy: "jwt",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }