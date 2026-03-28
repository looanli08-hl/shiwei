"use client";

import { useState } from "react";

interface HypeVoteSliderProps {
  postId: string;
}

export default function HypeVoteSlider({ postId }: HypeVoteSliderProps) {
  const [score, setScore] = useState(50);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    const res = await fetch("/api/hype", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, score }),
    });
    setLoading(false);
    if (res.ok) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <p className="mt-3 text-sm text-[var(--muted)]">
        已提交评分：{score} 分
      </p>
    );
  }

  return (
    <div className="mt-3">
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={100}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="flex-1 accent-[var(--foreground)]"
        />
        <span className="w-8 text-right text-sm font-medium">{score}</span>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-lg bg-[var(--foreground)] px-3 py-1 text-sm text-white disabled:opacity-50"
        >
          提交
        </button>
      </div>
      <div className="mt-1 flex justify-between text-xs text-[var(--muted)]">
        <span>不炒作</span>
        <span>严重炒作</span>
      </div>
    </div>
  );
}
