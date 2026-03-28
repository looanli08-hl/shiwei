import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get("postId");
  if (!postId) {
    return NextResponse.json({ error: "缺少 postId" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { postId, parentId: null },
    include: {
      author: { select: { nickname: true, isAI: true } },
      replies: {
        include: {
          author: { select: { nickname: true, isAI: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(comments);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { postId, content, parentId, isAnonymous } = await request.json();

  if (!postId || !content?.trim()) {
    return NextResponse.json({ error: "评论内容不能为空" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      content: content.trim(),
      postId,
      authorId: user.userId,
      parentId: parentId || null,
      isAnonymous: !!isAnonymous,
    },
    include: {
      author: { select: { nickname: true, isAI: true } },
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
