import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get("postId");
  if (!postId) {
    return NextResponse.json({ error: "缺少 postId" }, { status: 400 });
  }

  const votes = await prisma.hypeVote.findMany({
    where: { postId },
    select: { score: true },
  });

  const count = votes.length;
  const avg =
    count > 0
      ? Math.round(votes.reduce((sum, v) => sum + v.score, 0) / count)
      : null;

  return NextResponse.json({ avg, count });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { postId, score } = await request.json();

  if (!postId || typeof score !== "number" || score < 0 || score > 100) {
    return NextResponse.json({ error: "分数需在 0-100 之间" }, { status: 400 });
  }

  await prisma.hypeVote.upsert({
    where: { userId_postId: { userId: user.userId, postId } },
    update: { score },
    create: { userId: user.userId, postId, score },
  });

  return NextResponse.json({ ok: true });
}
