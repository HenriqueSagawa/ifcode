import { PostsPageContent } from "./_components/postspage-content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function PostsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id || "";

  return (
    <div>
      <PostsPageContent userId={userId} />
    </div>    
  )
}