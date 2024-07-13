import { authOptions } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions); // Ensure you pass the request to getServerSession
  const { organizationId, userId, password } = await req.json();

  // Check if the required fields are present
  if (!organizationId || !userId) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  // Check if the session exists and if not, return unauthorized
  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const organization = await db.organization.findUnique({ where: { id: organizationId }, include: { projects: true } });
    if (!organization) {
      return new Response(JSON.stringify({ error: "Organization not found" }), { status: 404 });
    }

    // Allow admins to join without a password or if the password matches
    if (session.user.access !== "ADMIN" && organization.password !== password) {
      return new Response(JSON.stringify({ error: "Incorrect password" }), { status: 401 });
    }

    // Check if the user is already a member of the organization
    const isMember = await db.user.findFirst({
      where: {
        id: userId,
        organizations: {
          some: {
            id: organizationId,
          }
        }
      },
    })

    if (isMember) {
      return new Response(JSON.stringify({ error: "User already a member of the organization" }), { status: 400 });
    }

    // Create a new organizationMember entry
    const organizationMember = await db.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        users: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        users: true,
      }
    })

    if (!organizationMember) return new Response(JSON.stringify({ error: "Failed to create organizationMember" }), { status: 500 });

    return new Response(JSON.stringify({ message: "Successfully joined organization", organizationMember }), { status: 200 });
  } catch (error) {
    console.error("PUT /api/organization error: ", error);
    return new Response(JSON.stringify({ error: "Failed to join organization" }), { status: 500 });
  }
}

export async function DELETE(req: Request, { params: { id } }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });
  if (!id) return new Response("Missing organizationId", { status: 400 });
  try {
    // Delete the organizationMember entry to remove the user from the organization
    const deleteOrganizationMemberResult = await db.organization.update({
      where: {
        id: id,
      },
      data: {
        users: {
          disconnect: {
            id: session.user.id,
          },
        },
      },
      include: {
        users: true,
      }
    })

    if (deleteOrganizationMemberResult) {
      const deleteResult = await db.organization.delete({
        where: {
          id: id,
          adminId: session.user.id,
        },
      });

      if (!deleteResult) return new Response("Failed to delete organization", { status: 500 });
    } else return new Response("Failed to delete organization", { status: 500 });
    return new Response(JSON.stringify({ message: "Successfully left organization" }), { status: 200 });
  } catch (error) {
    console.log("DELETE /api/organization error: ", error);
    return new Response("Failed to leave organization", { status: 500 });
  }
}
