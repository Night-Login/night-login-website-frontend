import AdminPageHeader from "@/components/Admin/ui/AdminPageHeader";
import AdminContentContainer from "@/components/Admin/ui/AdminContentContainer";

export default function GradesPage() {
  return (
    <div className="p-8">
      <AdminPageHeader
        title="Grades Management"
        subtitle="Manage academic coursework, subjects, grades, and semesters."
      />
      <AdminContentContainer emptyNotice="Academic grades table will be displayed here." />
    </div>
  );
}
