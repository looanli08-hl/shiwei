import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { isJournal: true },
    include: {
      author: { select: { nickname: true, isAI: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const result = posts.map((post) => ({
    id: post.id,
    title: post.title,
    authorName: post.author.nickname,
    isAI: post.author.isAI,
    createdAt: post.createdAt.toISOString(),
    viewCount: post.viewCount,
  }));

  return NextResponse.json(result);
}
