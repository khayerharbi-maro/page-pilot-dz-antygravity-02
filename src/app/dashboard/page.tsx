"use client";

import Link from "next/link";
import { Lock, Compass, Plus, Library, Sparkles, AlertCircle, ArrowRight, LineChart, Calendar } from "lucide-react";
import { UserProfile } from "@/components/auth/user-profile";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)] bg-background">
        <div className="flex flex-col items-center gap-2">
          <Compass className="size-8 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground font-medium">Loading workspace...</span>
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
            <h1 className="text-2xl font-bold text-foreground">Protected Workspace</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Please sign in to access the PagePilot DZ dashboard and analyze your business pages.
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Workspace Dashboard</h1>
          <p className="text-sm text-muted-foreground font-medium">
            Welcome back, <span className="text-foreground font-semibold">{session.user.name}</span>. Start auditing pages and planning local content.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild size="sm" variant="outline">
            <Link href="/library" className="flex items-center gap-1.5">
              <Library className="size-4" />
              View Library
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
            <Link href="/businesses/new" className="flex items-center gap-1.5">
              <Plus className="size-4" />
              Add Business
            </Link>
          </Button>
        </div>
      </div>

      {/* Workspace Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Stat 1 */}
        <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-xs transition-all duration-200 hover:shadow-sm">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Businesses</p>
              <h2 className="text-3xl font-bold">0</h2>
            </div>
            <div className="size-9 rounded-md bg-accent flex items-center justify-center text-accent-foreground">
              <Compass className="size-4.5" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 font-medium flex items-center gap-1">
            <AlertCircle className="size-3 text-primary" />
            No business profiles created yet
          </p>
        </div>

        {/* Stat 2 */}
        <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-xs transition-all duration-200 hover:shadow-sm">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Audits Generated</p>
              <h2 className="text-3xl font-bold">0</h2>
            </div>
            <div className="size-9 rounded-md bg-accent flex items-center justify-center text-accent-foreground">
              <LineChart className="size-4.5" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 font-medium flex items-center gap-1">
            <AlertCircle className="size-3 text-primary" />
            Page Audit scoring runs
          </p>
        </div>

        {/* Stat 3 */}
        <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-xs transition-all duration-200 hover:shadow-sm">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Content Plans</p>
              <h2 className="text-3xl font-bold">0</h2>
            </div>
            <div className="size-9 rounded-md bg-accent flex items-center justify-center text-accent-foreground">
              <Calendar className="size-4.5" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 font-medium flex items-center gap-1">
            <AlertCircle className="size-3 text-primary" />
            Weekly calendars generated
          </p>
        </div>

      </div>

      {/* Main Content Area - Step-by-Step Empty State Workspace */}
      <div className="border rounded-lg bg-card/40 backdrop-blur-sm p-6 sm:p-8 space-y-8">
        <div className="max-w-xl space-y-3 text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border bg-accent/40 text-accent-foreground text-xs font-semibold">
            <Sparkles className="size-3 text-primary animate-pulse" />
            <span>Workspace Setup Guide</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Get Started with PagePilot DZ</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Configure your client's business details, analyze their social media performance, and generate native-converting weekly schedules. Follow these four steps:
          </p>
        </div>

        {/* Interactive Steps Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left pt-2">
          
          {/* Step 1 */}
          <div className="space-y-3 relative group border-t pt-4">
            <div className="absolute top-0 left-0 -translate-y-1/2 bg-background border size-6 rounded-full flex items-center justify-center text-xs font-bold text-primary">
              1
            </div>
            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
              Add Business
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Create a profile specifying the name, category (clothing, clinic, cafe, etc), targeted wilayas, and tone constraints.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-3 relative group border-t pt-4">
            <div className="absolute top-0 left-0 -translate-y-1/2 bg-background border size-6 rounded-full flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">
              2
            </div>
            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
              List Products
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Define products or services including pricing, distinct buyer pain points, and specific DM/WhatsApp order triggers.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-3 relative group border-t pt-4">
            <div className="absolute top-0 left-0 -translate-y-1/2 bg-background border size-6 rounded-full flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">
              3
            </div>
            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
              Input Page Data
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Paste the current bio text, optional platform handles, and copies of recent organic posts. No scraping required.
            </p>
          </div>

          {/* Step 4 */}
          <div className="space-y-3 relative group border-t pt-4">
            <div className="absolute top-0 left-0 -translate-y-1/2 bg-background border size-6 rounded-full flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">
              4
            </div>
            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
              Audit & Plan
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Generate a rigorous conversion review score, actionable fixes, a 7-day content mix, and copiable post cards.
            </p>
          </div>

        </div>

        {/* Primary CTA Area */}
        <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground text-left max-w-md">
            <strong>Note:</strong> This is a UI prototype shell of Phase 1. Database models, AI generation APIs, and detail pages will be enabled in subsequent waves.
          </div>
          <Button asChild size="lg" className="w-full sm:w-auto h-11 px-8">
            <Link href="/businesses/new" className="flex items-center justify-center gap-1.5 font-medium">
              Create Your First Business Profile
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

      </div>

      {/* Subtle Utility Link to Chat in Footer of Workspace */}
      <div className="flex justify-end pt-4">
        <Link 
          href="/chat" 
          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          <Sparkles className="size-3" />
          Developer Utility Chat
        </Link>
      </div>

    </div>
  );
}
