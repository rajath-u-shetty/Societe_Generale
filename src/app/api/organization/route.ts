import { authOptions } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) return new Response("Unauthorised", { status: 401 });
  try {
    const organization = await db!.organization.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        admin: true,
        projects: true,
        users: true,
      }
    });
    if (!organization)
      return new Response("No organization found", { status: 404 });
    return new Response(JSON.stringify(organization), { status: 200 });
  } catch (error) {
    console.log("GET /api/organization error: ", error);
    return new Response("Failed to fetch organization", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorised", { status: 401 });
  if (session.user.access === "USER") {
    return new Response("Unauthorised", { status: 401 });
  }
  try {
    const body = await req.json();
    const { organizationName, password } = body;
    const organization = await db.organization.create({
      data: {
        name: organizationName,
        users: {
          connect: {
            id: session.user.id,
          },
        },
        admin: {
          connect: {
            id: session.user.id,
          },
        },
        password: password,
      },
    });

    if (!organization) return new Response("Failed to create organization", { status: 500 });

    return new Response(JSON.stringify(organization), { status: 200 });
  } catch (error) {
    console.log("POST /api/organization error: ", error);
    return new Response("Failed to create organization", { status: 500 });
  }
}
