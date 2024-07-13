import { authOptions } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function DELETE(req: Request, { params: { organizationId } }: { params: { organizationId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });
  if (!organizationId) return new Response("Missing organizationId", { status: 400 });
  try {
    const deleteResult = await db!.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        users: {
          disconnect: {
            id: session.user.id,
          },
        },
      },
    });

    if (!deleteResult) return new Response("Failed to leave classroom", { status: 500 });
    return new Response(JSON.stringify({ message: "Successfully left classroom" }), { status: 200 });
  } catch (error) {
    console.log("DELETE /api/classroom error: ", error);
    return new Response("Failed to leave classroom", { status: 500 });
  }
}
