import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 兼容旧接口，返回热门标签
export async function GET() {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { posts: { _count: "desc" } },
  });

  const result = tags.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    postCount: t._count.posts,
  }));

  return NextResponse.json(result);
}
