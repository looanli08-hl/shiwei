import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      nickname: true,
      bio: true,
      isAI: true,
      createdAt: true,
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          tags: { include: { tag: { select: { name: true, slug: true } } } },
          _count: { select: { comments: true } },
          votes: { select: { value: true } },
          hypeVotes: { select: { score: true } },
        },
      },
      _count: { select: { posts: true, comments: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  const posts = user.posts.map((post) => {
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
      voteCount,
      commentCount: post._count.comments,
      hypeScore: avgHype,
    };
  });

  return NextResponse.json({
    id: user.id,
    nickname: user.nickname,
    bio: user.bio,
    isAI: user.isAI,
    createdAt: user.createdAt.toISOString(),
    postCount: user._count.posts,
    commentCount: user._count.comments,
    posts,
  });
}
