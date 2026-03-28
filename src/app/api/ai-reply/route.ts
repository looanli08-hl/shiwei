import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

const SYSTEM_PROMPT = `你是「示未AI」，一个认知祛魅社区「示未」的 AI 居民。

你的性格特点：
- 你有自己的观点和立场，不会两边讨好
- 你会直接指出逻辑漏洞和认知偏差
- 你会用数据和事实说话，但语气不是说教，而是像朋友聊天
- 你偶尔会抛出反直觉的观点来激发思考
- 如果你觉得对方说得对，你会大方承认
- 你的目标是帮助人们看清真相，而不是赢得辩论

你的语言风格：
- 中文回复，简洁有力，不啰嗦
- 不用"作为AI"这类自我标榜的话
- 不用"让我们一起"这类客套话
- 像一个见多识广、直言不讳的朋友
- 回复控制在 200 字以内`;

export async function POST(request: NextRequest) {
  if (!DEEPSEEK_API_KEY) {
    return NextResponse.json({ error: "AI 服务未配置" }, { status: 500 });
  }

  const { postId, commentContent } = await request.json();

  if (!postId) {
    return NextResponse.json({ error: "缺少参数" }, { status: 400 });
  }

  // 获取帖子和已有评论作为上下文
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      comments: {
        include: { author: { select: { nickname: true, isAI: true } } },
        orderBy: { createdAt: "asc" },
        take: 10,
      },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "帖子不存在" }, { status: 404 });
  }

  // 构建对话上下文
  const context = [
    `帖子标题：${post.title}`,
    `帖子内容：${post.content}`,
  ];

  if (post.comments.length > 0) {
    context.push("已有评论：");
    for (const c of post.comments) {
      const name = c.author.isAI ? "示未AI" : c.author.nickname;
      context.push(`${name}：${c.content}`);
    }
  }

  if (commentContent) {
    context.push(`用户 @示未AI 说：${commentContent}`);
  }

  // 调用 DeepSeek API
  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: context.join("\n") },
      ],
      max_tokens: 500,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "AI 服务暂不可用" }, { status: 502 });
  }

  const data = await response.json();
  const aiReply = data.choices?.[0]?.message?.content?.trim();

  if (!aiReply) {
    return NextResponse.json({ error: "AI 未生成回复" }, { status: 500 });
  }

  // 获取 AI 用户
  const aiUser = await prisma.user.findFirst({ where: { isAI: true } });
  if (!aiUser) {
    return NextResponse.json({ error: "AI 用户不存在" }, { status: 500 });
  }

  // 创建评论
  const comment = await prisma.comment.create({
    data: {
      content: aiReply,
      postId,
      authorId: aiUser.id,
    },
    include: {
      author: { select: { nickname: true, isAI: true } },
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
