type ScoreBadgeProps = {
  score: number | null;
};

export default function ScoreBadge({ score }: ScoreBadgeProps) {
  if (score === null) {
    return (
      <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
        No score
      </span>
    );
  }

  let label = "Low Intent";
  let className =
    "rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700";

  if (score >= 85) {
    label = "Hot Lead";
    className =
      "rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700";
  } else if (score >= 70) {
    label = "Strong Lead";
    className =
      "rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700";
  } else if (score >= 50) {
    label = "Warm / Researching";
    className =
      "rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700";
  }

  return (
    <span className={className}>
      {score} · {label}
    </span>
  );
}