
import ProjectDisplayComponent from '@/components/ProjectDisplayComponent'
import { authOptions } from '@/lib/auth/utils'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params: {
    id: string
    projectId: string
  }
}

const page = async ({ params: { id, projectId } }: Props) => {

  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/sign-in")
  }

  const organizationName = await db.organization.findFirst({
    where: {
      id: id
    }
  })

  const projectName = await db.project.findFirst({
    where: {
      id: projectId
    },
  })

  if (!organizationName || !projectName) {
    redirect("/dashboard")
  }

  return (
    <div className='dark:bg-[rgb(10,10,10)] min-h-screen h-full pt-10'>
      <ProjectDisplayComponent organizationId={id} projectId={projectId} userName={session?.user?.name} userAccess={session?.user?.access} userId={session?.user?.id} organizationName={organizationName.name} projectName={projectName.name} />
    </div>
  )
}

export default page
