// src/app/admin/dashboard/page.tsx
import StatCardsGrid from '@/components/admin/dashboard/StatCardsGrid';
import HandymanApprovalTable from '@/components/admin/dashboard/HandymanApprovalTable';
import UserManagementTable from '@/components/admin/dashboard/UserManagementTable';

export default function AdminDashboardPage() {
  return (
    <>
      <StatCardsGrid />
      <HandymanApprovalTable />
      <UserManagementTable />
    </>
  );
}