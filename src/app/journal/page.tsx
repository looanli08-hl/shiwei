"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface JournalPost {
  id: string;
  title: string;
  authorName: string;
  isAI: boolean;
  createdAt: string;
  viewCount: number;
}

export default function JournalPage() {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/journal")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-[640px] px-4 py-12">
      {/* 期号标识 */}
      <div className="text-center">
        <p className="text-xs tracking-[6px] text-[var(--muted)] uppercase">
          示未刊 / SHIWEI JOURNAL · VOL.1 · 2026
        </p>
        <h1
          className="mt-4 text-[28px] font-black leading-tight"
          style={{
            fontFamily: "var(--font-serif-sc), 'Noto Serif SC', serif",
          }}
        >
          世界的奥秘就是祛魅
        </h1>
        <p className="mt-3 text-[15px] text-[#888]">
          社区精选深度长文，收录值得反复阅读的思考
        </p>
      </div>

      {/* 分割线 */}
      <div className="mt-8 border-t border-[var(--border)]" />

      {/* 文章列表 */}
      <div className="mt-6">
        {loading ? (
          <p className="text-center text-sm text-[var(--muted)]">加载中…</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-sm text-[var(--muted)]">
            暂无收录文章
          </p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="block border-b border-[#eee] py-5 transition-colors hover:bg-[var(--card-bg)]"
            >
              <div className="text-xs text-[var(--muted)]">
                {new Date(post.createdAt).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <h2
                className="mt-1.5 text-lg font-semibold leading-snug"
                style={{
                  fontFamily:
                    "var(--font-serif-sc), 'Noto Serif SC', serif",
                }}
              >
                {post.title}
              </h2>
              <div className="mt-1.5 flex items-center gap-2 text-xs text-[var(--muted)]">
                <span>{post.authorName}</span>
                {post.isAI && (
                  <span className="rounded px-1 py-0.5 text-[10px] font-medium text-[var(--ai-purple)] bg-[#f0edf8]">
                    AI
                  </span>
                )}
                <span>·</span>
                <span>{post.viewCount} 次阅读</span>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* 投稿卡片 */}
      <div className="mt-8 rounded-lg border border-[var(--border)] p-6 text-center">
        <h3
          className="text-base font-bold"
          style={{
            fontFamily: "var(--font-serif-sc), 'Noto Serif SC', serif",
          }}
        >
          投稿至示未刊
        </h3>
        <p className="mt-2 text-sm text-[var(--muted)]">
          在广场发表深度内容，优质文章将被收录至示未刊
        </p>
      </div>
    </div>
  );
}
