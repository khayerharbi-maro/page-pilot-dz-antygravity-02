"use client";

import Link from "next/link";
import { Lock, Compass, Library, Search, Archive, FileText, Calendar } from "lucide-react";
import { UserProfile } from "@/components/auth/user-profile";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

export default function LibraryPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)] bg-background">
        <div className="flex flex-col items-center gap-2">
          <Compass className="size-8 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground font-medium">Loading library...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="max-w-md w-full mx-auto text-center space-y-6 border p-8 rounded-lg bg-card shadow-sm">
          <div className="size-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-destructive animate-bounce" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Protected Archive</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Please sign in to access your saved historic audits and generated weekly calendars.
            </p>
          </div>
          <div className="pt-2">
            <UserProfile />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Library className="size-7 text-primary" />
            Saved Library
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Access, view, and export your previously generated client reports and content campaigns.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard" className="flex items-center gap-1.5 font-medium">
            Go to Dashboard
          </Link>
        </Button>
      </div>

      {/* Main filter / search panel */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 border rounded-lg shadow-xs">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search reports or businesses..." 
            className="pl-9 h-9 w-full bg-background border rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            disabled
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none h-9 text-xs" disabled>
            All Businesses
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none h-9 text-xs" disabled>
            Sort: Latest
          </Button>
        </div>
      </div>

      {/* Tabs & Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        
        {/* Column 1: Audits */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <FileText className="size-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Social Page Audits</h2>
            <span className="ml-auto text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-semibold">0 Saved</span>
          </div>

          <div className="border border-dashed rounded-lg p-12 text-center bg-card/10 flex flex-col items-center justify-center min-h-[300px] space-y-4">
            <div className="size-12 rounded-full bg-accent flex items-center justify-center text-muted-foreground">
              <Archive className="size-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">No audits saved yet</h3>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                Analyze a business page and generate a scoring report. Audits are automatically archived here for client reviews.
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="h-8">
              <Link href="/dashboard">Create an Audit</Link>
            </Button>
          </div>
        </div>

        {/* Column 2: Weekly Plans */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Calendar className="size-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Content Schedules</h2>
            <span className="ml-auto text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-semibold">0 Saved</span>
          </div>

          <div className="border border-dashed rounded-lg p-12 text-center bg-card/10 flex flex-col items-center justify-center min-h-[300px] space-y-4">
            <div className="size-12 rounded-full bg-accent flex items-center justify-center text-muted-foreground">
              <Archive className="size-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">No content plans saved yet</h3>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                Generate tailored weekly plans (bilingual Arabic/French/Darija) for your products and view them anytime.
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="h-8">
              <Link href="/dashboard">Generate a Plan</Link>
            </Button>
          </div>
        </div>

      </div>

    </div>
  );
}
