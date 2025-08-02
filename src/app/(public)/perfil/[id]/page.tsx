import UserProfileContent from "./_components/profile-content"
import { UserData } from "@/types/userData"
import { getUserById } from "./_actions/get-user"

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
      <UserProfileContent userData={result.user as UserData} />
    </div>
  )
}