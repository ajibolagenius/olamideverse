import {
  AdminPageHeader,
  AdminTable,
  EmptyState,
  Field,
  Flash,
} from "@/components/admin/ui";
import { deletePoll, savePoll } from "@/lib/admin/actions/fanzone";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPollsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const flash = await searchParams;
  const supabase = await createClient();
  const [{ data: polls }, { data: results }] = await Promise.all([
    supabase.from("cms_polls").select("*").order("sort_order"),
    supabase.from("poll_results").select("*"),
  ]);

  const votesByPoll = new Map<string, Record<string, number>>();
  for (const r of results ?? []) {
    const cur = votesByPoll.get(r.poll_id) ?? {};
    cur[r.option_id] = r.votes;
    votesByPoll.set(r.poll_id, cur);
  }

  return (
    <>
      <AdminPageHeader
        title="Polls"
        description="Poll definitions for Fan Zone. Live vote counts come from poll_votes."
      />
      <Flash saved={flash.saved} />

      {!polls?.length ? (
        <EmptyState>
          No CMS polls. Seed imports the static POLL_DEFS from the app.
        </EmptyState>
      ) : (
        <AdminTable headers={["Poll", "Scope", "Active", "Live votes", ""]}>
          {polls.map((poll) => (
            <tr key={poll.id} className="align-top hover:bg-paper">
              <td className="px-3 py-2">
                <p className="font-semibold">{poll.question}</p>
                <p className="font-mono text-[0.65rem] text-ink-soft">{poll.id}</p>
              </td>
              <td className="px-3 py-2 text-xs">
                {poll.scope_type ? `${poll.scope_type}: ${poll.scope_slug}` : "Fan Zone only"}
              </td>
              <td className="px-3 py-2 text-sm">{poll.active ? "Yes" : "No"}</td>
              <td className="px-3 py-2 text-xs">
                {JSON.stringify(votesByPoll.get(poll.id) ?? {})}
              </td>
              <td className="px-3 py-2 text-right">
                <form action={deletePoll}>
                  <input type="hidden" name="id" value={poll.id} />
                  <button
                    type="submit"
                    className="text-xs font-bold uppercase text-oxide underline"
                  >
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      <h2 className="mt-10 mb-3 font-display text-xl uppercase">
        {polls?.length ? "Edit / add poll" : "Add poll"}
      </h2>
      <form action={savePoll} className="space-y-4 border-2 border-ink bg-white p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="ID"
            name="id"
            defaultValue={polls?.[0]?.id ?? "poll-elder-statesman"}
            required
          />
          <Field
            label="Sort order"
            name="sort_order"
            type="number"
            defaultValue={polls?.[0]?.sort_order ?? 0}
          />
        </div>
        <Field
          label="Question"
          name="question"
          defaultValue={polls?.[0]?.question ?? ""}
          required
        />
        <Field
          label="Options (JSON)"
          name="options"
          defaultValue={JSON.stringify(
            polls?.[0]?.options ?? [
              { id: "uy-scuti", label: "UY Scuti (2021)" },
              { id: "unruly", label: "Unruly (2023)" },
            ],
            null,
            2,
          )}
          rows={6}
        />
        <Field
          label="Base votes (JSON)"
          name="base_votes"
          defaultValue={JSON.stringify(
            polls?.[0]?.base_votes ?? { "uy-scuti": 166, unruly: 195 },
            null,
            2,
          )}
          rows={4}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-ink-soft">
              Scope (optional — shows results on that page too)
            </span>
            <select
              name="scope_type"
              defaultValue={polls?.[0]?.scope_type ?? ""}
              className="w-full border-2 border-ink bg-paper px-3 py-2 text-sm outline-none focus:bg-white"
            >
              <option value="">Fan Zone only</option>
              <option value="era">Era</option>
              <option value="album">Album</option>
            </select>
          </label>
          <Field
            label="Scope slug (era or album slug)"
            name="scope_slug"
            defaultValue={polls?.[0]?.scope_slug ?? ""}
            hint="e.g. elder-statesman, or uy-scuti"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={polls?.[0]?.active ?? true} />
          Active
        </label>
        <button
          type="submit"
          className="border-2 border-ink bg-danfo px-4 py-2 text-xs font-bold uppercase tracking-wide"
        >
          Save poll
        </button>
      </form>
    </>
  );
}
