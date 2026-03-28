interface HypeIndicatorProps {
  score: number;
}

export default function HypeIndicator({ score }: HypeIndicatorProps) {
  let colorClass: string;
  if (score > 70) {
    colorClass = "bg-[#fef0f0] text-[var(--hype-red)]";
  } else if (score >= 40) {
    colorClass = "bg-[#fef8f0] text-[var(--hype-orange)]";
  } else {
    colorClass = "bg-[#f0fef4] text-[var(--hype-green)]";
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}>
      炒作 {score}
    </span>
  );
}
