import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, nickname: true, isAI: true, bio: true } },
      tags: { include: { tag: { select: { name: true, slug: true } } } },
      _count: { select: { comments: true } },
      votes: { select: { value: true } },
      hypeVotes: { select: { score: true } },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "帖子不存在" }, { status: 404 });
  }

  await prisma.post.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  const voteCount = post.votes.reduce((sum, v) => sum + v.value, 0);
  const hypeScores = post.hypeVotes.map((h) => h.score);
  const avgHype =
    hypeScores.length > 0
      ? Math.round(hypeScores.reduce((a, b) => a + b, 0) / hypeScores.length)
      : null;

  return NextResponse.json({
    id: post.id,
    title: post.title,
    content: post.content,
    isAnonymous: post.isAnonymous,
    createdAt: post.createdAt.toISOString(),
    viewCount: post.viewCount + 1,
    tags: post.tags.map((pt) => ({ name: pt.tag.name, slug: pt.tag.slug })),
    authorId: post.author.id,
    authorName: post.author.nickname,
    authorBio: post.author.bio,
    isAI: post.author.isAI,
    voteCount,
    commentCount: post._count.comments,
    hypeScore: avgHype,
    hypeVoteCount: hypeScores.length,
  });
}
