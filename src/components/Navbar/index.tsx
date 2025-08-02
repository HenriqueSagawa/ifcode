import { getServerSession } from "next-auth";
import { NavbarContent } from "./navbarContent";
import { authOptions } from "@/lib/auth";


export async function NavbarComponent() {
  const session = await getServerSession(authOptions);
  
  return (
    <>
      <NavbarContent user={session?.user} />
    </>
  )
}