import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tagSlug = searchParams.get("tag");
  const sort = searchParams.get("sort") || "hot";
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = 20;

  const where = tagSlug
    ? { tags: { some: { tag: { slug: tagSlug } } } }
    : {};

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: { select: { id: true, nickname: true, isAI: true } },
      tags: { include: { tag: { select: { name: true, slug: true } } } },
      _count: { select: { comments: true, votes: true } },
      votes: { select: { value: true } },
      hypeVotes: { select: { score: true } },
    },
    orderBy: { createdAt: "desc" as const },
    skip: sort === "hot" ? 0 : (page - 1) * pageSize,
    take: sort === "hot" ? 100 : pageSize,
  });

  const result = posts.map((post) => {
    const voteCount = post.votes.reduce((sum, v) => sum + v.value, 0);
    const commentCount = post._count.comments;
    const heat = post.viewCount + voteCount * 5 + commentCount * 3;

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      isAnonymous: post.isAnonymous,
      createdAt: post.createdAt.toISOString(),
      tags: post.tags.map((pt) => ({
        name: pt.tag.name,
        slug: pt.tag.slug,
      })),
      authorId: post.author.id,
      authorName: post.author.nickname,
      isAI: post.author.isAI,
      voteCount,
      commentCount,
      heat,
    };
  });

  // 热门排序：综合赞同、评论、浏览量 + 时间衰减
  if (sort === "hot") {
    const now = Date.now();
    result.sort((a, b) => {
      const hoursA = (now - new Date(a.createdAt).getTime()) / 3600000;
      const hoursB = (now - new Date(b.createdAt).getTime()) / 3600000;
      const scoreA = (a.voteCount * 3 + a.commentCount * 2) / Math.pow(hoursA + 2, 1.2);
      const scoreB = (b.voteCount * 3 + b.commentCount * 2) / Math.pow(hoursB + 2, 1.2);
      return scoreB - scoreA;
    });
    return NextResponse.json(result.slice((page - 1) * pageSize, page * pageSize));
  }

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { title, content, tagNames, isAnonymous } = await request.json();

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "请填写标题和内容" }, { status: 400 });
  }

  // 处理标签：找到已有的或创建新的
  const tagIds: string[] = [];
  if (tagNames && Array.isArray(tagNames)) {
    for (const name of tagNames.slice(0, 5)) {
      const trimmed = name.trim().replace(/^#/, "");
      if (!trimmed) continue;
      const slug = trimmed.toLowerCase().replace(/\s+/g, "-");
      const tag = await prisma.tag.upsert({
        where: { slug },
        update: {},
        create: { name: trimmed, slug },
      });
      tagIds.push(tag.id);
    }
  }

  const post = await prisma.post.create({
    data: {
      title: title.trim(),
      content: content.trim(),
      authorId: user.userId,
      isAnonymous: !!isAnonymous,
      tags: {
        create: tagIds.map((tagId) => ({ tagId })),
      },
    },
  });

  return NextResponse.json({ id: post.id }, { status: 201 });
}
