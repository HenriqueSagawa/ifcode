import { PostsPageContent } from "./_components/postspage-content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Metadata } from "next";
import { BackButton } from "@/components/BackButton";

export const metadata: Metadata = {
  title: "Posts e Artigos de Programação | IF Code",
  description: "Explore nossa coleção de posts, tutoriais e artigos sobre programação, desenvolvimento web, mobile e muito mais. Aprenda com a comunidade IF Code.",
  keywords: [
    "programação",
    "desenvolvimento web",
    "tutoriais de código",
    "artigos de tecnologia",
    "programação para iniciantes",
    "desenvolvimento de software",
    "linguagens de programação",
    "frameworks web",
    "mobile development",
    "IF Code"
  ],
  authors: [{ name: "IF Code Team" }],
  creator: "IF Code",
  publisher: "IF Code",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://ifcode.com.br/posts",
    title: "Posts e Artigos de Programação | IF Code",
    description: "Explore nossa coleção de posts, tutoriais e artigos sobre programação, desenvolvimento web, mobile e muito mais.",
    siteName: "IF Code",
    images: [
      {
        url: "/img/ifcodebanner.webp",
        width: 1200,
        height: 630,
        alt: "IF Code - Posts e Artigos de Programação",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Posts e Artigos de Programação | IF Code",
    description: "Explore nossa coleção de posts, tutoriais e artigos sobre programação, desenvolvimento web, mobile e muito mais.",
    images: ["/img/ifcodebanner.webp"],
    creator: "@ifcode",
    site: "@ifcode",
  },
  alternates: {
    canonical: "https://ifcode.com.br/posts",
  },
  category: "technology",
  classification: "programming tutorials",
};

export default async function PostsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id || "";

  return (
    <div>
      <div className="container mx-auto px-4 py-6">
        <BackButton className="mb-6" fallbackUrl="/" />
      </div>
      <PostsPageContent userId={userId} />
    </div>    
  )
}