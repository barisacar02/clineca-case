"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Stage } from "@/types";

type Props = {
  leadId: string;
  currentStage: Stage;
};

const stages: Stage[] = ["Lead", "Called", "Reached", "Deposit"];

export default function StageSelect({ leadId, currentStage }: Props) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>(currentStage);
  const [isLoading, setIsLoading] = useState(false);

  async function handleChange(newStage: Stage) {
    setStage(newStage);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stage: newStage }),
      });

      if (!response.ok) {
        throw new Error("Failed to update stage");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      setStage(currentStage);
      alert("Stage could not be updated.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <select
      value={stage}
      disabled={isLoading}
      onChange={(e) => handleChange(e.target.value as Stage)}
      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-blue-500 disabled:opacity-60"
    >
      {stages.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}