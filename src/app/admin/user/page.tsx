// src/app/admin/dashboard/page.tsx
import StatCardsGrid from '@/components/admin/dashboard/StatCardsGrid';
import HandymanApprovalTable from '@/components/admin/dashboard/HandymanApprovalTable';
import UserManagementTable from '@/components/admin/dashboard/UserManagementTable';
import CategoryManagementTable from '@/components/admin/dashboard/CategoryManagementTable';

export default function AdminDashboardPage() {
  return (
    <>
      <UserManagementTable />
    </>
  );
}