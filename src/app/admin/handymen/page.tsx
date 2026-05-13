// src/app/admin/handymen/page.tsx
import HandymanApprovalTable from '@/components/admin/dashboard/HandymanApprovalTable';

export default function AdminHandymenPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Handymen</h1>
        <p className="text-gray-500 mt-1">Manage handyman applications and approvals</p>
      </div>
      <HandymanApprovalTable />
    </>
  );
}