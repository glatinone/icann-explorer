import { redirect } from "next/navigation";

/** Static-export-safe root redirect to the default locale. */
export default function RootPage(): null {
  redirect("/id/");
  return null;
}
