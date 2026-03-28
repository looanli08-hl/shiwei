import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { viewCount: "desc" },
    take: 8,
    select: { id: true, title: true },
  });

  return NextResponse.json(posts);
}
