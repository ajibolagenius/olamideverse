"use client";

import { useId, useState } from "react";
import Modal from "@/components/ui/Modal";
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
  const [error, setError] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pendingOption, setPendingOption] = useState<string | null>(null);

  const questionId = useId();
  const voted = Boolean(userVote);
  const total = Object.values(voteCounts).reduce((a, b) => a + b, 0);
  const votedLabel = poll.options.find((o) => o.id === userVote)?.label;

  const castVote = async (optionId: string) => {
    setPending(true);
    setError(null);
    try {
      const { previousOptionId } = await votePoll(
        poll.id,
        optionId,
        poll.options.map((o) => o.id),
      );
      setVoteCounts((c) => {
        const next = { ...c };
        if (previousOptionId && previousOptionId !== optionId) {
          next[previousOptionId] = Math.max(0, (next[previousOptionId] ?? 0) - 1);
          next[optionId] = (next[optionId] ?? 0) + 1;
        } else if (!previousOptionId) {
          next[optionId] = (next[optionId] ?? 0) + 1;
        }
        return next;
      });
      setUserVote(optionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't cast vote.");
    }
    setPending(false);
  };

  const handleVote = (optionId: string) => {
    if (pending || optionId === userVote) return;
    if (!fanState.fan) {
      setPendingOption(optionId);
      setShowPicker(true);
      return;
    }
    castVote(optionId);
  };

  return (
    <div className="ov-paste-up border-3 border-ink bg-white p-4 shadow-paste-sm">
      <h3 id={questionId} className="font-display mb-2.5 text-lg">
        {poll.question}
      </h3>
      <div
        role="radiogroup"
        aria-labelledby={questionId}
        className="flex flex-col gap-1.5"
      >
        {poll.options.map((option) => {
          const pct = voted && total > 0 ? Math.round((voteCounts[option.id] / total) * 100) : 0;
          const selected = option.id === userVote;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={pending || selected}
              onClick={() => handleVote(option.id)}
              className="relative overflow-hidden border-2 border-ink px-2.5 py-2 text-left text-sm font-semibold transition-colors hover:bg-danfo-tint disabled:cursor-default disabled:hover:bg-transparent"
            >
              {voted ? (
                <span
                  aria-hidden
                  className={`absolute inset-0 ${
                    selected ? "bg-danfo-tint" : "bg-paper-dim"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              ) : null}
              <span className="relative flex justify-between">
                <span>
                  {option.label}
                  {selected ? " — your pick" : ""}
                </span>
                {voted ? <span>{pct}%</span> : null}
              </span>
            </button>
          );
        })}
      </div>
      <p
        className="mt-2 text-[0.62rem] tracking-[0.04em] uppercase text-ink-soft"
        aria-live="polite"
      >
        {voted
          ? `You voted for ${votedLabel ?? "an option"} · ${total} votes total · tap another option to change`
          : "Vote to see the results"}
      </p>
      {error ? (
        <p role="alert" className="mt-2 text-xs text-oxide">
          {error}
        </p>
      ) : null}
      <Modal
        open={showPicker && !fanState.fan}
        onClose={() => {
          setShowPicker(false);
          setPendingOption(null);
        }}
        title="Fan account"
      >
        <HandlePicker
          fanState={fanState}
          prompt="Sign in to cast your vote."
          onSaved={() => {
            setShowPicker(false);
            if (pendingOption) castVote(pendingOption);
            setPendingOption(null);
          }}
        />
      </Modal>
    </div>
  );
}
