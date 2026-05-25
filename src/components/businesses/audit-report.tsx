"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Copy, Check, Sparkles, ThumbsUp, AlertTriangle, 
  AlertOctagon, CheckCircle2, MessageSquare, BookOpen, 
  TrendingUp, Award, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Business {
  id: string;
  name: string;
  category: string;
  customNiche?: string | null;
  city: string;
  wilaya: string;
  description: string;
  audience: string;
  mainPain: string;
  competitiveAdvantage: string;
  primaryLanguage: string;
  toneStyle: string;
  sellingChannels: string;
  orderMethods: string;
  defaultCta?: string | null;
}

interface ScoreBreakdown {
  bio: number;
  trust: number;
  conversion: number;
  contentMix: number;
}

interface RecommendedPillar {
  name: string;
  description: string;
  objective: string;
}

interface PinnedPostProposal {
  hook: string;
  body: string;
  cta: string;
  visualConcept: string;
}

interface AuditReportProps {
  audit: {
    id: string;
    businessId: string;
    pageInputId: string;
    score: number;
    scoreBreakdown: any; // Type-cast to ScoreBreakdown inside
    summary: string;
    strengths: any; // string[]
    weaknesses: any; // string[]
    urgentFixes: any; // string[]
    bioRewrite?: string | null;
    ctaRecommendation?: string | null;
    trustReview?: string | null;
    contentMixDiagnosis?: string | null;
    conversionReview?: string | null;
    languageRecommendation?: string | null;
    recommendedPillars?: any; // RecommendedPillar[]
    pinnedPostProposal?: any; // PinnedPostProposal
    nextAction?: string | null;
    createdAt: Date;
    business: Business;
  };
}

