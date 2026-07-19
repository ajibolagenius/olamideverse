"use client";

import { useFan } from "@/lib/fanzone/useFan";
import HandlePicker from "./HandlePicker";

export default function FanZoneSignIn() {
  const fanState = useFan();
  if (fanState.loading) return null;
  return <HandlePicker fanState={fanState} />;
}
