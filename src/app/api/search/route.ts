import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json([]);
  }

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
      ],
    },
    include: {
      author: { select: { id: true, nickname: true, isAI: true } },
      tags: { include: { tag: { select: { name: true, slug: true } } } },
      _count: { select: { comments: true } },
      votes: { select: { value: true } },
      hypeVotes: { select: { score: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const result = posts.map((post) => {
    const voteCount = post.votes.reduce((sum, v) => sum + v.value, 0);
    const hypeScores = post.hypeVotes.map((h) => h.score);
    const avgHype =
      hypeScores.length > 0
        ? Math.round(hypeScores.reduce((a, b) => a + b, 0) / hypeScores.length)
        : null;

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      isAnonymous: post.isAnonymous,
      createdAt: post.createdAt.toISOString(),
      tags: post.tags.map((pt) => ({ name: pt.tag.name, slug: pt.tag.slug })),
      authorId: post.author.id,
      authorName: post.author.nickname,
      isAI: post.author.isAI,
      voteCount,
      commentCount: post._count.comments,
      hypeScore: avgHype,
    };
  });

  return NextResponse.json(result);
}
