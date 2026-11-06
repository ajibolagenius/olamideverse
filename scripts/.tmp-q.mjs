import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const { data } = await s.from("cms_media_items").select("id, status, sort_order, data").order("sort_order");
console.log("total rows:", data.length, "| published:", data.filter(r => r.status === "published").length, "| draft:", data.filter(r => r.status === "draft").length);
const fresh = ["burukutu-video","metaverse-video","woske-video","pawon-video","logba-logba-video","poverty-die-video","oil-and-gas-video","gobe-video","coke-studio-turn-up-live","ovo-wembley-2025-live","mission-26k-ikeja-live"];
for (const id of fresh) { const r = data.find(x => x.id === id); console.log(id, "->", r ? `${r.status} sort=${r.sort_order} yt=${r.data.youtubeId}` : "NO ROW"); }
