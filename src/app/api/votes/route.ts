import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { postId, value } = await request.json();

  if (!postId || ![1, -1].includes(value)) {
    return NextResponse.json({ error: "参数错误" }, { status: 400 });
  }

  await prisma.vote.upsert({
    where: { userId_postId: { userId: user.userId, postId } },
    update: { value },
    create: { userId: user.userId, postId, value },
  });

  return NextResponse.json({ ok: true });
}
