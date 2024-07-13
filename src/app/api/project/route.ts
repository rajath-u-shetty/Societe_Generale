
import { authOptions } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });
  if (session.user.access === "USER") return new Response("Unauthorized", { status: 401 });
  const body = await req.json();
  const { organizationId, projectName } = body;
  if (!organizationId || !projectName) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }
  try {
    const subject = await db.project.create({
      data: {
        name: projectName,
        organizationId: organizationId,
      },
      include: {
        sops: true,
        users: true,
      }
    });

    if (!subject) {
      return new Response(JSON.stringify({ error: "Failed to create subject" }), { status: 500 });
    }

    return new Response(JSON.stringify(subject), { status: 200 });
  } catch (error) {
    console.error("POST /api/subject error: ", error);
    return new Response(JSON.stringify({ error: "Failed to create subject" }), { status: 500 });
  }
}
