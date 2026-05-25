import { BusinessForm } from "@/components/businesses/business-form";
import { requireAuth } from "@/lib/session";

export default async function NewBusinessPage() {
  // Validate authentication before rendering the form
  await requireAuth();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-4xl mx-auto">
        <BusinessForm />
      </div>
    </div>
  );
}
