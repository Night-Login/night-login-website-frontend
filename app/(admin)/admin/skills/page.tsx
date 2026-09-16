import AdminPageHeader from "@/components/Admin/ui/AdminPageHeader";
import AdminContentContainer from "@/components/Admin/ui/AdminContentContainer";

export default function SkillsPage() {
  return (
    <div className="p-8">
      <AdminPageHeader
        title="Skills Management"
        subtitle="Manage technical skills taxonomy and talent skill assignments."
      />
      <AdminContentContainer emptyNotice="Skills table will be displayed here." />
    </div>
  );
}
