"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("两次密码不一致");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, nickname, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-52px)] max-w-sm flex-col justify-center px-4">
      <h1 className="mb-8 text-center text-2xl font-bold">注册</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="手机号"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg bg-[var(--input-bg)] px-4 py-3 text-sm outline-none placeholder:text-[#bbb]"
        />
        <input
          type="text"
          placeholder="昵称"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full rounded-lg bg-[var(--input-bg)] px-4 py-3 text-sm outline-none placeholder:text-[#bbb]"
        />
        <div className="relative">
          <input
            type={showPwd ? "text" : "password"}
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-[var(--input-bg)] px-4 py-3 pr-10 text-sm outline-none placeholder:text-[#bbb]"
          />
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            {showPwd ? "隐藏" : "显示"}
          </button>
        </div>
        <div className="relative">
          <input
            type={showPwd ? "text" : "password"}
            placeholder="确认密码"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg bg-[var(--input-bg)] px-4 py-3 pr-10 text-sm outline-none placeholder:text-[#bbb]"
          />
        </div>

        {error && (
          <p className="text-sm text-[var(--hype-red)]">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--foreground)] py-3 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {loading ? "注册中…" : "注册"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--muted)]">
        已有账号？
        <Link href="/auth/login" className="ml-1 text-[var(--accent)]">
          去登录
        </Link>
      </p>
    </div>
  );
}
