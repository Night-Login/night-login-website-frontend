import AdminPageHeader from "@/components/Admin/ui/AdminPageHeader";
import AdminContentContainer from "@/components/Admin/ui/AdminContentContainer";

export default function ProjectsPage() {
  return (
    <div className="p-8">
      <AdminPageHeader
        title="Projects Management"
        subtitle="Manage talent projects, links, descriptions, and media."
      />
      <AdminContentContainer emptyNotice="Projects table will be displayed here." />
    </div>
  );
}
