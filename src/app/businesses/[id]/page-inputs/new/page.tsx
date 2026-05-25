import { notFound } from "next/navigation";
import { getBusinessDetailAction } from "@/lib/actions/businesses";
import { requireAuth } from "@/lib/session";
import { PageInputForm } from "@/components/businesses/page-input-form";

interface PageInputsNewPageProps {
  params: Promise<{ id: string }>;
}

export default async function PageInputsNewPage({ params }: PageInputsNewPageProps) {
  // Guard access
  await requireAuth();

  const { id } = await params;
  const business = await getBusinessDetailAction(id);

  if (!business) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-6xl mx-auto space-y-4">
        <PageInputForm 
          businessId={id} 
          businessName={business.name} 
        />
      </div>
    </div>
  );
}
