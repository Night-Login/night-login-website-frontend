import { redirect } from "next/navigation";

// The legacy website intentionally redirects its Projects route here.
export default function ProjectsPage() {
  redirect("/coming-soon");
}
