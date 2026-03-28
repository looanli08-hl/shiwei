"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PostCard from "@/components/PostCard";

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
  hypeScore: number | null;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const search = useCallback(async () => {
    if (!q) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) setPosts(await res.json());
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    search();
  }, [search]);

  return (
    <div className="mx-auto max-w-[640px] px-4 py-8">
      <h1 className="text-lg font-semibold">
        搜索：{q}
      </h1>

      <div className="mt-4">
        {loading ? (
          <p className="py-12 text-center text-sm text-[var(--muted)]">
            搜索中…
          </p>
        ) : posts.length === 0 ? (
          <p className="py-12 text-center text-sm text-[var(--muted)]">
            没有找到相关内容
          </p>
        ) : (
          <>
            <p className="mb-4 text-sm text-[var(--muted)]">
              找到 {posts.length} 条结果
            </p>
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[640px] px-4 py-12 text-center text-sm text-[var(--muted)]">
          加载中…
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
