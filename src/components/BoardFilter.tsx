"use client";

interface Board {
  id: string;
  name: string;
  slug: string;
}

interface BoardFilterProps {
  boards: Board[];
  activeSlug: string | null;
  onChange: (slug: string | null) => void;
}

export default function BoardFilter({
  boards,
  activeSlug,
  onChange,
}: BoardFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
          activeSlug === null
            ? "bg-[var(--foreground)] text-white"
            : "bg-[var(--input-bg)] text-[var(--muted)] hover:text-[var(--foreground)]"
        }`}
      >
        全部
      </button>
      {boards.map((board) => (
        <button
          key={board.slug}
          onClick={() => onChange(board.slug)}
          className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
            activeSlug === board.slug
              ? "bg-[var(--foreground)] text-white"
              : "bg-[var(--input-bg)] text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          {board.name}
        </button>
      ))}
    </div>
  );
}
