"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { createBusinessAction, updateBusinessAction } from "@/lib/actions/businesses";
import { Loader2, ArrowLeft, Building2, Store, Sparkles, Target, MessageSquare } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  "Restaurant/Café",
  "Clothing/Fashion",
  "Clinic/Health",
  "E-commerce/Retail",
  "Beauty/Cosmetics",
  "Education/Academy",
  "Tech/Software",
  "Other"
];

const ALGERIAN_WILAYAS = [
  "01 - Adrar (أدرار)", "02 - Chlef (الشلف)", "03 - Laghouat (الأغواط)", "04 - Oum El Bouaghi (أم البواقي)", "05 - Batna (باتنة)", 
  "06 - Béjaïa (بجاية)", "07 - Biskra (بسكرة)", "08 - Béchar (بشار)", "09 - Blida (البليدة)", "10 - Bouira (البويرة)", 
  "11 - Tamanrasset (تمنراست)", "12 - Tébessa (تبسة)", "13 - Tlemcen (تلمسان)", "14 - Tiaret (تيارت)", "15 - Tizi Ouzou (تيزي وزو)", 
  "16 - Alger (الجزائر)", "17 - Djelfa (الجلفة)", "18 - Jijel (جيجل)", "19 - Sétif (سطيف)", "20 - Saïda (سعيدة)", 
  "21 - Skikda (سكيكدة)", "22 - Sidi Bel Abbès (سيدي بلعباس)", "23 - Annaba (عنابة)", "24 - Guelma (قالمة)", "25 - Constantine (قسنطينة)", 
  "26 - Médéa (المدية)", "27 - Mostaganem (مستغانم)", "28 - M'Sila (المسيلة)", "29 - Mascara (معسكر)", "30 - Ouargla (ورقلة)", 
  "31 - Oran (وهران)", "32 - El Bayadh (البيض)", "33 - Illizi (إليزي)", "34 - Bordj Bou Arréridj (برج بوعريريج)", "35 - Boumerdès (بومرداس)", 
  "36 - El Tarf (الطارف)", "37 - Tindouf (تندوف)", "38 - Tissemsilt (تسمسيلت)", "39 - El Oued (الوادي)", "40 - Khenchela (خنشلة)", 
  "41 - Souk Ahras (سوق أهراس)", "42 - Tipaza (تيبازة)", "43 - Mila (ميلة)", "44 - Aïn Defla (عين الدفلى)", "45 - Naâma (النعامة)", 
  "46 - Aïn Témouchent (عين تموشنت)", "47 - Ghardaïa (غرداية)", "48 - Relizane (غليزان)", "49 - El M'Ghair (المغير)", "50 - El Meniaa (المنيعة)", 
  "51 - Ouled Djellal (أولاد جلال)", "52 - Bordj Baji Mokhtar (برج باجي مختار)", "53 - Béni Abbès (بني عباس)", "54 - In Salah (عين صالح)", "55 - In Guezzam (عين قزام)", 
  "56 - Touggourt (تقرت)", "57 - Djanet (جانت)", "58 - Aïn Salah (عين صالح)"
];

const LANGUAGES = [
  "Darija (Algerian Dialect)",
  "Modern Standard Arabic (Fusha)",
  "French",
  "English",
  "Mixed Arabic/French (Frarab)",
  "Mixed Darija/French"
];

const TONE_STYLES = [
  "Popular/Local (Darija-focused)",
  "Professional & Corporate",
  "Premium & Luxury",
  "Youthful & Humorous",
  "Educational & Informative",
  "Professional-Local (Mixed approach)"
];

const SELLING_CHANNELS = [
  { id: "Facebook", label: "Facebook" },
  { id: "Instagram", label: "Instagram" },
  { id: "WhatsApp", label: "WhatsApp" },
  { id: "TikTok", label: "TikTok" },
  { id: "Website", label: "Website" },
  { id: "Physical Store", label: "Physical Store" }
];

const ORDER_METHODS = [
  { id: "WhatsApp DM", label: "WhatsApp DM" },
  { id: "Messenger DM", label: "Messenger DM" },
  { id: "Phone Call", label: "Phone Call" },
  { id: "Website Order", label: "Website Order" },
  { id: "Physical Visit", label: "Physical Visit" }
];

interface BusinessFormProps {
  isEdit?: boolean;
  initialData?: any;
}

