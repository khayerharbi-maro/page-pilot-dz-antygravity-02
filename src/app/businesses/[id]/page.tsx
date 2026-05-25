import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  Building2, MapPin, Edit, Compass, Package, LineChart, Calendar, 
  Sparkles, Globe, MessageSquare, Target, ArrowLeft, Plus, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBusinessDetailAction } from "@/lib/actions/businesses";
import { getProductServicesAction } from "@/lib/actions/products";
import { getLatestPageInputAction } from "@/lib/actions/page-inputs";
import { getBusinessAuditsAction } from "@/lib/actions/audits";
import { ProductCatalog } from "@/components/businesses/product-catalog";
import { AuditsTab } from "@/components/businesses/audits-tab";
import { requireAuth } from "@/lib/session";
import { DeleteBusinessButton } from "@/components/businesses/delete-button";
import { cn } from "@/lib/utils";

interface BusinessDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function BusinessDetailPage({ params, searchParams }: BusinessDetailPageProps) {
  // Guard access
  await requireAuth();
  
  const { id } = await params;
  const { tab = "overview" } = await searchParams;
  
  const business = await getBusinessDetailAction(id);

  if (!business) {
    notFound();
  }

  // Fetch dynamic tab data
  const products = await getProductServicesAction(id);
  const latestPageInput = await getLatestPageInputAction(id);
  const pastAudits = await getBusinessAuditsAction(id);

  const activeTab = tab;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <div className="flex justify-between items-center">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
          <Link href="/businesses">
            <ArrowLeft className="size-4" />
            Back to My Businesses
          </Link>
        </Button>
      </div>

