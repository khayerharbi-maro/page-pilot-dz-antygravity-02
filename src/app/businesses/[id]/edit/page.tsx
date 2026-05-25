import { notFound } from "next/navigation";
import { BusinessForm } from "@/components/businesses/business-form";
import { getBusinessDetailAction } from "@/lib/actions/businesses";
import { requireAuth } from "@/lib/session";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBusinessPage({ params }: EditPageProps) {
  // Protect page content
  await requireAuth();
  
  const { id } = await params;
  const business = await getBusinessDetailAction(id);

  if (!business) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-4xl mx-auto">
        <BusinessForm isEdit={true} initialData={business} />
      </div>
    </div>
  );
}
