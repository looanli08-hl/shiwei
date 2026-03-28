"use client";

import { useEffect, useState, useCallback } from "react";
import PostCard from "@/components/PostCard";
import TrendingSidebar from "@/components/TrendingSidebar";

interface TagInfo {
  name: string;
  slug: string;
  postCount: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  tags: { name: string; slug: string }[];
  authorId: string;
  authorName: string;
  isAI: boolean;
  isAnonymous: boolean;
  createdAt: string;
  voteCount: number;
  commentCount: number;
  heat: number;
}

interface TrendingPost {
  id: string;
  title: string;
  heat?: number;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [hotTags, setHotTags] = useState<TagInfo[]>([]);
  const [trending, setTrending] = useState<TrendingPost[]>([]);
  const [hypeRanking, setHypeRanking] = useState<TrendingPost[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sort, setSort] = useState<"hot" | "new">("hot");
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort });
      if (activeTag) params.set("tag", activeTag);
      const res = await fetch(`/api/posts?${params}`);
      if (res.ok) setPosts(await res.json());
    } finally {
      setLoading(false);
    }
  }, [activeTag, sort]);

  useEffect(() => {
    fetch("/api/boards")
      .then((r) => (r.ok ? r.json() : []))
      .then(setHotTags);
    fetch("/api/posts/trending")
      .then((r) => (r.ok ? r.json() : []))
      .then(setTrending);
    fetch("/api/posts/hype-ranking")
      .then((r) => (r.ok ? r.json() : []))
      .then(setHypeRanking);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  function handleTagClick(slug: string) {
    setActiveTag((prev) => (prev === slug ? null : slug));
  }

  return (
    <div className="mx-auto flex max-w-[960px] gap-10 px-4 py-6 lg:gap-10">
      {/* 左侧主区域 */}
      <div className="min-w-0 flex-1 w-full">
        {/* 当前筛选标签 */}
        {activeTag && (
          <div className="mb-3 flex items-center gap-2">
            <span className="text-sm text-[var(--muted)]">当前话题：</span>
            <span className="rounded-full bg-[var(--foreground)] px-3 py-1 text-xs text-white">
              #{hotTags.find((t) => t.slug === activeTag)?.name || activeTag}
            </span>
            <button
              onClick={() => setActiveTag(null)}
              className="text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              清除
            </button>
          </div>
        )}

        {/* 排序切换 */}
        <div className="flex gap-4 border-b border-[var(--border)]">
          {(["hot", "new"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`relative pb-2 text-sm transition-colors ${
                sort === s
                  ? "font-semibold text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {s === "hot" ? "热门" : "最新"}
              {sort === s && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--foreground)]" />
              )}
            </button>
          ))}
        </div>

        {/* 帖子列表 */}
        <div className="mt-2">
          {loading ? (
            <div className="py-12 text-center text-sm text-[var(--muted)]">
              加载中…
            </div>
          ) : posts.length === 0 ? (
            <div className="py-12 text-center text-sm text-[var(--muted)]">
              暂无帖子
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} {...post} onTagClick={handleTagClick} />
            ))
          )}
        </div>
      </div>

      {/* 右侧榜单栏 - 手机隐藏 */}
      <div className="hidden lg:block">
      <TrendingSidebar
        trending={trending}
        hotTags={hotTags}
        hypeRanking={hypeRanking}
        onTagClick={handleTagClick}
      />
      </div>
    </div>
  );
}
