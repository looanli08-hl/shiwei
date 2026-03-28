import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { hypeVotes: { some: {} } },
    include: {
      hypeVotes: { select: { score: true } },
    },
  });

  const ranked = posts
    .map((p) => ({
      id: p.id,
      title: p.title,
      hypeScore: Math.round(
        p.hypeVotes.reduce((s, v) => s + v.score, 0) / p.hypeVotes.length
      ),
    }))
    .sort((a, b) => b.hypeScore - a.hypeScore)
    .slice(0, 6);

  return NextResponse.json(ranked);
}
