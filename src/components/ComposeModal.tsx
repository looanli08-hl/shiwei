"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ComposeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ComposeModal({
  open,
  onClose,
  onSuccess,
}: ComposeModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  function addTag() {
    const trimmed = tagInput.trim().replace(/^#/, "");
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("标题和内容不能为空");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, tagNames: tags, isAnonymous }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setTitle("");
    setContent("");
    setTags([]);
    setIsAnonymous(false);
    onClose();
    router.push(`/post/${data.id}`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">发帖</h2>
          <button
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="text"
            placeholder="标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg bg-[var(--input-bg)] px-3 py-2 text-sm outline-none placeholder:text-[#bbb]"
          />

          <textarea
            placeholder="写下你的想法…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full resize-none rounded-lg bg-[var(--input-bg)] px-3 py-2 text-sm leading-relaxed outline-none placeholder:text-[#bbb]"
          />

          {/* 标签输入 */}
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="添加话题标签（最多 5 个）"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="flex-1 rounded-lg bg-[var(--input-bg)] px-3 py-2 text-sm outline-none placeholder:text-[#bbb]"
              />
              <button
                type="button"
                onClick={addTag}
                className="rounded-lg bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                添加
              </button>
            </div>
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-[var(--input-bg)] px-2.5 py-1 text-xs"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-[var(--muted)] hover:text-[var(--foreground)]"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            匿名发帖
          </label>

          {error && (
            <p className="text-sm text-[var(--hype-red)]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--foreground)] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {loading ? "发布中…" : "发布"}
          </button>
        </form>
      </div>
    </div>
  );
}
