"use client";

import { useEffect, useState } from "react";

interface Comment {
  id: string;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
  author: { nickname: string; isAI: boolean };
  replies: Comment[];
}

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?postId=${postId}`)
      .then((r) => r.json())
      .then(setComments);
  }, [postId]);

  async function submitComment(parentId: string | null, text: string) {
    setLoading(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, content: text, parentId }),
    });
    setLoading(false);

    if (res.ok) {
      // 重新加载评论
      const updated = await fetch(`/api/comments?postId=${postId}`).then((r) =>
        r.json()
      );
      setComments(updated);
      setContent("");
      setReplyTo(null);
      setReplyContent("");
    }
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "刚刚";
    if (minutes < 60) return `${minutes} 分钟前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} 小时前`;
    const days = Math.floor(hours / 24);
    return `${days} 天前`;
  }

  function renderComment(comment: Comment, isReply = false) {
    const displayName = comment.isAnonymous
      ? "匿名用户"
      : comment.author.nickname;

    return (
      <div
        key={comment.id}
        className={`${isReply ? "ml-8 mt-3" : "mt-4"} border-b border-[var(--border)] pb-3`}
      >
        <div className="flex items-center gap-1.5 text-xs text-[#aaa]">
          <span className="font-medium text-[#666]">{displayName}</span>
          {comment.author.isAI && (
            <span className="rounded px-1 py-0.5 text-[10px] font-medium text-[var(--ai-purple)] bg-[#f0edf8]">
              AI
            </span>
          )}
          <span>·</span>
          <span>{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-[#333]">
          {comment.content}
        </p>
        {!isReply && (
          <button
            onClick={() => setReplyTo(comment.id)}
            className="mt-1 text-xs text-[var(--muted)] hover:text-[var(--accent)]"
          >
            回复
          </button>
        )}

        {/* 回复输入框 */}
        {replyTo === comment.id && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="写下回复…"
              className="flex-1 rounded-lg bg-[var(--input-bg)] px-3 py-1.5 text-sm outline-none placeholder:text-[#bbb]"
            />
            <button
              onClick={() => submitComment(comment.id, replyContent)}
              disabled={loading || !replyContent.trim()}
              className="rounded-lg bg-[var(--foreground)] px-3 py-1.5 text-sm text-white disabled:opacity-50"
            >
              发送
            </button>
          </div>
        )}

        {/* 嵌套回复 */}
        {comment.replies?.map((reply) => renderComment(reply, true))}
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold">评论</h3>

      {/* 评论输入 */}
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="写下评论…"
          className="flex-1 rounded-lg bg-[var(--input-bg)] px-4 py-2 text-sm outline-none placeholder:text-[#bbb]"
          onKeyDown={(e) => {
            if (e.key === "Enter" && content.trim()) {
              submitComment(null, content);
            }
          }}
        />
        <button
          onClick={() => submitComment(null, content)}
          disabled={loading || !content.trim()}
          className="rounded-lg bg-[var(--foreground)] px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          发送
        </button>
      </div>

      {/* 评论列表 */}
      {comments.length === 0 ? (
        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          暂无评论，来发表第一条吧
        </p>
      ) : (
        comments.map((c) => renderComment(c))
      )}
    </div>
  );
}
