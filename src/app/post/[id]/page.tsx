"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import CommentSection from "@/components/CommentSection";

interface PostDetail {
  id: string;
  title: string;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
  viewCount: number;
  tags: { name: string; slug: string }[];
  authorId: string;
  authorName: string;
  authorBio: string | null;
  isAI: boolean;
  voteCount: number;
  commentCount: number;
  hypeScore: number | null;
  hypeVoteCount: number;
}

export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [post, setPost] = useState<PostDetail | null>(null);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setPost);
  }, [id]);

  async function handleVote(value: number) {
    const res = await fetch("/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: id, value }),
    });
    if (res.ok) {
      setVoted(true);
      setPost((p) => (p ? { ...p, voteCount: p.voteCount + value } : p));
    }
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-[640px] px-4 py-12 text-center text-sm text-[var(--muted)]">
        加载中…
      </div>
    );
  }

  const displayName = post.isAnonymous ? "匿名用户" : post.authorName;

  return (
    <div className="mx-auto max-w-[640px] px-4 py-8">
      {/* 作者信息 */}
      <div className="flex items-center gap-1.5 text-xs text-[#aaa]">
        {post.isAnonymous ? (
          <span>{displayName}</span>
        ) : (
          <Link href={`/user/${post.authorId}`} className="hover:text-[var(--foreground)] transition-colors">
            {displayName}
          </Link>
        )}
        {post.isAI && (
          <span className="rounded px-1 py-0.5 text-[10px] font-medium text-[var(--ai-purple)] bg-[#f0edf8]">
            AI
          </span>
        )}
        <span>·</span>
        <span>
          {new Date(post.createdAt).toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <span>·</span>
        <span>{post.viewCount} 次浏览</span>
      </div>

      {/* 标题 */}
      <h1
        className="mt-4 text-[22px] font-bold leading-tight"
        style={{ fontFamily: "var(--font-serif-sc), 'Noto Serif SC', serif" }}
      >
        {post.title}
      </h1>

      {/* 标签 */}
      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/?tag=${tag.slug}`}
              className="rounded-full bg-[var(--input-bg)] px-2.5 py-1 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}

      {/* 正文 */}
      <div className="mt-6 whitespace-pre-wrap text-[15px] leading-[1.8] text-[#333]">
        {post.content}
      </div>

      {/* 操作栏 */}
      <div className="mt-8 flex items-center gap-4 border-y border-[var(--border)] py-3 text-sm text-[var(--muted)]">
        <button
          onClick={() => handleVote(1)}
          disabled={voted}
          className={`transition-colors ${voted ? "text-[var(--accent)]" : "hover:text-[var(--foreground)]"}`}
        >
          ▲ 赞同 {post.voteCount > 0 ? post.voteCount : ""}
        </button>
        <span>{post.commentCount} 评论</span>
        <span>{post.viewCount} 浏览</span>
      </div>

      {/* 评论区 */}
      <CommentSection postId={post.id} />
    </div>
  );
}