export function AuditReport({ audit }: AuditReportProps) {
  const { business } = audit;
  const [animatedScore, setAnimatedScore] = useState(0);
  const [activeTab, setActiveTab] = useState<"trust" | "pillars" | "pinned">("trust");
  const [copiedBio, setCopiedBio] = useState(false);
  const [copiedPost, setCopiedPost] = useState(false);

  const breakdown = (audit.scoreBreakdown || {
    bio: 70,
    trust: 60,
    conversion: 65,
    contentMix: 68
  }) as ScoreBreakdown;

  const strengths = (audit.strengths || []) as string[];
  const weaknesses = (audit.weaknesses || []) as string[];
  const urgentFixes = (audit.urgentFixes || []) as string[];
  const pillars = (audit.recommendedPillars || []) as RecommendedPillar[];
  const pinnedPost = (audit.pinnedPostProposal || {
    hook: "Hook line",
    body: "Post body text",
    cta: "Direct CTA",
    visualConcept: "Visual description"
  }) as PinnedPostProposal;

  // Simple count-up animation for score gauge
  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const end = audit.score;
      if (start === end) return;

      const duration = 1000;
      const increment = end > start ? 1 : -1;
      const stepTime = Math.abs(Math.floor(duration / end));

      const timerId = setInterval(() => {
        start += increment;
        setAnimatedScore(start);
        if (start === end) {
          clearInterval(timerId);
        }
      }, stepTime);

      return () => clearInterval(timerId);
    }, 100);

    return () => clearTimeout(timer);
  }, [audit.score]);

  // Determine score color
  const getScoreColor = (val: number) => {
    if (val >= 75) return "text-green-600 dark:text-green-400 stroke-green-500";
    if (val >= 50) return "text-amber-500 stroke-amber-500";
    return "text-red-500 stroke-red-500";
  };

  const getScoreBg = (val: number) => {
    if (val >= 75) return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
    if (val >= 50) return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
    return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
  };

  const copyToClipboard = (text: string, type: "bio" | "post") => {
    navigator.clipboard.writeText(text);
    if (type === "bio") {
      setCopiedBio(true);
      setTimeout(() => setCopiedBio(false), 2000);
    } else {
      setCopiedPost(true);
      setTimeout(() => setCopiedPost(false), 2000);
    }
    toast.success("Copied to clipboard successfully!");
  };

  const exportMarkdown = () => {
    const md = `# PagePilot DZ Conversion Audit Report: ${business.name}
Generated: ${new Date(audit.createdAt).toLocaleDateString()}
Overall Conversion Score: ${audit.score}/100

## Executive Summary
${audit.summary}

## Score Breakdown
- Social Page Bio Hook: ${breakdown.bio}/100
- Trust & Credibility Checklist: ${breakdown.trust}/100
- Conversion Pipeline: ${breakdown.conversion}/100
- Content Strategy Alignment: ${breakdown.contentMix}/100

## Strengths
${strengths.map(s => `- ${s}`).join("\n")}

## Areas of Improvement
${weaknesses.map(w => `- ${w}`).join("\n")}

## Critical / Urgent Fixes
${urgentFixes.map(f => `- [URGENT] ${f}`).join("\n")}

## Optimized Bio Rewrite
${audit.bioRewrite || "N/A"}

## Call-To-Action (CTA) Recommendations
${audit.ctaRecommendation || "N/A"}

## Trust & Conversion Loopholes Diagnosis
${audit.trustReview || "N/A"}
${audit.conversionReview || "N/A"}

## Language & Dialect Optimization
${audit.languageRecommendation || "N/A"}

## Recommended Content Strategy Pillars
${pillars.map(p => `### ${p.name}
- *Objective:* ${p.objective}
- *Description:* ${p.description}`).join("\n\n")}

## Pinned Post Proposal (High Converting Hook)
**Hook:** ${pinnedPost.hook}
**Body Copy:**
${pinnedPost.body}

**Call To Action (CTA):** ${pinnedPost.cta}
**Visual Concept Description:** ${pinnedPost.visualConcept}

## Next Critical Action
${audit.nextAction || "N/A"}

---
Generated by PagePilot DZ (Social CRO for Algerian Commerce)
`;

    navigator.clipboard.writeText(md);
    toast.success("Full audit exported to clipboard in Markdown format!");
  };

  // SVG dimensions for animated score circle
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-8 max-w-5xl">
      
      {/* Top Header bar with Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div className="space-y-1">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2.5">
            <Link href={`/businesses/${business.id}?tab=audits`}>
              <ArrowLeft className="size-4" />
              Back to Audits List
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{business.name} Audit Report</h1>
            <Badge variant="outline" className={cn("font-semibold py-0.5 border text-xs", getScoreBg(audit.score))}>
              Score: {audit.score}/100
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Audited on {new Date(audit.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={exportMarkdown} variant="outline" size="sm" className="gap-1.5 cursor-pointer w-full sm:w-auto">
            <FileText className="size-4" />
            Export Markdown
          </Button>
        </div>
      </div>

      {/* Hero scoring and triage dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visual score gauge card */}
        <Card className="border shadow-xs bg-card/60 lg:col-span-1 flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-1.5">
              <Award className="size-4.5 text-primary" />
              Audit Scorecard
            </CardTitle>
            <CardDescription className="text-[11px]">
              Dynamic benchmark indicating conversion readiness.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 py-2 flex-1 flex flex-col justify-center items-center">
            
            {/* Animated SVG Circle */}
            <div className="relative size-36 flex items-center justify-center">
              <svg className="size-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-muted"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {/* Foreground Score Ring */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className={cn("transition-all duration-300 ease-out", getScoreColor(audit.score).split(" ")[2])}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              {/* Center Text */}
              <div className="absolute text-center space-y-0.5">
                <span className="text-3xl font-extrabold tracking-tighter text-foreground">{animatedScore}</span>
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Score</span>
              </div>
            </div>

            {/* Sub-scores detailed sliders */}
            <div className="w-full space-y-3 px-2 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-muted-foreground">Social Bio Hook</span>
                  <span className="text-foreground">{breakdown.bio}/100</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${breakdown.bio}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-muted-foreground">Trust & Credibility</span>
                  <span className="text-foreground">{breakdown.trust}/100</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${breakdown.trust}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-muted-foreground">Conversion Mechanics</span>
                  <span className="text-foreground">{breakdown.conversion}/100</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${breakdown.conversion}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-muted-foreground">Content Strategy Mix</span>
                  <span className="text-foreground">{breakdown.contentMix}/100</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${breakdown.contentMix}%` }} />
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Triage container (Strengths, Weaknesses, Urgent fixes) */}
        <div className="lg:col-span-2 flex flex-col gap-4 justify-between">
          
          {/* Executive Summary panel */}
          <Card className="border shadow-xs bg-card/60 p-4 space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="size-3.5 text-primary" />
              Executive Audit Summary
            </h3>
            <p className="text-sm text-foreground leading-relaxed">{audit.summary}</p>
          </Card>

          {/* Core lists grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            
            {/* Strengths */}
            <Card className="border border-green-500/10 shadow-xs bg-green-500/5 p-4 space-y-3">
              <h4 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
                <ThumbsUp className="size-3.5" />
                Strengths
              </h4>
              <ul className="text-xs space-y-2 text-foreground font-medium leading-relaxed">
                {strengths.length > 0 ? (
                  strengths.map((s, i) => (
                    <li key={i} className="flex gap-1.5 items-start">
                      <span className="text-green-500 mt-0.5 font-bold">✓</span>
                      <span>{s}</span>
                    </li>
                  ))
                ) : (
                  <span className="text-muted-foreground italic">No prominent strengths identified.</span>
                )}
              </ul>
            </Card>

            {/* Weaknesses */}
            <Card className="border border-amber-500/10 shadow-xs bg-amber-500/5 p-4 space-y-3">
              <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
                <AlertTriangle className="size-3.5" />
                Weaknesses
              </h4>
              <ul className="text-xs space-y-2 text-foreground font-medium leading-relaxed">
                {weaknesses.length > 0 ? (
                  weaknesses.map((w, i) => (
                    <li key={i} className="flex gap-1.5 items-start">
                      <span className="text-amber-500 mt-0.5 font-bold">⚠</span>
                      <span>{w}</span>
                    </li>
                  ))
                ) : (
                  <span className="text-muted-foreground italic">No major copywriting weaknesses found.</span>
                )}
              </ul>
            </Card>

            {/* Urgent Fixes */}
            <Card className="border border-destructive/15 shadow-xs bg-destructive/5 p-4 space-y-3">
              <h4 className="text-xs font-bold text-destructive uppercase tracking-wider flex items-center gap-1 shrink-0">
                <AlertOctagon className="size-3.5" />
                Urgent CRO Fixes
              </h4>
              <ul className="text-xs space-y-2 text-foreground font-semibold leading-relaxed">
                {urgentFixes.length > 0 ? (
                  urgentFixes.map((f, i) => (
                    <li key={i} className="flex gap-1.5 items-start">
                      <span className="text-destructive mt-0.5 font-bold">🗙</span>
                      <span>{f}</span>
                    </li>
                  ))
                ) : (
                  <span className="text-green-500 font-bold flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" />
                    All clear! No urgent leaks.
                  </span>
                )}
              </ul>
            </Card>

          </div>

        </div>

      </div>

      {/* Side-by-side Bio Rewrite board */}
      {audit.bioRewrite && (
        <Card className="border shadow-xs bg-card/60">
          <CardHeader className="border-b pb-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold flex items-center gap-1.5">
                  <Sparkles className="size-4.5 text-primary" />
                  Social Bio Copywriting Rewrite
                </CardTitle>
                <CardDescription className="text-[11px]">
                  Optimized bio custom-engineered to capture inbound traffic and drive order intake.
                </CardDescription>
              </div>
              <Button 
                onClick={() => copyToClipboard(audit.bioRewrite || "", "bio")} 
                size="sm" 
                variant="secondary"
                className="gap-1.5 cursor-pointer text-xs"
              >
                {copiedBio ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
                {copiedBio ? "Bio Copied" : "Copy Bio Text"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-4 rounded-lg border border-dashed bg-muted/30 space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Before (Active Social Bio)</span>
                <p className="text-sm italic text-muted-foreground leading-relaxed">
                  {audit.business.description ? (
                    `"${audit.business.description.slice(0, 150)}..."`
                  ) : (
                    "No previous bio description loaded."
                  )}
                </p>
              </div>

              <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-2 relative shadow-inner">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">After (AI-Optimized Bio Rewrite)</span>
                <p className="text-sm font-semibold text-foreground leading-relaxed whitespace-pre-line text-right" dir="auto">
                  {audit.bioRewrite}
                </p>
                
                {/* Visual badge callout */}
                <Badge variant="outline" className="text-[9px] font-semibold bg-background absolute -top-2.5 left-3 border-primary/25">
                  Algerian Darija Hook
                </Badge>
              </div>

            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs segment: Trust reviews, strategy pillars, and pinned posts */}
      <div className="space-y-4">
        
        {/* Navigation Tabs */}
        <div className="flex border-b gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("trust")}
            className={cn(
              "px-4 py-2 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer pb-2.5",
              activeTab === "trust"
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <MessageSquare className="size-4" />
            CRO & Trust Review
          </button>
          <button
            onClick={() => setActiveTab("pillars")}
            className={cn(
              "px-4 py-2 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer pb-2.5",
              activeTab === "pillars"
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <BookOpen className="size-4" />
            Marketing Pillars ({pillars.length})
          </button>
          <button
            onClick={() => setActiveTab("pinned")}
            className={cn(
              "px-4 py-2 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer pb-2.5",
              activeTab === "pinned"
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Sparkles className="size-4" />
            Pinned Post Hook Proposal
          </button>
        </div>

        {/* Tab content area */}
        <div className="animate-fade-up">
          
          {/* Tab 1: CRO & Trust Reviews */}
          {activeTab === "trust" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Trust review card */}
              <Card className="border shadow-xs bg-card/60">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-foreground">Trust & Social Friction Review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs leading-relaxed text-muted-foreground">
                  <div className="space-y-1">
                    <span className="font-semibold text-foreground uppercase tracking-wider text-[9px] block">Trust Gaps Detected</span>
                    <p>{audit.trustReview || "No specific trust loopholes mapped."}</p>
                  </div>
                  {audit.languageRecommendation && (
                    <div className="space-y-1 pt-3 border-t">
                      <span className="font-semibold text-foreground uppercase tracking-wider text-[9px] block">Language & Alignment Recommendation</span>
                      <p>{audit.languageRecommendation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Conversion review & CTAs */}
              <Card className="border shadow-xs bg-card/60">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-foreground">Conversion Pipeline & Intake Review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs leading-relaxed text-muted-foreground">
                  <div className="space-y-1">
                    <span className="font-semibold text-foreground uppercase tracking-wider text-[9px] block">Conversion Analysis</span>
                    <p>{audit.conversionReview || "No conversion bottlenecks analyzed."}</p>
                  </div>
                  {audit.ctaRecommendation && (
                    <div className="space-y-1 pt-3 border-t">
                      <span className="font-semibold text-foreground uppercase tracking-wider text-[9px] block">Actionable CTA Recommendation</span>
                      <p className="text-foreground font-semibold">{audit.ctaRecommendation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          )}

          {/* Tab 2: Marketing Pillars */}
          {activeTab === "pillars" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pillars.length > 0 ? (
                pillars.map((p, idx) => (
                  <Card key={idx} className="border shadow-xs bg-card/60 flex flex-col justify-between">
                    <CardHeader className="pb-2">
                      <Badge className="w-fit mb-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-[9px] font-bold">
                        Pillar {idx + 1}
                      </Badge>
                      <CardTitle className="text-sm font-bold text-foreground">{p.name}</CardTitle>
                      <span className="text-[10px] text-muted-foreground font-semibold">Objective: {p.objective}</span>
                    </CardHeader>
                    <CardContent className="pt-2 text-xs leading-relaxed text-muted-foreground flex-1">
                      <p>{p.description}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center border p-8 rounded-lg text-muted-foreground bg-card/60 italic text-xs">
                  No marketing pillars generated for this brand.
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Pinned Post Draft */}
          {activeTab === "pinned" && (
            <Card className="border shadow-xs bg-card/60">
              <CardHeader className="border-b pb-4 flex flex-row justify-between items-center flex-wrap gap-2">
                <div className="space-y-0.5">
                  <CardTitle className="text-sm font-bold text-foreground">Traffic-Capture Pinned Post Draft</CardTitle>
                  <CardDescription className="text-[10px]">
                    The perfect anchor post containing strong hook, product link, and Yalidine + COD guidelines.
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => copyToClipboard(`${pinnedPost.hook}\n\n${pinnedPost.body}\n\n${pinnedPost.cta}`, "post")} 
                  size="sm" 
                  variant="secondary"
                  className="gap-1.5 cursor-pointer text-xs"
                >
                  {copiedPost ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
                  {copiedPost ? "Copied" : "Copy Full Post"}
                </Button>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                {/* Facebook/Instagram Simulator Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Post copy simulation */}
                  <div className="md:col-span-2 space-y-4">
                    
                    <div className="p-4 rounded-lg border bg-background/50 shadow-inner space-y-3 text-xs leading-relaxed max-h-96 overflow-y-auto font-mono whitespace-pre-wrap text-right" dir="auto">
                      
                      {/* Hook */}
                      <span className="font-bold text-primary block text-sm border-b border-dashed pb-2 mb-2 text-left" dir="ltr">
                        [HOOK] 👇
                      </span>
                      <p className="font-extrabold text-foreground text-sm">{pinnedPost.hook}</p>

                      {/* Body */}
                      <span className="font-bold text-primary block text-sm border-b border-dashed pb-2 my-2 text-left" dir="ltr">
                        [BODY CAPTION] 👇
                      </span>
                      <p className="text-muted-foreground whitespace-pre-line font-medium leading-relaxed">{pinnedPost.body}</p>

                      {/* CTA */}
                      <span className="font-bold text-primary block text-sm border-b border-dashed pb-2 my-2 text-left" dir="ltr">
                        [CALL TO ACTION] 👇
                      </span>
                      <p className="font-extrabold text-foreground">{pinnedPost.cta}</p>

                    </div>

                  </div>

                  {/* Visual guideline simulation */}
                  <div className="space-y-4 flex flex-col justify-between">
                    
                    <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-3 text-xs leading-relaxed flex-1">
                      <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                        <TrendingUp className="size-3.5" />
                        Visual Concept & Media Guidelines
                      </h4>
                      <p className="text-muted-foreground">{pinnedPost.visualConcept}</p>
                    </div>

                    {/* Small tip box */}
                    <div className="p-3 rounded-lg border bg-muted/30 text-[11px] text-muted-foreground leading-relaxed flex items-center gap-2 mt-2">
                      <CheckCircle2 className="size-4.5 text-green-500 shrink-0" />
                      <span>Pin this post directly to the top of your Facebook Page / Instagram feed for maximum visibility.</span>
                    </div>

                  </div>

                </div>

              </CardContent>
            </Card>
          )}

        </div>

      </div>

      {/* Immediate Strategic Action Footer Card */}
      {audit.nextAction && (
        <Card className="border border-primary/30 shadow-sm bg-gradient-to-br from-primary/10 to-primary/5 p-6 space-y-3 relative overflow-hidden rounded-xl">
          {/* Subtle design element */}
          <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none text-primary">
            <Sparkles className="size-32" />
          </div>

          <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
            <TrendingUp className="size-4" />
            Next Critical Action Step
          </h3>
          <h2 className="text-lg font-bold text-foreground">{audit.nextAction}</h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
            This high-impact adjustment targets your most immediate CRO bottleneck. Fixing this first will pave the way for successful traffic generation in Phase 6.
          </p>
        </Card>
      )}

    </div>
  );
}
