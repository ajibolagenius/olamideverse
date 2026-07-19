"use client";

import { useState } from "react";
import { useFan } from "@/lib/fanzone/useFan";
import {
  postComment,
  deleteComment,
  reportComment,
} from "@/lib/fanzone/mutations";
import type { CommentRow } from "@/lib/fanzone/queries";
import HandlePicker from "./HandlePicker";

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function CommentBox({
  threadId,
  threadLabel,
  initialComments,
}: {
  threadId: string;
  threadLabel: string;
  initialComments: CommentRow[];
}) {
  const fanState = useFan();
  const [comments, setComments] = useState(initialComments);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reported, setReported] = useState<Record<string, boolean>>({});

  const submit = async () => {
    const body = draft.trim();
    if (!body || !fanState.fan) return;
    setPosting(true);
    setError(null);
    try {
      await postComment(threadId, body);
      setComments((c) => [
        {
          id: crypto.randomUUID(),
          body,
          created_at: new Date().toISOString(),
          fan: { handle: fanState.fan!.handle },
        },
        ...c,
      ]);
      setDraft("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't post.");
    }
    setPosting(false);
  };

  const remove = async (id: string) => {
    setComments((c) => c.filter((comment) => comment.id !== id));
    await deleteComment(id);
  };

  const report = async (id: string) => {
    if (!fanState.fan || reported[id]) return;
    setError(null);
    try {
      await reportComment(id, "Flagged from comment thread");
      setReported((r) => ({ ...r, [id]: true }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't report.");
    }
  };

  return (
    <div className="border-[3px] border-ink bg-white shadow-paste">
      <div className="flex items-center justify-between border-b-[3px] border-ink bg-ink px-5 py-2.5 text-paper">
        <h3 className="font-display text-lg">{threadLabel}</h3>
        <span className="text-xs tracking-[0.05em] uppercase text-ink-muted">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </span>
      </div>

      <div className="p-5">
        {error ? <p className="mb-3 text-sm text-oxide">{error}</p> : null}

        {fanState.fan ? (
          <div className="mb-5 flex gap-2.5">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              placeholder={`Comment as ${fanState.fan.handle}…`}
              maxLength={2000}
              className="flex-1 border-2 border-ink px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={submit}
              disabled={posting || !draft.trim()}
              className="border-2 border-ink bg-danfo px-4 py-2 text-sm font-bold tracking-[0.05em] uppercase text-ink disabled:opacity-50"
            >
              Post
            </button>
          </div>
        ) : (
          <div className="mb-5">
            <HandlePicker fanState={fanState} />
          </div>
        )}

        {comments.length === 0 ? (
          <p className="text-sm text-ink-soft">
            No comments yet — be the first to say something.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {comments.map((comment) => (
              <li key={comment.id} className="border-t-2 border-ink pt-3 first:border-t-0 first:pt-0">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-bold">{comment.fan?.handle ?? "A fan"}</span>
                  <span className="text-xs text-ink-soft">{timeAgo(comment.created_at)}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed">{comment.body}</p>
                <div className="mt-1 flex gap-3">
                  {fanState.fan?.handle === comment.fan?.handle ? (
                    <button
                      type="button"
                      onClick={() => remove(comment.id)}
                      className="text-xs font-bold uppercase text-ink-soft hover:text-oxide"
                    >
                      Delete
                    </button>
                  ) : fanState.fan ? (
                    <button
                      type="button"
                      onClick={() => report(comment.id)}
                      disabled={reported[comment.id]}
                      className="text-xs font-bold uppercase text-ink-soft hover:text-oxide disabled:opacity-50"
                    >
                      {reported[comment.id] ? "Reported" : "Report"}
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
