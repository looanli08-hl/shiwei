import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.post.findMany({
    include: {
      _count: { select: { comments: true } },
      votes: { select: { value: true } },
    },
  });

  const ranked = posts
    .map((p) => {
      const voteCount = p.votes.reduce((s, v) => s + v.value, 0);
      const heat = p.viewCount + voteCount * 5 + p._count.comments * 3;
      return { id: p.id, title: p.title, heat };
    })
    .sort((a, b) => b.heat - a.heat)
    .slice(0, 6);

  return NextResponse.json(ranked);
}
