"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteBusinessAction } from "@/lib/actions/businesses";

interface DeleteBusinessButtonProps {
  id: string;
  name: string;
}

export function DeleteBusinessButton({ id, name }: DeleteBusinessButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteBusinessAction(id);
      toast.success("Business profile deleted successfully!");
      setOpen(false);
      router.push("/businesses");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete business profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-1.5 cursor-pointer">
          <Trash2 className="size-4" />
          Delete Business
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-3">
          <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mx-auto sm:mx-0">
            <AlertTriangle className="size-6 animate-pulse" />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <DialogTitle className="text-lg font-bold">Delete Business Profile</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              Are you sure you want to delete <span className="font-semibold text-foreground">"{name}"</span>? 
              This action is permanent and will cascade to delete all products, audits, and content plans.
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4 border-t mt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="w-full sm:w-auto cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Yes, Delete Profile"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
