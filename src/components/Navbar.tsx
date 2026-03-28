"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ComposeModal from "./ComposeModal";

const navItems = [
  { label: "广场", href: "/" },
  { label: "示未刊", href: "/journal" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showCompose, setShowCompose] = useState(false);
  const [user, setUser] = useState<{ userId: string; nickname: string } | null>(
    null
  );

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setUser(data.user));
  }, []);

  function handleComposeClick() {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setShowCompose(true);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.refresh();
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-[var(--border)]">
        <nav className="mx-auto flex h-[52px] max-w-[960px] items-center gap-6 px-4">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 text-xl font-black tracking-[4px]"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            示未
          </Link>

          {/* 导航项 */}
          <div className="flex items-center gap-5">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-4 text-sm transition-colors ${
                    isActive
                      ? "font-semibold text-[var(--foreground)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--foreground)]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* 右侧 */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <input
              type="text"
              placeholder="搜索"
              className="hidden sm:block h-8 w-44 rounded-[18px] bg-[var(--input-bg)] px-4 text-sm outline-none placeholder:text-[#bbb]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const q = (e.target as HTMLInputElement).value.trim();
                  if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
                }
              }}
            />

            <button
              onClick={handleComposeClick}
              className="flex h-8 items-center rounded-[18px] bg-[var(--foreground)] px-4 text-sm text-white transition-opacity hover:opacity-80"
            >
              发帖
            </button>

            {user ? (
              <Link
                href={`/user/${user.userId}`}
                className="text-sm hover:text-[var(--accent)] transition-colors"
              >
                我的
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                登录
              </Link>
            )}
          </div>
        </nav>
      </header>

      <ComposeModal
        open={showCompose}
        onClose={() => setShowCompose(false)}
        onSuccess={() => router.refresh()}
      />
    </>
  );
}
