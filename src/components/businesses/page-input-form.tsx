"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { createPageInputAction } from "@/lib/actions/page-inputs";
import { 
  Loader2, ArrowLeft, Facebook, Instagram, Radio, Globe, 
  Clipboard, Sparkles, BookOpen, AlertCircle
} from "lucide-react";
import Link from "next/link";

interface PageInputFormProps {
  businessId: string;
  businessName: string;
}

export function PageInputForm({ businessId, businessName }: PageInputFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form states
  const [platform, setPlatform] = useState("facebook"); // "facebook" | "instagram" | "both"
  const [pageUrl, setPageUrl] = useState("");
  const [handle, setHandle] = useState("");
  const [bioText, setBioText] = useState("");
  const [rawPostsText, setRawPostsText] = useState("");
  const [manualNotes, setManualNotes] = useState("");

  const handleCopyExample = () => {
    const exampleText = 
`---
[Post 1]
سبردينة Classic Leather Sneakers متوفرة الآن بـ 3 ألوان كلاسيكية! 🔥
بجلد طبيعي 100%، مريحة وتناسب الخرجات اليومية.
التوصيل متوفر لـ 58 ولاية والدفع عند الاستلام.
اطلبها الآن عبر بريد الصفحة أو واتساب 0550123456 📞
---
[Post 2]
هل تعاني من آلام الظهر أثناء المشي الطويل؟ 🚶‍♂️
سبرديناتنا الطبية مصممة خصيصاً بمقاسات مدروسة ونعل طبي يمتص الصدمات.
السعر: 3500 دج فقط مع ضمان لمدة عام!
سارع بالطلب، الكمية محدودة جداً.`;
    
    setRawPostsText(exampleText);
    toast.success("Example template loaded into text area!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!platform) {
      toast.error("Please select a target social platform.");
      return;
    }

    setLoading(true);

    const payload = {
      platform,
      pageUrl: pageUrl || null,
      handle: handle || null,
      bioText: bioText || null,
      rawPostsText: rawPostsText || null,
      manualNotes: manualNotes || null,
    };

    try {
      await createPageInputAction(businessId, payload);
      toast.success("Social media page details configured successfully!");
      router.push(`/businesses/${businessId}?tab=audits`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save page inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6">
      
      {/* Back button */}
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
          <Link href={`/businesses/${businessId}?tab=audits`}>
            <ArrowLeft className="size-4" />
            Back to {businessName} Workspace
          </Link>
        </Button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: The Input Form (2/3 width) */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <Card className="border shadow-xs backdrop-blur-md bg-card/60">
            <CardHeader className="space-y-1.5 border-b pb-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                  <Facebook className="size-4" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Configure Social Page Inputs
                </CardTitle>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                Enter current social details and paste recent organic posts. This provides the context used by our AI audits to analyze conversion loopholes.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 space-y-6">
              
              {/* Target Social Platform Selector */}
              <div className="space-y-2.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Target Social Platform <span className="text-destructive">*</span>
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPlatform("facebook")}
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                      platform === "facebook"
                        ? "bg-primary text-primary-foreground border-primary shadow-sm font-bold"
                        : "bg-transparent text-muted-foreground hover:bg-accent/40 border-input"
                    }`}
                  >
                    <Facebook className="size-4" />
                    Facebook
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlatform("instagram")}
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                      platform === "instagram"
                        ? "bg-primary text-primary-foreground border-primary shadow-sm font-bold"
                        : "bg-transparent text-muted-foreground hover:bg-accent/40 border-input"
                    }`}
                  >
                    <Instagram className="size-4" />
                    Instagram
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlatform("both")}
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                      platform === "both"
                        ? "bg-primary text-primary-foreground border-primary shadow-sm font-bold"
                        : "bg-transparent text-muted-foreground hover:bg-accent/40 border-input"
                    }`}
                  >
                    <Radio className="size-4" />
                    Both / كلاهما
                  </button>
                </div>
              </div>

              {/* Page Link & Handle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="page-url" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Page URL Link
                  </Label>
                  <div className="relative flex items-center">
                    <Globe className="absolute left-3 size-4 text-muted-foreground" />
                    <Input
                      id="page-url"
                      value={pageUrl}
                      onChange={(e) => setPageUrl(e.target.value)}
                      placeholder="e.g. facebook.com/yourbrand"
                      disabled={loading}
                      className="h-10 text-sm pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="page-handle" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Page Handle
                  </Label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-sm font-semibold text-muted-foreground">@</span>
                    <Input
                      id="page-handle"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      placeholder="e.g. yourbrand_dz"
                      disabled={loading}
                      className="h-10 text-sm pl-8"
                    />
                  </div>
                </div>
              </div>

              {/* Bio Text */}
              <div className="space-y-2">
                <Label htmlFor="bio-text" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Current Page Bio / Intro Text
                </Label>
                <Textarea
                  id="bio-text"
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  placeholder="Paste your current social media bio or page introduction text exactly as it is written..."
                  disabled={loading}
                  className="min-h-16 text-sm leading-relaxed"
                />
              </div>

              {/* Paste Social Feed Text */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="posts-text" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Recent Social Feed Posts
                  </Label>
                  <button
                    type="button"
                    onClick={handleCopyExample}
                    className="text-[10px] text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Clipboard className="size-3" />
                    Load Template Example
                  </button>
                </div>
                <Textarea
                  id="posts-text"
                  value={rawPostsText}
                  onChange={(e) => setRawPostsText(e.target.value)}
                  placeholder="Copy and paste 3-5 of your recent posts, captions, and comments here. Separate each post using three dashes '---' to help the AI partition the records."
                  disabled={loading}
                  className="min-h-40 text-sm leading-relaxed"
                />
              </div>

              {/* Strategic Focus / Notes */}
              <div className="space-y-2">
                <Label htmlFor="manual-notes" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Strategic Focus or Additional Notes
                </Label>
                <Textarea
                  id="manual-notes"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="Mention target challenges, delivery parameters (like 'we Yalidine ship to 58 wilayas'), or competitor angles you'd like the AI to analyze..."
                  disabled={loading}
                  className="min-h-20 text-sm leading-relaxed"
                />
              </div>

            </CardContent>

            {/* Actions Footer */}
            <div className="border-t p-6 sm:p-8 flex items-center justify-between gap-4 bg-accent/10">
              <div className="text-xs text-muted-foreground hidden sm:block">
                Configure details accurately to improve AI auditing outcomes.
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  asChild
                  variant="outline"
                  type="button"
                  disabled={loading}
                  className="w-full sm:w-auto cursor-pointer"
                >
                  <Link href={`/businesses/${businessId}?tab=audits`}>
                    Cancel
                  </Link>
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Saving Configuration...
                    </>
                  ) : (
                    <>
                      Save Configuration
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </form>

        {/* Right Column: AI Optimization Guidance Panel (1/3 width) */}
        <div className="space-y-6">
          
          {/* Guide Card */}
          <Card className="border border-primary/20 shadow-xs bg-primary/5">
            <CardHeader className="pb-3 border-b border-primary/10">
              <CardTitle className="text-base font-bold flex items-center gap-1.5 text-primary">
                <BookOpen className="size-4.5" />
                AI Optimization Guide
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground leading-relaxed">
                Learn how to format your page inputs to ensure highly actionable page audits.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs leading-relaxed text-muted-foreground">
              
              <div className="space-y-1.5">
                <h4 className="font-semibold text-foreground flex items-center gap-1">
                  <Sparkles className="size-3.5 text-primary" />
                  Why organic posts matter
                </h4>
                <p>
                  By pasting real social posts, the AI model detects vocabulary choices, spelling errors, copy styles, call-to-actions, and trust builders to benchmark conversion effectiveness.
                </p>
              </div>

              <div className="space-y-1.5 pt-3 border-t">
                <h4 className="font-semibold text-foreground flex items-center gap-1">
                  <AlertCircle className="size-3.5 text-primary" />
                  Formatting Rules
                </h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Paste 3 to 5 recent captions verbatim.</li>
                  <li>Include comments/replies if useful.</li>
                  <li>Use <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[10px] text-foreground">---</code> on a separate line between posts.</li>
                </ul>
              </div>

              {/* Copyable template container */}
              <div className="space-y-2 pt-3 border-t">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-foreground">Format Template</h4>
                  <button
                    type="button"
                    onClick={handleCopyExample}
                    className="text-[10px] text-primary hover:underline font-semibold"
                  >
                    Load
                  </button>
                </div>
                <pre className="p-2.5 rounded bg-muted/60 border font-mono text-[10px] text-foreground leading-normal whitespace-pre-wrap select-all">
{`---
[Post Headline / Date]
Your caption text here in Arabic/Darija...
Default CTA or ordering number.
---
[Post Headline 2]
Second post caption...`}
                </pre>
              </div>

              <div className="pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleCopyExample} 
                  className="w-full justify-center text-[10px] font-semibold h-8 cursor-pointer"
                >
                  <Clipboard className="size-3 mr-1" />
                  Load Example to Textarea
                </Button>
              </div>

            </CardContent>
          </Card>
          
        </div>

      </div>
    </div>
  );
}