export function BusinessForm({ isEdit = false, initialData }: BusinessFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form Fields State
  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [customNiche, setCustomNiche] = useState(initialData?.customNiche || "");
  const [wilaya, setWilaya] = useState(initialData?.wilaya || "");
  const [city, setCity] = useState(initialData?.city || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [audience, setAudience] = useState(initialData?.audience || "");
  const [mainPain, setMainPain] = useState(initialData?.mainPain || "");
  const [competitiveAdvantage, setCompetitiveAdvantage] = useState(initialData?.competitiveAdvantage || "");
  const [primaryLanguage, setPrimaryLanguage] = useState(initialData?.primaryLanguage || "");
  const [toneStyle, setToneStyle] = useState(initialData?.toneStyle || "");

  // Multi-select lists parsed as arrays
  const [channels, setChannels] = useState<string[]>(
    initialData?.sellingChannels ? initialData.sellingChannels.split(",").map((c: string) => c.trim()) : []
  );
  const [orderMethods, setOrderMethods] = useState<string[]>(
    initialData?.orderMethods ? initialData.orderMethods.split(",").map((o: string) => o.trim()) : []
  );

  // Optionals
  const [defaultCta, setDefaultCta] = useState(initialData?.defaultCta || "");
  const [contentConstraints, setContentConstraints] = useState(initialData?.contentConstraints || "");
  const [weeklyGoal, setWeeklyGoal] = useState(initialData?.weeklyGoal || "");



  const toggleChannel = (channel: string) => {
    setChannels(prev =>
      prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]
    );
  };

  const toggleOrderMethod = (method: string) => {
    setOrderMethods(prev =>
      prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !category || !wilaya || !city || !description || !audience || !mainPain || !competitiveAdvantage || !primaryLanguage || !toneStyle) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (category === "Other" && !customNiche) {
      toast.error("Please specify your custom category niche.");
      return;
    }

    if (channels.length === 0) {
      toast.error("Please select at least one Selling Channel.");
      return;
    }

    if (orderMethods.length === 0) {
      toast.error("Please select at least one Ordering Method.");
      return;
    }

    setLoading(true);

    const payload = {
      name,
      category,
      customNiche: category === "Other" ? customNiche : null,
      city,
      wilaya,
      description,
      audience,
      mainPain,
      competitiveAdvantage,
      primaryLanguage,
      toneStyle,
      sellingChannels: channels.join(", "),
      orderMethods: orderMethods.join(", "),
      defaultCta: defaultCta || null,
      contentConstraints: contentConstraints || null,
      weeklyGoal: weeklyGoal || null,
    };

    try {
      if (isEdit && initialData?.id) {
        await updateBusinessAction(initialData.id, payload);
        toast.success("Business profile updated successfully!");
        router.push(`/businesses/${initialData.id}`);
      } else {
        const result = await createBusinessAction(payload);
        toast.success("Business profile created successfully!");
        router.push(`/businesses/${result.id}`);
      }
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6">
      
      {/* Back button */}
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
          <Link href={isEdit ? `/businesses/${initialData?.id}` : "/businesses"}>
            <ArrowLeft className="size-4" />
            Back to {isEdit ? "Workspace" : "Businesses"}
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="border shadow-xs backdrop-blur-md bg-card/60">
          <CardHeader className="space-y-1.5 border-b pb-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                <Building2 className="size-4.5" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                {isEdit ? "Edit Business Profile" : "Create New Business Profile"}
              </CardTitle>
            </div>
            <CardDescription className="text-sm text-muted-foreground">
              Define the business context, local audience preferences, and tone guidelines. This forms the foundation for AI audits and custom content plan generations.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 space-y-8">
            
            {/* SECTION 1: Identity & Location */}
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-base font-semibold text-foreground border-b pb-1.5">
                <Store className="size-4 text-primary" />
                Identity & Location
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Business Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. DZ E-Commerce Hub, Pizzeria La Valetta"
                    required
                    disabled={loading}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Commerce Category <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    disabled={loading}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
                  >
                    <option value="" disabled className="dark:bg-card">Select category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="dark:bg-card">{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic custom niche field */}
              {category === "Other" && (
                <div className="space-y-2 animate-fade-up">
                  <Label htmlFor="customNiche" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Specify Custom Niche <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="customNiche"
                    value={customNiche}
                    onChange={(e) => setCustomNiche(e.target.value)}
                    placeholder="e.g. Traditional Algerian Crafts, Custom Metal Carpentry"
                    required
                    disabled={loading}
                    className="h-10"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="wilaya" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Primary Wilaya <span className="text-destructive">*</span>
                  </Label>
                  
                  {/* Beautiful styled select for Wilayas */}
                  <select
                    id="wilaya"
                    value={wilaya}
                    onChange={(e) => setWilaya(e.target.value)}
                    required
                    disabled={loading}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
                  >
                    <option value="" disabled className="dark:bg-card">Select Wilaya</option>
                    {ALGERIAN_WILAYAS.map((w) => (
                      <option key={w} value={w} className="dark:bg-card">{w}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    City / Neighborhood <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Dely Ibrahim, Oran Centre, Constantine"
                    required
                    disabled={loading}
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Market & Competitive Core */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-1.5 text-base font-semibold text-foreground border-b pb-1.5">
                <Target className="size-4 text-primary" />
                Value Proposition & Audience
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Business Profile & Offering Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What products or services do you offer? Describe the core activity, catalog size, and signature offerings."
                    required
                    disabled={loading}
                    className="min-h-24 resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="audience" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Ideal Target Audience <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="audience"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      placeholder="Describe the demographic, purchasing behaviors, and localized Algerian customer segment (e.g. young professionals in Alger seeking healthy lunch options)."
                      required
                      disabled={loading}
                      className="min-h-20 resize-none leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mainPain" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Main Buyer Pain Point <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="mainPain"
                      value={mainPain}
                      onChange={(e) => setMainPain(e.target.value)}
                      placeholder="What is their primary frustration or barrier? (e.g. slow delivery in other wilayas, lack of sizing advice, high prices for basic imports)."
                      required
                      disabled={loading}
                      className="min-h-20 resize-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competitiveAdvantage" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Local Competitive Advantage <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="competitiveAdvantage"
                    value={competitiveAdvantage}
                    onChange={(e) => setCompetitiveAdvantage(e.target.value)}
                    placeholder="Why should customers choose you? (e.g. free fitting at home in Alger, fast 48h Yalidine delivery to all 58 wilayas, handmade local sourcing)."
                    required
                    disabled={loading}
                    className="min-h-20 resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Content Constraints & Local Alignment */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-1.5 text-base font-semibold text-foreground border-b pb-1.5">
                <MessageSquare className="size-4 text-primary" />
                Local Interaction & Content Guidelines
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryLanguage" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Primary Post/Ad Language <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="primaryLanguage"
                    value={primaryLanguage}
                    onChange={(e) => setPrimaryLanguage(e.target.value)}
                    required
                    disabled={loading}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
                  >
                    <option value="" disabled className="dark:bg-card">Select language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang} className="dark:bg-card">{lang}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toneStyle" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Tone & Style <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="toneStyle"
                    value={toneStyle}
                    onChange={(e) => setToneStyle(e.target.value)}
                    required
                    disabled={loading}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
                  >
                    <option value="" disabled className="dark:bg-card">Select tone style</option>
                    {TONE_STYLES.map((tone) => (
                      <option key={tone} value={tone} className="dark:bg-card">{tone}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selling Channels Grid of Pills */}
              <div className="space-y-2.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Selling Channels <span className="text-destructive">*</span> <span className="text-[10px] lowercase text-muted-foreground/80 font-normal">(select all that apply)</span>
                </Label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {SELLING_CHANNELS.map((ch) => {
                    const isSelected = channels.includes(ch.id);
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => toggleChannel(ch.id)}
                        disabled={loading}
                        className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-xs"
                            : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent/40 border-input"
                        }`}
                      >
                        {ch.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ordering Methods Grid of Pills */}
              <div className="space-y-2.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Ordering Methods <span className="text-destructive">*</span> <span className="text-[10px] lowercase text-muted-foreground/80 font-normal">(select all that apply)</span>
                </Label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {ORDER_METHODS.map((m) => {
                    const isSelected = orderMethods.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleOrderMethod(m.id)}
                        disabled={loading}
                        className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-xs"
                            : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent/40 border-input"
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECTION 4: Strategic Preferences (Optional) */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-1.5 text-base font-semibold text-foreground border-b pb-1.5">
                <Sparkles className="size-4 text-primary" />
                Strategic Preferences <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="defaultCta" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Default CTA / Order Prompt
                    </Label>
                    <Input
                      id="defaultCta"
                      value={defaultCta}
                      onChange={(e) => setDefaultCta(e.target.value)}
                      placeholder="e.g. WhatsApp us at 0550123456 or send a DM to order"
                      disabled={loading}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weeklyGoal" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Weekly Focus / Post Goal
                    </Label>
                    <Input
                      id="weeklyGoal"
                      value={weeklyGoal}
                      onChange={(e) => setWeeklyGoal(e.target.value)}
                      placeholder="e.g. Promote sizing guides, push Yalidine delivery deal"
                      disabled={loading}
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contentConstraints" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Content Restraints & Guidelines
                  </Label>
                  <Textarea
                    id="contentConstraints"
                    value={contentConstraints}
                    onChange={(e) => setContentConstraints(e.target.value)}
                    placeholder="e.g. Never mention shipping prices in posts, always write 'DM for orders', write prices in Fusha and Darija."
                    disabled={loading}
                    className="min-h-20 resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

          </CardContent>

          <CardFooter className="border-t p-6 sm:p-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 bg-accent/10">
            <div className="text-xs text-muted-foreground text-center sm:text-left">
              Fields marked with <span className="text-destructive">*</span> are required.
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                asChild
                variant="outline"
                type="button"
                disabled={loading}
                className="w-full sm:w-auto cursor-pointer"
              >
                <Link href={isEdit ? `/businesses/${initialData?.id}` : "/businesses"}>
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
                    {isEdit ? "Saving Changes..." : "Creating Profile..."}
                  </>
                ) : (
                  <>
                    {isEdit ? "Save Profile Changes" : "Create Business Profile"}
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
