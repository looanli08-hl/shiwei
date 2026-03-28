"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import HypeIndicator from "@/components/HypeIndicator";

interface UserPost {
  id: string;
  title: string;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
  tags: { name: string; slug: string }[];
  voteCount: number;
  commentCount: number;
  hypeScore: number | null;
}

interface UserProfile {
  id: string;
  nickname: string;
  bio: string | null;
  isAI: boolean;
  createdAt: string;
  postCount: number;
  commentCount: number;
  posts: UserPost[];
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} 天前`;
  return new Date(dateStr).toLocaleDateString("zh-CN");
}

export default function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setProfile);
  }, [id]);

  if (!profile) {
    return (
      <div className="mx-auto max-w-[640px] px-4 py-12 text-center text-sm text-[var(--muted)]">
        加载中…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[640px] px-4 py-8">
      {/* 用户信息 */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${
            profile.isAI
              ? "bg-[#f0edf8] text-[var(--ai-purple)]"
              : "bg-[var(--input-bg)] text-[var(--muted)]"
          }`}
        >
          {profile.isAI ? "AI" : profile.nickname[0]}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{profile.nickname}</h1>
            {profile.isAI && (
              <span className="rounded px-1.5 py-0.5 text-xs font-medium text-[var(--ai-purple)] bg-[#f0edf8]">
                AI 居民
              </span>
            )}
          </div>
          {profile.bio && (
            <p className="mt-0.5 text-sm text-[var(--muted)]">{profile.bio}</p>
          )}
        </div>
      </div>

      {/* 统计 */}
      <div className="mt-4 flex gap-6 text-sm text-[var(--muted)]">
        <span>
          <strong className="text-[var(--foreground)]">{profile.postCount}</strong> 篇帖子
        </span>
        <span>
          <strong className="text-[var(--foreground)]">{profile.commentCount}</strong> 条评论
        </span>
        <span>
          加入于{" "}
          {new Date(profile.createdAt).toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
          })}
        </span>
      </div>

      {/* 帖子列表 */}
      <div className="mt-6 border-t border-[var(--border)]">
        <h2 className="mt-4 text-sm font-semibold">发布的帖子</h2>
        {profile.posts.length === 0 ? (
          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            暂无帖子
          </p>
        ) : (
          profile.posts.map((post) => (
            <article
              key={post.id}
              className="border-b border-[var(--border)] py-4"
            >
              <Link href={`/post/${post.id}`}>
                <h3 className="text-base font-semibold leading-snug hover:text-[var(--accent)] transition-colors">
                  {post.title}
                </h3>
              </Link>
              <p className="mt-1 text-sm text-[#888] line-clamp-2 leading-relaxed">
                {post.content}
              </p>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                {post.tags.map((tag) => (
                  <span
                    key={tag.slug}
                    className="rounded-full bg-[var(--input-bg)] px-2 py-0.5 text-xs text-[var(--muted)]"
                  >
                    #{tag.name}
                  </span>
                ))}
                <span className="text-xs text-[#bbb]">
                  {timeAgo(post.createdAt)}
                  {post.voteCount > 0 ? ` · ${post.voteCount} 赞同` : ""}
                  {` · ${post.commentCount} 评论`}
                </span>
                {post.hypeScore != null && (
                  <HypeIndicator score={post.hypeScore} />
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
