"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";


export const createOrg = async (req: Request) => {
  const session = await getServerSession();
  const { name } = await req.json();
  const org = await db!.organization.create({
    data: {
      name: name!,
      admin: {
        connect: {
          id: session!.user.id,
        },
      },
    }
  })

  return new Response(JSON.stringify(org), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
