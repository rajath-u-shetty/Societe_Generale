import { authOptions } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { AiResponse } from "@/lib/types";
import { getServerSession } from "next-auth";

type SOPType = AiResponse;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  const body = await req.json();
  if (!body.sopText) {
    return new Response(JSON.stringify({ error: "No SOP Text" }), { status: 400 });
  }

  const { givenSopItems, enhancedSopItems, scoreOfEnteredSOPItems, description }: SOPType = body.sopText;
  const name = body.name;

  console.log(body)

  const project = await db!.project.findFirst({ where: { id: body.projectId } });
  if (!project) {
    return new Response(JSON.stringify({ error: "No project found" }), { status: 400 });
  }

  const newSopItems = await db!.sOP.create({
    data: {
      project: {
        connect: {
          id: body.projectId,
        },
      },
      createdBy: {
        connect: {
          id: session.user.id!,
        },
      },
      name: name,
      content: JSON.stringify(givenSopItems),
      aiContent: JSON.stringify(enhancedSopItems),
      AiScore: Number(scoreOfEnteredSOPItems),
      description: description,
    },
  });

  return new Response(JSON.stringify(newSopItems), { status: 201 });
}
