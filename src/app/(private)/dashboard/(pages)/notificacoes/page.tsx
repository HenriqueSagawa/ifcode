import { Suspense } from 'react'
import { getNotificationsByUserId } from '@/actions/notifications'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { NotificationsHeader } from './_components/notifications-dashboard'
import { NotificationsSkeleton } from './_components/notifications-dashboard'
import { NotificationsList } from './_components/notifications-dashboard'

export default async function NotificationsPage() {
  const currentUser = await getServerSession(authOptions);
  
  if (!currentUser) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <NotificationsHeader />
      
      <Suspense fallback={<NotificationsSkeleton />}>
        <NotificationsContent userId={currentUser.user?.id as string} />
      </Suspense>
    </div>
  )
}

async function NotificationsContent({ userId }: { userId: string }) {
  const notifications = await getNotificationsByUserId(userId)
  
  return <NotificationsList notifications={notifications} />
}