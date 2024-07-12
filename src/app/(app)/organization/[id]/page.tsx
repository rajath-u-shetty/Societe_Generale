import React from 'react'

type Props = {
  params: {
    id: string
  }
}

async function OrganizationPage({params : {id}}: Props) {
  const organizationId = id
  const organization = await db!.organization.findFirst({
    where: {
      id: organizationId,
    },
    include: {
      projects: true,
      users: true,
      admin: true,
    },
  })
  return (
    <pre>{JSON.stringify(organization, null, 2)}</pre>
  )
}

export default OrganizationPage
