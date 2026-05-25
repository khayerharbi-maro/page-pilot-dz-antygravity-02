import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/session";
import { getAuditDetailAction } from "@/lib/actions/audits";
import { AuditReport } from "@/components/businesses/audit-report";

interface AuditDetailPageProps {
  params: Promise<{ id: string; auditId: string }>;
}

export default async function AuditDetailPage({ params }: AuditDetailPageProps) {
  // 1. Guard access
  await requireAuth();

  const { id, auditId } = await params;

  // 2. Fetch audit detail (with verified ownership checks inside action)
  const auditDetail = await getAuditDetailAction(auditId);

  if (!auditDetail || auditDetail.businessId !== id) {
    notFound();
  }

  // 3. Render high-fidelity report viewer
  return (
    <div className="animate-fade-in py-8">
      <AuditReport audit={auditDetail} />
    </div>
  );
}
