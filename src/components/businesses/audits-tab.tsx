"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Play, Loader2, CheckCircle2, Edit, ChevronRight, Calendar, 
  Award, Facebook, Instagram, Radio, Sparkles, AlertCircle, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { generatePageAuditAction } from "@/lib/actions/audits";
import { cn } from "@/lib/utils";

interface AuditsTabProps {
  businessId: string;
  latestPageInput: {
    id: string;
    platform: string;
    pageUrl?: string | null;
    handle?: string | null;
    bioText?: string | null;
    rawPostsText?: string | null;
    manualNotes?: string | null;
    createdAt: Date;
  };
  pastAudits: Array<{
    id: string;
    score: number;
    createdAt: Date;
    strengths: any;
    urgentFixes: any;
  }>;
}

const LOADING_STEPS = [
  "Connecting to social network feeds...",
  "Analyzing brand target audience & identity...",
  "Evaluating active products benefits...",
  "Searching for local trust bottlenecks...",
  "Re-writing social bio in authentic Algerian Darija...",
  "Drafting pinned anchor post proposal...",
  "Validating pricing & Yalidine delivery CTAs...",
  "Compiling final CRO scorecard & audit report..."
];

export function AuditsTab({ businessId, latestPageInput, pastAudits }: AuditsTabProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);

  // Cycle through loading steps to provide a premium wait experience
  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleRunAudit = async () => {
    setLoadingStepIdx(0);
    setIsGenerating(true);
    toast.info("Connecting to AI Consultant pipeline...");

    try {
      const res = await generatePageAuditAction(businessId);
      if (res.success) {
        toast.success("Audit scorecard compiled successfully!");
        // Small delay to let the success toast breath, then redirect to report details
        setTimeout(() => {
          setIsGenerating(false);
          router.push(`/businesses/${businessId}/audits/${res.id}`);
        }, 1000);
      }
    } catch (err) {
      setIsGenerating(false);
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to run audit.");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20";
    if (score >= 50) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-red-500 bg-red-500/10 border-red-500/20";
  };

  return (
    <div className="space-y-6">
      
      {/* Social Page Inputs and Execution controls grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Active Page Configuration Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border shadow-xs bg-card/60">
            <CardHeader className="space-y-1.5 border-b pb-5">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
                    {latestPageInput.platform === "facebook" ? (
                      <Facebook className="size-4.5" />
                    ) : latestPageInput.platform === "instagram" ? (
                      <Instagram className="size-4.5" />
                    ) : (
                      <Radio className="size-4.5" />
                    )}
                  </div>
                  <CardTitle className="text-lg font-bold">
                    Active Page Configuration
                  </CardTitle>
                </div>

                <Badge variant="outline" className="text-[10px] font-semibold bg-background/50 uppercase tracking-wider">
                  Platform: {latestPageInput.platform}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Configured properties and social feeds for AI model analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5 text-xs leading-relaxed">
              
              {/* URL and Handle grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-dashed">
                {latestPageInput.pageUrl && (
                  <div className="space-y-1">
                    <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Page Link</span>
                    <a 
                      href={latestPageInput.pageUrl.startsWith("http") ? latestPageInput.pageUrl : `https://${latestPageInput.pageUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline text-sm font-semibold block truncate"
                    >
                      {latestPageInput.pageUrl}
                    </a>
                  </div>
                )}
                {latestPageInput.handle && (
                  <div className="space-y-1">
                    <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Social Handle</span>
                    <p className="text-sm font-semibold text-foreground">@{latestPageInput.handle.replace("@", "")}</p>
                  </div>
                )}
              </div>

              {/* Bio */}
              {latestPageInput.bioText && (
                <div className="space-y-1.5 pb-4 border-b border-dashed">
                  <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Current Page Bio</span>
                  <p className="text-foreground text-sm leading-relaxed">{latestPageInput.bioText}</p>
                </div>
              )}

              {/* Raw Feed Snippet */}
              {latestPageInput.rawPostsText && (
                <div className="space-y-1.5">
                  <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Recent Social Posts pasted</span>
                  <div className="p-3 rounded bg-muted/50 border max-h-48 overflow-y-auto leading-normal text-muted-foreground text-[11px] whitespace-pre-wrap leading-relaxed font-mono">
                    {latestPageInput.rawPostsText}
                  </div>
                </div>
              )}

              {/* Strategic Focus */}
              {latestPageInput.manualNotes && (
                <div className="space-y-1.5 pt-4 border-t border-dashed">
                  <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Strategic Focus & Guidelines</span>
                  <p className="text-foreground text-sm leading-relaxed">{latestPageInput.manualNotes}</p>
                </div>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Right Column: Active Controls & Initiate Audit Card */}
        <div className="space-y-6">
          <Card className="border border-primary/20 shadow-xs bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-1.5 text-primary">
                <Sparkles className="size-4" />
                Audit Controls
              </CardTitle>
              <CardDescription className="text-xs">
                Generate dynamic, client-ready audits.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-4">
              <p>
                Social page input is successfully configured and saved! You are now ready to run the automated AI conversion audit.
              </p>
              
              {/* Custom indicator badge */}
              <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-background/50 border-border/80">
                <CheckCircle2 className="size-4 text-green-500 shrink-0" />
                <span className="font-semibold text-foreground">Feed ready for audit</span>
              </div>

              <div className="space-y-2 pt-2">
                <Button 
                  onClick={handleRunAudit}
                  size="sm" 
                  className="w-full justify-center gap-1.5 cursor-pointer shadow-xs font-semibold"
                >
                  <Play className="size-4 fill-current" />
                  Run AI Page Audit
                </Button>
                <Button asChild size="sm" variant="outline" className="w-full justify-center gap-1.5 cursor-pointer shadow-xs">
                  <Link href={`/businesses/${businessId}/page-inputs/new`}>
                    <Edit className="size-4" />
                    Re-configure Input
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Audit Logs / Past Benchmarks History table */}
      <Card className="border shadow-xs bg-card/60">
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-base font-bold flex items-center gap-1.5">
            <Calendar className="size-4.5 text-primary" />
            Audit Score Benchmarks & History
          </CardTitle>
          <CardDescription className="text-xs">
            Review past scores, copy optimized bios, and monitor conversion optimization progress.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          {pastAudits.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground italic space-y-2">
              <div className="size-10 mx-auto rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <AlertCircle className="size-5" />
              </div>
              <p>No audits generated yet. Click "Run AI Page Audit" to generate your first conversion benchmark scorecard.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-muted/20 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Audit Date</th>
                    <th className="p-4">Conversion Score</th>
                    <th className="p-4 hidden sm:table-cell">Strengths</th>
                    <th className="p-4 hidden sm:table-cell">Urgent Fixes</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-medium text-foreground">
                  {pastAudits.map((audit) => {
                    const strCount = Array.isArray(audit.strengths) ? audit.strengths.length : 0;
                    const fixCount = Array.isArray(audit.urgentFixes) ? audit.urgentFixes.length : 0;

                    return (
                      <tr key={audit.id} className="hover:bg-muted/15 transition-colors">
                        <td className="p-4 text-muted-foreground">
                          {new Date(audit.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </td>
                        <td className="p-4">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full border text-[11px] font-bold inline-flex items-center gap-1",
                            getScoreColor(audit.score)
                          )}>
                            <Award className="size-3.5" />
                            {audit.score}/100
                          </span>
                        </td>
                        <td className="p-4 hidden sm:table-cell text-muted-foreground">
                          {strCount} points
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          {fixCount > 0 ? (
                            <Badge variant="destructive" className="font-semibold text-[10px] px-2 py-0">
                              {fixCount} pending
                            </Badge>
                          ) : (
                            <span className="text-green-500 font-semibold text-[10px]">0 issues</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <Button asChild size="sm" variant="ghost" className="gap-1 cursor-pointer hover:text-primary">
                            <Link href={`/businesses/${businessId}/audits/${audit.id}`}>
                              <FileText className="size-3.5" />
                              View Report
                              <ChevronRight className="size-3.5" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dynamics Status Waiting Modal */}
      <Dialog open={isGenerating} onOpenChange={() => {}}>
        <DialogContent className="max-w-sm sm:max-w-md p-8 text-center space-y-6" showCloseButton={false}>
          
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground text-center">
              Generating Social Conversion Audit
            </DialogTitle>
            <DialogDescription className="text-xs text-center text-muted-foreground">
              Please wait. Our AI marketing engine is scanning inputs and formulating Algerian market benchmarks.
            </DialogDescription>
          </DialogHeader>

          {/* Animated Spinner and Visual Element */}
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <div className="relative size-16 flex items-center justify-center bg-primary/5 rounded-full border border-primary/20">
              <Loader2 className="size-8 text-primary animate-spin" />
            </div>

            {/* Cycling status message text with fade keyframe effect */}
            <div className="h-6 flex items-center justify-center animate-fade-in" key={loadingStepIdx}>
              <span className="text-sm font-semibold text-primary">
                {LOADING_STEPS[loadingStepIdx]}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground text-center italic bg-muted/40 p-3 rounded-lg leading-relaxed">
            "Running audit for Yalidine stop desk alignment, cash on delivery calls-to-action, and authentic Darija copywriting tone."
          </div>

        </DialogContent>
      </Dialog>

    </div>
  );
}
