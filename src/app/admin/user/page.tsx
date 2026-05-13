// src/app/admin/user/page.tsx
import UserManagementTable from '@/components/admin/dashboard/UserManagementTable';

export default function AdminUserPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 mt-1">Manage all registered users</p>
      </div>
      <UserManagementTable />
    </>
  );
}