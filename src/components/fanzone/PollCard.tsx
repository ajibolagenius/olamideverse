"use client";

import { useState } from "react";
import { useFan } from "@/lib/fanzone/useFan";
import { votePoll } from "@/lib/fanzone/mutations";
import type { PollDef } from "@/lib/fanzone/polls";
import HandlePicker from "./HandlePicker";

export default function PollCard({
  poll,
  initialCounts,
  initialUserVote,
}: {
  poll: PollDef;
  /** Real vote counts from Supabase (not yet merged with the seed `base`). */
  initialCounts: Record<string, number>;
  initialUserVote: string | null;
}) {
  const fanState = useFan();
  const [userVote, setUserVote] = useState(initialUserVote);
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      poll.options.map((o) => [o.id, (poll.base[o.id] ?? 0) + (initialCounts[o.id] ?? 0)]),
    ),
  );
  const [pending, setPending] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const voted = Boolean(userVote);
  const total = Object.values(voteCounts).reduce((a, b) => a + b, 0);

  const castVote = async (optionId: string) => {
    setPending(true);
    await votePoll(poll.id, optionId);
    setUserVote(optionId);
    setVoteCounts((c) => ({ ...c, [optionId]: (c[optionId] ?? 0) + 1 }));
    setPending(false);
  };

  const handleVote = (optionId: string) => {
    if (voted || pending) return;
    if (!fanState.fan) {
      setShowPicker(true);
      return;
    }
    castVote(optionId);
  };

  return (
    <div className="border-2 border-ink bg-white p-4">
      <h3 className="font-display mb-2.5 text-lg">{poll.question}</h3>
      <div className="flex flex-col gap-1.5">
        {poll.options.map((option) => {
          const pct = voted && total > 0 ? Math.round((voteCounts[option.id] / total) * 100) : 0;
          return (
            <button
              key={option.id}
              type="button"
              disabled={voted || pending}
              onClick={() => handleVote(option.id)}
              className="relative overflow-hidden border-2 border-ink px-2.5 py-2 text-left text-sm font-semibold disabled:cursor-default"
            >
              {voted ? (
                <span
                  aria-hidden
                  className={`absolute inset-0 ${
                    option.id === userVote ? "bg-danfo-tint" : "bg-paper-dim"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              ) : null}
              <span className="relative flex justify-between">
                <span>
                  {option.label}
                  {option.id === userVote ? " — your pick" : ""}
                </span>
                {voted ? <span>{pct}%</span> : null}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[0.62rem] tracking-[0.04em] uppercase text-ink-soft">
        {voted ? `${total} votes total` : "Vote to see the results"}
      </p>
      {showPicker && !fanState.fan ? (
        <div className="mt-3">
          <HandlePicker fanState={fanState} onSaved={() => setShowPicker(false)} />
        </div>
      ) : null}
    </div>
  );
}
