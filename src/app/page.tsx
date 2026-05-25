"use client";

import Link from "next/link";
import { LineChart, Calendar, Sparkles, Languages, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

export default function Home() {
  const { data: session, isPending } = useSession();

  return (
    <main className="flex-1 min-h-screen bg-background relative overflow-hidden" id="main-content">
      {/* Decorative Radial Background */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[500px] pointer-events-none opacity-20 dark:opacity-10" 
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 0%, var(--accent) 0%, transparent 60%)'
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-accent/30 text-accent-foreground text-xs font-semibold animate-fade-in">
            <Sparkles className="size-3.5 text-primary animate-pulse" />
            <span>أول أداة جزائرية بالذكاء الاصطناعي لتحليل الصفحات</span>
          </div>

          {/* Hero Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight sm:leading-none text-foreground">
              حلل صفحتك، افهم نقاط ضعفها، وخذ <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary via-primary/95 to-primary/70 bg-clip-text text-transparent">
                خطة محتوى أسبوعية جاهزة للنشر
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              PagePilot DZ transforms your Facebook & Instagram pages into high-converting sales funnels. Stop posting randomly—generate tailored content strategies in Algerian Darija, Arabic, and French.
            </p>
          </div>

          {/* Hero Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up">
            {isPending ? (
              <Button size="lg" disabled className="w-full sm:w-auto h-11 px-8 rounded-md">
                Loading...
              </Button>
            ) : session ? (
              <Button asChild size="lg" className="w-full sm:w-auto h-11 px-8 rounded-md font-medium">
                <Link href="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="w-full sm:w-auto h-11 px-8 rounded-md font-medium">
                  <Link href="/register">
                    Start Auditing Now <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-11 px-8 rounded-md font-medium">
                  <Link href="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>

          {/* Core Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 sm:pt-20 text-left">
            
            {/* Feature 1 */}
            <div className="p-6 border rounded-lg bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 transition-colors group-hover:bg-primary/20">
                <LineChart className="size-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">
                Page Audit (Score /100)
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Analyze your bio, CTAs, trust signals, and content mix according to our strict Algerian conversion rubric. Find the exact friction points blocking your customer messages.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 border rounded-lg bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 transition-colors group-hover:bg-primary/20">
                <Calendar className="size-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">
                7-Day Content Plan
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get a balanced distribution of educational, promotional, trust-building, and interactive content mapped specifically to your Algerian niche (Fashion, Food, Clinic, Cosmetics, etc).
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 border rounded-lg bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 transition-colors group-hover:bg-primary/20">
                <Languages className="size-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">
                Local Copiable Post Cards
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Generate high-converting hook patterns, interactive captions, and precise visual direction in professional Algerian Darija, French, or bilingual formats with a single click.
              </p>
            </div>

          </div>

          {/* Core Algerian Niche Section */}
          <div className="border rounded-xl p-8 bg-card/30 backdrop-blur-sm text-left space-y-6 max-w-3xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-foreground">
              <ShieldCheck className="size-6 text-primary" />
              Engineered for the Algerian Commerce Ecosystem
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Algerian customers buy through direct interactions. Standard, generic AI tools don't understand the nuance of native Darija prompts, delivery logistics (58 Wilayas), or cash-on-delivery trust cycles. PagePilot DZ has been built to generate custom CTA triggers like:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="size-4 text-primary shrink-0 mt-0.5" />
                <span>"ابعثلنا كلمة 'سعر' ونرسلك التفاصيل في الخاص"</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="size-4 text-primary shrink-0 mt-0.5" />
                <span>"راسلنا في الواتساب وخذ التوصيل مجاني لـ 58 ولاية"</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="size-4 text-primary shrink-0 mt-0.5" />
                <span>"احجز موعدك بسهولة عبر رسالة خاصة"</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="size-4 text-primary shrink-0 mt-0.5" />
                <span>"الدفع عند الاستلام مع ضمان الاستبدال الحقيقي"</span>
              </div>
            </div>
          </div>

          {/* Footnote / Conversion Callout */}
          <div className="pt-8 text-sm text-muted-foreground">
            Trusted internally by agencies to run professional audits for local commerce. 
            No credit card required to start.
          </div>

        </div>
      </div>
    </main>
  );
}
