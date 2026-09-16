import AdminPageHeader from "@/components/Admin/ui/AdminPageHeader";
import AdminContentContainer from "@/components/Admin/ui/AdminContentContainer";

export default function OrganizationsPage() {
  return (
    <div className="p-8">
      <AdminPageHeader
        title="Organizations Management"
        subtitle="Manage organizational experience, roles, and periods."
      />
      <AdminContentContainer emptyNotice="Organizations table will be displayed here." />
    </div>
  );
}
