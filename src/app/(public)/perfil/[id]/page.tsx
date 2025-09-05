import UserProfileContent from "./_components/profile-content"
import { UserData } from "@/types/userData"
import { getUserById } from "./_actions/get-user"
import { BackButton } from "@/components/BackButton"

interface userPageProps {
  params: {
    id: string
  }
}

export default async function ProfilePage({ params }: userPageProps) {
  const { id } = params

  const result = await getUserById(id);

  if (result.error) {
    return <div>{result.error}</div>;
  }

  console.log("User Data:", result)

  return (
    <div>
      <div className="container mx-auto px-4 py-6">
        <BackButton className="mb-6" fallbackUrl="/" />
      </div>
      <UserProfileContent userData={result.user as UserData} />
    </div>
  )
}