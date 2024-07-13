import OrganizationPageDisplay from '@/components/OrganizationPageDisplay'
import { authOptions } from '@/lib/auth/utils'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params: {
    id: string
  }
}

const OrganizationIdPage = async ({ params: { id } }: Props) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/sign-in")
  }

  return (
    <div className='dark:text-white pt-10'>
      {/* @ts-ignore */}
      <OrganizationPageDisplay organizationId={id} user={session?.user} />
    </div>
  )
}

export default OrganizationIdPage
