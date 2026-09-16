import AdminPageHeader from "@/components/Admin/ui/AdminPageHeader";
import AdminContentContainer from "@/components/Admin/ui/AdminContentContainer";

export default function TalentsPage() {
  return (
    <div className="p-8">
      <AdminPageHeader
        title="Talents Management"
        subtitle="Manage member profiles, bios, batches, and developer details."
      />
      <AdminContentContainer emptyNotice="Talents table will be displayed here." />
    </div>
  );
}
