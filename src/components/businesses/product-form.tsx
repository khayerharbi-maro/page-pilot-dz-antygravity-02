"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createProductAction, updateProductAction } from "@/lib/actions/products";
import { Loader2, Package, Compass, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  businessId: string;
  product?: any; // If passed, we are in Edit Mode
  onSuccess: () => void;
}

export function ProductForm({ businessId, product, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;
  const [loading, setLoading] = useState(false);

  // States
  const [type, setType] = useState(product?.type || "product");
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || "");
  const [description, setDescription] = useState(product?.description || "");
  const [benefits, setBenefits] = useState(product?.benefits || "");
  const [targetAudience, setTargetAudience] = useState(product?.targetAudience || "");
  const [painOrProblem, setPainOrProblem] = useState(product?.painOrProblem || "");
  const [orderMethod, setOrderMethod] = useState(product?.orderMethod || "");
  const [notes, setNotes] = useState(product?.notes || "");
  const [activeForPlanning, setActiveForPlanning] = useState(
    product?.activeForPlanning !== undefined ? product.activeForPlanning : true
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !benefits) {
      toast.error("Please fill in all required fields (Name, Description, Key Benefits).");
      return;
    }

    setLoading(true);

    const payload = {
      type,
      name,
      price: price || null,
      description,
      benefits,
      targetAudience: targetAudience || null,
      painOrProblem: painOrProblem || null,
      orderMethod: orderMethod || null,
      notes: notes || null,
      activeForPlanning,
    };

    try {
      if (isEdit && product.id) {
        await updateProductAction(product.id, payload);
        toast.success(`${type === "product" ? "Product" : "Service"} updated successfully!`);
      } else {
        await createProductAction(businessId, payload);
        toast.success(`${type === "product" ? "Product" : "Service"} created successfully!`);
      }
      router.refresh();
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-scale-in max-h-[80vh] overflow-y-auto pr-2 scrollbar-thin">
      
      {/* Type Selector (Product vs Service) */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
          Offering Type <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setType("product")}
            disabled={loading}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
              type === "product"
                ? "bg-primary text-primary-foreground border-primary shadow-sm font-bold"
                : "bg-transparent text-muted-foreground hover:bg-accent/40 border-input"
            }`}
          >
            <Package className="size-4" />
            Product / منتج
          </button>
          <button
            type="button"
            onClick={() => setType("service")}
            disabled={loading}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
              type === "service"
                ? "bg-primary text-primary-foreground border-primary shadow-sm font-bold"
                : "bg-transparent text-muted-foreground hover:bg-accent/40 border-input"
            }`}
          >
            <Compass className="size-4" />
            Service / خدمة
          </button>
        </div>
      </div>

      {/* Basic Info (Name & Price) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="prod-name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Offering Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="prod-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={type === "product" ? "e.g. Classic Leather Sneakers" : "e.g. Yalidine Fast Shipping Service"}
            required
            disabled={loading}
            className="h-10 text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prod-price" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Price
          </Label>
          <div className="relative flex items-center">
            <Input
              id="prod-price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 3500 DA, Free"
              disabled={loading}
              className="h-10 text-sm pr-10"
            />
            <div className="absolute right-3 text-xs font-semibold text-muted-foreground pointer-events-none">
              DA
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="prod-description" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
          Full Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="prod-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe materials, size options, customization, features, and specific Algerian buyer hooks."
          required
          disabled={loading}
          className="min-h-16 text-sm leading-relaxed"
        />
      </div>

      {/* Key Benefits */}
      <div className="space-y-2">
        <Label htmlFor="prod-benefits" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
          Key Benefits & Selling Points <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="prod-benefits"
          value={benefits}
          onChange={(e) => setBenefits(e.target.value)}
          placeholder="What makes this special or why should they buy? e.g. Orthopedic sole, real Italian leather, 1-year guarantee."
          required
          disabled={loading}
          className="min-h-16 text-sm leading-relaxed"
        />
      </div>

      {/* Advanced Collapsible / optional info header */}
      <div className="flex items-center gap-1 text-xs font-semibold text-foreground border-b pb-1">
        <Sparkles className="size-3.5 text-primary" />
        AI Targeting & Delivery Options (Optional)
      </div>

      {/* Optional fields (Target Audience & Pain Point) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prod-audience" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Specific Target Customer
          </Label>
          <Input
            id="prod-audience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="e.g. Athletes, orthopedic patients, gift shoppers"
            disabled={loading}
            className="h-10 text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prod-pain" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Core Customer Pain Solved
          </Label>
          <Input
            id="prod-pain"
            value={painOrProblem}
            onChange={(e) => setPainOrProblem(e.target.value)}
            placeholder="e.g. Foot pain during long standing shifts"
            disabled={loading}
            className="h-10 text-sm"
          />
        </div>
      </div>

      {/* Optional fields (Order method & Notes) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prod-ordermethod" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Specific Order Intake Method
          </Label>
          <Input
            id="prod-ordermethod"
            value={orderMethod}
            onChange={(e) => setOrderMethod(e.target.value)}
            placeholder="e.g. Click website link, send size via WhatsApp"
            disabled={loading}
            className="h-10 text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prod-notes" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Internal Strategist Notes
          </Label>
          <Input
            id="prod-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Do not discount this item, bundle option available"
            disabled={loading}
            className="h-10 text-sm"
          />
        </div>
      </div>

      {/* Active for Planning Toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg border bg-accent/10 border-border/60">
        <div className="space-y-0.5">
          <Label className="text-xs font-semibold text-foreground">Include in AI Content Plans</Label>
          <p className="text-[10px] text-muted-foreground">When enabled, the AI weekly plan models will include this item in content drafts.</p>
        </div>
        <button
          type="button"
          onClick={() => setActiveForPlanning(!activeForPlanning)}
          disabled={loading}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-hidden ${
            activeForPlanning ? "bg-primary" : "bg-muted"
          }`}
        >
          <span
            className={`pointer-events-none inline-block size-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
              activeForPlanning ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Submit Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={loading}
          className="cursor-pointer text-xs h-9 px-4"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="cursor-pointer text-xs h-9 px-4 flex items-center gap-1.5"
        >
          {loading ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              {isEdit ? "Saving..." : "Creating..."}
            </>
          ) : (
            <>
              {isEdit ? "Save Changes" : "Add to Catalog"}
            </>
          )}
        </Button>
      </div>

    </form>
  );
}
