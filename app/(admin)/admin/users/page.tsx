import AdminPageHeader from "@/components/Admin/ui/AdminPageHeader";
import AdminContentContainer from "@/components/Admin/ui/AdminContentContainer";
import UsersManager from "@/modules/admin/users/UsersManager";

export default function UsersPage() {
  return (
    <div className="p-8">
      <AdminPageHeader
        title="Users Management"
        subtitle="Manage administrator accounts and system users."
      />
      <AdminContentContainer>
        <UsersManager />
      </AdminContentContainer>
    </div>
  );
}
