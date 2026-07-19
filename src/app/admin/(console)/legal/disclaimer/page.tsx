import { redirect } from "next/navigation";

export default function AdminDisclaimerRedirect() {
  redirect("/admin/settings?tab=disclaimer");
}
