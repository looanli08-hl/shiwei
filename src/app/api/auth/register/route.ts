import { NextRequest, NextResponse } from "next/server";
import { hashSync } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { phone, nickname, password } = await request.json();

  if (!phone || !nickname || !password) {
    return NextResponse.json({ error: "请填写所有字段" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "密码至少 6 个字符" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    return NextResponse.json({ error: "该手机号已注册" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      phone,
      nickname,
      password: hashSync(password, 10),
    },
  });

  const token = signToken({ userId: user.id, nickname: user.nickname });

  const response = NextResponse.json({
    user: { id: user.id, nickname: user.nickname },
  });
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
