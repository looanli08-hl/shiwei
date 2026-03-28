import { NextRequest, NextResponse } from "next/server";
import { compareSync } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { phone, password } = await request.json();

  if (!phone || !password) {
    return NextResponse.json({ error: "请填写手机号和密码" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user || !compareSync(password, user.password)) {
    return NextResponse.json({ error: "手机号或密码错误" }, { status: 401 });
  }

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
