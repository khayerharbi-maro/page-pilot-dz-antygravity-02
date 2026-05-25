"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, Plus, Edit, Trash2, Loader2, CheckCircle2, AlertTriangle 
} from "lucide-react";
import { ProductForm } from "./product-form";
import { toggleProductActiveAction, deleteProductAction } from "@/lib/actions/products";

interface ProductCatalogProps {
  businessId: string;
  products: any[];
}

export function ProductCatalog({ businessId, products }: ProductCatalogProps) {
  const router = useRouter();
  
  // Dialog Open States
  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<any | null>(null);

  // Loading States for individual items
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleToggleActive = async (productId: string, currentActive: boolean) => {
    setToggleLoading(productId);
    try {
      await toggleProductActiveAction(productId, !currentActive);
      toast.success("Planning status updated!");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status.");
    } finally {
      setToggleLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;
    setDeleteLoading(true);
    try {
      await deleteProductAction(deleteProduct.id);
      toast.success(`${deleteProduct.type === "product" ? "Product" : "Service"} deleted successfully.`);
      setDeleteProduct(null);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete item.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-scale-in">
      
      {/* Catalog Header & Quick Add */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Package className="size-5 text-primary" />
            Products & Services Catalog
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage your customer offerings. Items marked as active are fed into AI copywriters for tailored content hooks.
          </p>
        </div>

        {/* Add Offerings Trigger Modal */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 cursor-pointer w-full sm:w-auto">
              <Plus className="size-4" />
              Add Offering
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-1.5">
                <Plus className="size-5 text-primary" />
                Add Offering to Catalog
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Define a product or service. Enter price, benefits, and customized selling channels to optimize AI planning.
              </DialogDescription>
            </DialogHeader>
            <ProductForm 
              businessId={businessId} 
              onSuccess={() => setAddOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid of Product Cards */}
      {products.length === 0 ? (
        /* Empty State Card */
        <div className="max-w-xl mx-auto text-center space-y-6 border border-dashed p-8 sm:p-12 rounded-xl bg-card/40 shadow-xs py-16 animate-scale-in">
          <div className="size-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">Your Catalog is Empty</h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
              You haven't defined any products or services for this business yet. Add at least one offering to enable hyper-relevant, high-converting AI content generations!
            </p>
          </div>
          <div className="pt-2">
            <Button onClick={() => setAddOpen(true)} size="sm" className="gap-1.5 cursor-pointer">
              <Plus className="size-4" />
              Add Your First Product
            </Button>
          </div>
        </div>
      ) : (
        /* Product Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((item) => (
            <Card 
              key={item.id} 
              className={`border transition-all duration-200 ease-out hover:shadow-md bg-card/60 flex flex-col justify-between overflow-hidden animate-scale-in ${
                !item.activeForPlanning ? "opacity-75 border-dashed" : ""
              }`}
            >
              <div>
                {/* Card Header with Badges and Pricing */}
                <div className="p-5 border-b bg-accent/5 flex justify-between items-start gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={item.type === "product" ? "default" : "secondary"} className="font-semibold text-[10px] uppercase tracking-wider py-0.5 px-2">
                        {item.type}
                      </Badge>
                      
                      {!item.activeForPlanning && (
                        <Badge variant="outline" className="text-[10px] text-muted-foreground border-dashed bg-background/50">
                          Inactive for AI
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-foreground tracking-tight leading-none pt-0.5">{item.name}</h3>
                  </div>

                  {/* Price display with DA tag */}
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg whitespace-nowrap">
                      {item.price ? `${item.price}` : "Contact us"}
                    </span>
                  </div>
                </div>

                {/* Card Main Content */}
                <CardContent className="p-5 space-y-4 text-xs leading-relaxed">
                  
                  {/* Description */}
                  <div className="space-y-1">
                    <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Description</h4>
                    <p className="text-foreground text-sm font-medium leading-relaxed">{item.description}</p>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-1 pt-2 border-t border-dashed">
                    <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="size-3 text-green-500" />
                      Key Benefits & Selling Points
                    </h4>
                    <p className="text-foreground font-medium leading-relaxed">{item.benefits}</p>
                  </div>

                  {/* Optional Metadata pills */}
                  {(item.targetAudience || item.painOrProblem || item.orderMethod) && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {item.targetAudience && (
                        <Badge variant="outline" className="text-[10px] bg-background/50 font-normal">
                          Target: {item.targetAudience}
                        </Badge>
                      )}
                      {item.painOrProblem && (
                        <Badge variant="outline" className="text-[10px] bg-background/50 font-normal">
                          Solves: {item.painOrProblem}
                        </Badge>
                      )}
                      {item.orderMethod && (
                        <Badge variant="outline" className="text-[10px] bg-background/50 font-normal">
                          Order: {item.orderMethod}
                        </Badge>
                      )}
                    </div>
                  )}

                </CardContent>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-4 border-t bg-accent/10 flex justify-between items-center gap-4">
                
                {/* Direct switch for active/inactive */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(item.id, item.activeForPlanning)}
                    disabled={toggleLoading !== null}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-hidden ${
                      item.activeForPlanning ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block size-4 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
                        item.activeForPlanning ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {toggleLoading === item.id ? (
                      <Loader2 className="size-3 animate-spin text-primary" />
                    ) : (
                      "Active for AI"
                    )}
                  </span>
                </div>

                {/* Edit & Delete Actions */}
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
                    onClick={() => setEditProduct(item)}
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="size-8 text-muted-foreground hover:text-destructive cursor-pointer"
                    onClick={() => setDeleteProduct(item)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Offering Modal Dialog */}
      <Dialog open={!!editProduct} onOpenChange={(open) => !open && setEditProduct(null)}>
        <DialogContent className="sm:max-w-xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-1.5">
              <Edit className="size-5 text-primary" />
              Edit Offering Details
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Modify the product/service parameters below. Saving edits will re-evaluate upcoming content drafts.
            </DialogDescription>
          </DialogHeader>
          {editProduct && (
            <ProductForm 
              businessId={businessId} 
              product={editProduct} 
              onSuccess={() => setEditProduct(null)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Offering Confirmation Dialog */}
      <Dialog open={!!deleteProduct} onOpenChange={(open) => !open && setDeleteProduct(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-1.5 text-destructive">
              <AlertTriangle className="size-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-foreground">
              Are you sure you want to delete <span className="font-bold text-foreground">"{deleteProduct?.name}"</span> from the catalog? This will permanently remove it from the business workspace.
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteProduct(null)}
              disabled={deleteLoading}
              className="cursor-pointer text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
              className="cursor-pointer text-xs h-9 flex items-center gap-1"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Offering"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