      {/* Header section with brand info and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary border border-primary/25 shadow-xs">
            <Building2 className="size-6" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{business.name}</h1>
              <Badge variant="secondary" className="font-semibold text-xs h-6">
                {business.category === "Other" && business.customNiche ? business.customNiche : business.category}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <MapPin className="size-4 text-primary" />
                <span>{business.city}, {business.wilaya}</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="size-4 text-primary" />
                <span>Language: {business.primaryLanguage}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button asChild size="sm" variant="outline" className="gap-1.5 cursor-pointer w-full md:w-auto">
            <Link href={`/businesses/${id}/edit`}>
              <Edit className="size-4" />
              Edit Profile
            </Link>
          </Button>
          <DeleteBusinessButton id={id} name={business.name} />
        </div>
      </div>

      {/* Navigation tabs inside the Workspace */}
      <div className="flex border-b overflow-x-auto scrollbar-none gap-2">
        <Link
          href={`/businesses/${id}?tab=overview`}
          className={cn(
            "px-4 py-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-1.5",
            activeTab === "overview"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Building2 className="size-4" />
          Overview
        </Link>
        <Link
          href={`/businesses/${id}?tab=products`}
          className={cn(
            "px-4 py-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-1.5",
            activeTab === "products"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Package className="size-4" />
          Products & Services
          {products.length > 0 && (
            <Badge variant="secondary" className="px-1.5 py-0 rounded-full text-[10px] ml-1 bg-primary/10 text-primary">
              {products.length}
            </Badge>
          )}
        </Link>
        <Link
          href={`/businesses/${id}?tab=audits`}
          className={cn(
            "px-4 py-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-1.5",
            activeTab === "audits"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <LineChart className="size-4" />
          AI Audits
          {latestPageInput && (
            <span className="size-1.5 rounded-full bg-green-500 ml-0.5" />
          )}
        </Link>
        <Link
          href={`/businesses/${id}?tab=plans`}
          className={cn(
            "px-4 py-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-1.5",
            activeTab === "plans"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Calendar className="size-4" />
          Content Plans
        </Link>
      </div>

      {/* Dynamic Tab Contents */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-scale-in">
            
            {/* Left/Middle area: Profile specifications */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Value proposition card */}
              <Card className="border shadow-xs bg-card/60">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-1.5">
                    <Target className="size-4.5 text-primary" />
                    Value Proposition & Identity
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Who is this business, who are they serving, and what is their edge.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 leading-relaxed">
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Business Description</h3>
                    <p className="text-sm text-foreground">{business.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t">
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target Customer Audience</h3>
                      <p className="text-sm text-foreground">{business.audience}</p>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Core Buyer Pain Point</h3>
                      <p className="text-sm text-foreground">{business.mainPain}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-4 border-t">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Local Competitive Advantage</h3>
                    <p className="text-sm text-foreground">{business.competitiveAdvantage}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Guidelines & Strategic Alignment */}
              <Card className="border shadow-xs bg-card/60">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-1.5">
                    <MessageSquare className="size-4.5 text-primary" />
                    Interaction Guidelines & Constraints
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 leading-relaxed">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Primary Language</h3>
                      <p className="text-sm text-foreground font-medium">{business.primaryLanguage}</p>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Writing Tone & Style</h3>
                      <p className="text-sm text-foreground font-medium">{business.toneStyle}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Selling Channels</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {business.sellingChannels.split(",").map((c: string) => (
                          <Badge key={c} variant="outline" className="font-semibold py-0.5 px-2 bg-accent/30 text-xs">
                            {c.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Ordering & Intake Methods</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {business.orderMethods.split(",").map((m: string) => (
                          <Badge key={m} variant="outline" className="font-semibold py-0.5 px-2 bg-accent/30 text-xs">
                            {m.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Right side: Strategy overview & Quick specs */}
            <div className="space-y-6">
              
              {/* Strategic preferences card */}
              <Card className="border shadow-xs bg-card/60">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-1.5">
                    <Sparkles className="size-4.5 text-primary" />
                    Content Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 leading-relaxed">
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Default CTA</h3>
                    <p className="text-sm text-foreground font-medium">
                      {business.defaultCta || <span className="text-muted-foreground italic">None configured</span>}
                    </p>
                  </div>
                  
                  <div className="space-y-1.5 pt-4 border-t">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Weekly Goal</h3>
                    <p className="text-sm text-foreground font-medium">
                      {business.weeklyGoal || <span className="text-muted-foreground italic">None configured</span>}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-4 border-t">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Constraints & Rules</h3>
                    <p className="text-sm text-foreground">
                      {business.contentConstraints || <span className="text-muted-foreground italic">No constraints registered</span>}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Sidebar Action card */}
              <Card className="border border-primary/20 shadow-xs bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-1.5 text-primary">
                    <Compass className="size-4" />
                    Next Actions
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Advance your client through the workspace pipeline.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-4">
                  <p>
                    {products.length === 0 
                      ? "Get started by building your Product Catalog. This allows AI models to tie specific offerings directly into writing prompts." 
                      : "Awesome! Your Product Catalog has active products. Continue to AI Audits to link social channels."}
                  </p>
                  <Button asChild size="sm" className="w-full justify-center gap-1.5 cursor-pointer">
                    <Link href={products.length === 0 ? `/businesses/${id}?tab=products` : `/businesses/${id}?tab=audits`}>
                      <ChevronRight className="size-4" />
                      {products.length === 0 ? "Manage Products" : "Go to Audits"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>

            </div>

          </div>
        )}

        {/* Dynamic Products Catalog Tab */}
        {activeTab === "products" && (
          <ProductCatalog businessId={id} products={products} />
        )}

        {/* Dynamic AI Audits Tab */}
        {activeTab === "audits" && (
          <div className="space-y-6">
            {!latestPageInput ? (
              /* If no page configuration exists yet */
              <div className="max-w-xl mx-auto text-center space-y-6 border p-8 rounded-lg bg-card shadow-xs py-16 backdrop-blur-sm bg-card/60 animate-scale-in">
                <div className="size-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <LineChart className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-foreground">AI Conversion Audits</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Audit social media pages using AI models to detect conversion loopholes, bio rewrite recommendations, and copywriting gaps. Setup page parameters to unlock audits.
                  </p>
                </div>
                <div className="pt-2">
                  <Button asChild size="sm" className="gap-1.5 cursor-pointer">
                    <Link href={`/businesses/${id}/page-inputs/new`}>
                      <Plus className="size-4" />
                      Configure Page Input
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              /* Render dynamic active audits tab wrapper */
              <AuditsTab 
                businessId={id} 
                latestPageInput={latestPageInput} 
                pastAudits={pastAudits} 
              />
            )}
          </div>
        )}

        {/* Phase 6 placeholder: Content Plans */}
        {activeTab === "plans" && (
          <div className="max-w-xl mx-auto text-center space-y-6 border p-8 rounded-lg bg-card shadow-xs py-16 backdrop-blur-sm bg-card/60 animate-scale-in">
            <div className="size-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">AI Weekly Content Plans</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Generate high-converting 7-day social media plans containing fully-formed hooks, Darija captions, specific calls-to-action, and visual mock templates. Enabled in Phase 6.
              </p>
            </div>
            <div className="pt-2">
              <Button disabled size="sm" className="gap-1.5 opacity-70">
                <Plus className="size-4" />
                Plan Weekly Calendar (Phase 6)
              </Button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
