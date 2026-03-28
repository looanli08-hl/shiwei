import Link from "next/link";

interface TrendingPost {
  id: string;
  title: string;
  hypeScore?: number | null;
}

interface TagRank {
  name: string;
  slug: string;
  postCount: number;
}

interface TrendingSidebarProps {
  trending: TrendingPost[];
  hotTags: TagRank[];
  hypeRanking: TrendingPost[];
  onTagClick: (slug: string) => void;
}

export default function TrendingSidebar({
  trending,
  hotTags,
  hypeRanking,
  onTagClick,
}: TrendingSidebarProps) {
  return (
    <aside className="w-60 shrink-0 space-y-4">
      {/* 热议话题 */}
      <div className="rounded-lg bg-[var(--card-bg)] p-4">
        <h3 className="mb-3 text-sm font-semibold">🔥 热议话题</h3>
        <div className="flex flex-wrap gap-1.5">
          {hotTags.map((tag, i) => (
            <button
              key={tag.slug}
              onClick={() => onTagClick(tag.slug)}
              className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs transition-colors hover:bg-[var(--input-bg)]"
            >
              <span
                className={`font-semibold ${i < 3 ? "text-[var(--accent)]" : "text-[#ccc]"}`}
              >
                {i + 1}
              </span>
              <span className="text-[var(--foreground)]">#{tag.name}</span>
              <span className="text-[#ccc]">{tag.postCount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 热门讨论 */}
      <div className="rounded-lg bg-[var(--card-bg)] p-4">
        <h3 className="mb-3 text-sm font-semibold">📈 正在讨论</h3>
        <ol className="space-y-2.5">
          {trending.map((post, index) => (
            <li key={post.id} className="flex gap-2">
              <span
                className={`shrink-0 text-sm font-semibold ${
                  index < 3 ? "text-[var(--accent)]" : "text-[#ccc]"
                }`}
              >
                {index + 1}
              </span>
              <Link
                href={`/post/${post.id}`}
                className="text-sm leading-snug hover:text-[var(--accent)] transition-colors line-clamp-2"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ol>
      </div>

      {/* 炒作指数榜 */}
      {hypeRanking.length > 0 && (
        <div className="rounded-lg bg-[var(--card-bg)] p-4">
          <h3 className="mb-3 text-sm font-semibold">🎯 炒作指数榜</h3>
          <ol className="space-y-2.5">
            {hypeRanking.map((post, index) => (
              <li key={post.id} className="flex items-start gap-2">
                <span
                  className={`shrink-0 text-sm font-semibold ${
                    (post.hypeScore ?? 0) > 70
                      ? "text-[var(--hype-red)]"
                      : (post.hypeScore ?? 0) >= 40
                        ? "text-[var(--hype-orange)]"
                        : "text-[var(--hype-green)]"
                  }`}
                >
                  {post.hypeScore}
                </span>
                <Link
                  href={`/post/${post.id}`}
                  className="text-sm leading-snug hover:text-[var(--accent)] transition-colors line-clamp-2"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* AI 居民卡片 */}
      <div className="rounded-lg bg-[var(--card-bg)] p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0edf8] text-xs font-bold text-[var(--ai-purple)]">
            AI
          </div>
          <div>
            <div className="text-sm font-semibold">示未 AI 居民</div>
            <div className="text-xs text-[var(--muted)]">
              分析热点含金量，参与讨论
            </div>
          </div>
        </div>
      </div>

      {/* 示未刊入口 */}
      <Link
        href="/journal"
        className="block rounded-lg bg-[var(--card-bg)] p-4 transition-colors hover:bg-[#f0f0f0]"
      >
        <div
          className="text-base font-bold"
          style={{ fontFamily: "var(--font-serif-sc), 'Noto Serif SC', serif" }}
        >
          示未刊
        </div>
        <div className="mt-1 text-xs text-[var(--muted)]">
          社区精选深度长文
        </div>
      </Link>

      {/* 版权 */}
      <div className="text-xs text-[#ccc]">
        <p>© 2026 示未 SHIWEI</p>
        <p className="mt-1">世界的奥秘就是祛魅</p>
      </div>
    </aside>
  );
}
