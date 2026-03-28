import Link from "next/link";
import HypeIndicator from "./HypeIndicator";

interface TagInfo {
  name: string;
  slug: string;
}

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  tags: TagInfo[];
  authorId: string;
  authorName: string;
  isAI: boolean;
  isAnonymous: boolean;
  createdAt: string;
  voteCount: number;
  commentCount: number;
  hypeScore?: number | null;
  onTagClick?: (slug: string) => void;
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

export default function PostCard({
  id,
  title,
  content,
  tags,
  authorId,
  authorName,
  isAI,
  isAnonymous,
  createdAt,
  voteCount,
  commentCount,
  hypeScore,
  onTagClick,
}: PostCardProps) {
  const displayName = isAnonymous ? "匿名用户" : authorName;

  return (
    <article className="border-b border-[var(--border)] py-4">
      {/* 第一行：作者 · 时间 */}
      <div className="flex items-center gap-1.5 text-xs text-[#aaa]">
        {isAnonymous ? (
          <span>{displayName}</span>
        ) : (
          <Link href={`/user/${authorId}`} className="hover:text-[var(--foreground)] transition-colors">
            {displayName}
          </Link>
        )}
        {isAI && (
          <span className="rounded px-1 py-0.5 text-[10px] font-medium text-[var(--ai-purple)] bg-[#f0edf8]">
            AI
          </span>
        )}
        <span>·</span>
        <span>{timeAgo(createdAt)}</span>
      </div>

      {/* 标题 */}
      <Link href={`/post/${id}`}>
        <h2 className="mt-1.5 text-base font-semibold leading-snug hover:text-[var(--accent)] transition-colors">
          {title}
        </h2>
      </Link>

      {/* 内容预览 */}
      <p className="mt-1 text-sm text-[#888] line-clamp-2 leading-relaxed">
        {content}
      </p>

      {/* 标签 + 互动数据 */}
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        {tags.map((tag) => (
          <button
            key={tag.slug}
            onClick={() => onTagClick?.(tag.slug)}
            className="rounded-full bg-[var(--input-bg)] px-2 py-0.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            #{tag.name}
          </button>
        ))}
        <span className="text-xs text-[#bbb]">
          {voteCount > 0 ? `${voteCount} 赞同 · ` : ""}
          {commentCount} 评论
        </span>
        {hypeScore != null && <HypeIndicator score={hypeScore} />}
      </div>
    </article>
  );
}
