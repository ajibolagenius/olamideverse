import { NextResponse } from "next/server";
import { getPublicTotals } from "@/lib/analytics/queries";

export const runtime = "nodejs";

/** Public aggregate totals for the footer visitor badge. */
export async function GET() {
  const totals = await getPublicTotals();
  return NextResponse.json(totals, {
    headers: {
      // Short cache at the edge; badge can be slightly stale.
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
    },
  });
}
