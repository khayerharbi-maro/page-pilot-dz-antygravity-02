# PagePilot DZ - OpenCode Implementation Plan AR-EN

> هذه الخطة مخصصة للصقها أو تلخيصها داخل OpenCode Plan Mode أو أي IDE/agent آخر.  
> English version included below Arabic version.

Related: [[PagePilot DZ - Project Hub]]، [[PagePilot DZ - Web App Build Checkpoint 2026-05-25]]، [[PagePilot DZ - MVP PRD]]

---

# النسخة العربية

## 1. السياق

أنا أعمل داخل مشروع موجود مسبقاً:

```text
/Users/macbookpro/Projects/page-pilot-dz-vs_opencode-test01
```

المشروع مبني على `agentic-coding-starter-kit` من Leon. لا تغيّر الستاك الأساسي.

الستاك المثبت:

- Next.js 16 App Router
- TypeScript
- Better Auth
- PostgreSQL + Drizzle ORM
- Vercel AI SDK + OpenRouter
- shadcn/ui + Tailwind CSS

مهم: لا تستخدم Supabase في هذا المشروع. أي ذكر لـ Supabase في PRD القديم يعتبر outdated.

---

## 2. الهدف

حوّل الـboilerplate الحالي إلى MVP لتطبيق اسمه **PagePilot DZ**.

PagePilot DZ هو تطبيق يحلل صفحة Facebook/Instagram لمشروع صغير في الجزائر، ثم يولد:

1. Client-friendly Page Audit report.
2. 7-Day Content Plan.
3. Ready-to-copy post cards.
4. Saved history/library.

التطبيق يستخدمه Jack داخلياً أولاً، لكنه يجب أن يكون **Client-ready من أول نسخة**. اكتب الواجهة والتقرير كأن العميل نفسه يمكنه استعمال التطبيق لاحقاً.

---

## 3. قواعد مهمة

- لا تجعل التطبيق مجرد chat UI.
- لا تجعل `/chat` هو المنتج الأساسي.
- أخفِ أو اترك `/chat` خارج navigation في MVP.
- استبدل boilerplate UI بالكامل: home, dashboard, starter checklist, demo copy.
- التقرير النهائي يجب أن يخاطب العميل مباشرة، لا يكتب ملاحظات لـ Jack.
- لا Meta API في MVP.
- لا scraping إجباري في MVP.
- لا scheduling أو publishing.
- Export في MVP: Markdown فقط.
- Google Sheet لاحقاً.

---

## 4. اللغات والنيشات

### Languages

النظام يدعم اختيار:

- Arabic
- Darija
- French
- Arabic + Darija
- Darija + French
- Mixed

### Tone

- شعبي
- محترف
- فاخر
- شبابي
- تعليمي
- شعبية محترفة

### Category dropdown

استخدم Dropdown:

- Restaurant / Café
- Clothing / Fashion
- Beauty / Cosmetics
- Clinic / Health
- Training / Education
- Real Estate
- Home Services
- Car Sales / Import
- Import / Export
- Freelance / Agency
- Other

إذا اختار `Other` أظهر `customNiche`.

---

## 5. Routes المطلوبة

```text
/dashboard
/businesses
/businesses/new
/businesses/[id]
/businesses/[id]/edit
/businesses/[id]/products
/businesses/[id]/page-inputs/new
/businesses/[id]/audits/[auditId]
/businesses/[id]/content-plans/[planId]
/library
```

---

## 6. Database schema المطلوب

أضف الجداول التالية في `src/lib/schema.ts` باستخدام Drizzle/Postgres. Better Auth tables تبقى كما هي.

### businesses

- `id` UUID/text generated
- `userId`
- `name`
- `category`
- `customNiche`
- `city`
- `wilaya`
- `description`
- `audience`
- `mainPain`
- `competitiveAdvantage`
- `primaryLanguage`
- `toneStyle`
- `sellingChannels`
- `orderMethods`
- `defaultCta`
- `contentConstraints`
- `weeklyGoal`
- `createdAt`
- `updatedAt`

### productsServices

- `id`
- `businessId`
- `type` product/service
- `name`
- `price`
- `description`
- `benefits`
- `targetAudience`
- `painOrProblem`
- `orderMethod`
- `notes`
- `activeForPlanning`
- `createdAt`
- `updatedAt`

### pageInputs

- `id`
- `businessId`
- `platform`
- `pageUrl`
- `handle`
- `bioText`
- `rawPostsText`
- `manualNotes`
- `createdAt`

### pageAudits

- `id`
- `businessId`
- `pageInputId`
- `score`
- `scoreBreakdown` JSON
- `summary`
- `strengths` JSON
- `weaknesses` JSON
- `urgentFixes` JSON
- `bioRewrite`
- `ctaRecommendation`
- `trustReview` JSON/text
- `contentMixDiagnosis` JSON/text
- `conversionReview` JSON/text
- `languageRecommendation` JSON/text
- `recommendedPillars` JSON
- `pinnedPostProposal` JSON
- `nextAction`
- `outputJson` JSON
- `createdAt`

### contentPlans

- `id`
- `businessId`
- `auditId`
- `title`
- `goal`
- `status`
- `createdAt`
- `updatedAt`

### contentItems

- `id`
- `contentPlanId`
- `businessId`
- `dayNumber`
- `platform`
- `goal`
- `contentType`
- `format`
- `hook`
- `caption`
- `cta`
- `visualIdea`
- `textOnVisual`
- `hashtags` JSON/text
- `notes`
- `status`
- `createdAt`
- `updatedAt`

### aiGenerations

- `id`
- `userId`
- `businessId`
- `generationType`
- `inputJson`
- `outputJson`
- `model`
- `createdAt`

---

## 7. Components المقترحة

- `AppShell`
- `DashboardOverview`
- `BusinessCard`
- `BusinessForm`
- `BusinessDetailHeader`
- `ProductServiceForm`
- `ProductServiceList`
- `PageInputForm`
- `AuditReport`
- `AuditScoreCard`
- `ScoreBreakdown`
- `WeeklyPlanView`
- `ContentItemCard`
- `CopyButton`
- `MarkdownExportButton`

استعمل shadcn/ui الموجود قبل إنشاء custom components.

---

## 8. Server Actions المقترحة

أنشئ Server Actions أو modules مناسبة لـ:

- `createBusiness`
- `updateBusiness`
- `deleteBusiness`
- `createProductService`
- `updateProductService`
- `createPageInput`
- `generatePageAudit`
- `generateWeeklyPlan`
- `updateContentItemStatus`
- `exportAuditMarkdown`
- `exportPlanMarkdown`

كل action يجب أن يتحقق من session/user ownership.

---

## 9. AI prompt behavior

### Audit generator

يأخذ:

- business profile
- products/services
- page input

ويرجع JSON + report readable.

التقرير يجب أن يكون Client-Friendly. لا تستخدم “Jack” في التقرير.

### Weekly plan generator

يأخذ:

- business profile
- latest audit
- products/services
- weekly goal
- language/tone

ويرجع 7 content items، كل واحد فيه:

- day
- goal
- content type
- platform
- format
- hook
- caption
- CTA
- visual idea
- hashtags
- notes

---

## 10. مراحل التنفيذ

### Phase 1 — Clean Boilerplate

- استبدل home page بصفحة PagePilot DZ بسيطة.
- استبدل `/dashboard` بDashboard فعلي.
- أخفِ `/chat` من navigation.
- أزل setup checklist/starter prompt من الواجهة.

### Phase 2 — Database

- أضف الجداول في schema.
- شغّل `pnpm db:generate`.
- شغّل `pnpm db:migrate`.

### Phase 3 — Business Profile

- صفحة businesses list.
- صفحة create business.
- صفحة business detail.

### Phase 4 — Products + Page Input

- CRUD بسيط للمنتجات/الخدمات.
- form لإدخال page input يدوياً.

### Phase 5 — Audit

- AI audit generation.
- حفظ audit.
- عرض audit report.
- copy/export markdown.

### Phase 6 — Weekly Plan

- AI weekly plan generation.
- حفظ content plan + items.
- عرض 7 cards.
- copy/export markdown.

---

## 11. Verification

بعد كل phase شغل:

```bash
pnpm check
pnpm build:ci
```

إذا build العادي يحتاج DB migration وكان Postgres غير جاهز، استخدم `pnpm build:ci` للتحقق من Next build بدون migration.

---

# English Version

## 1. Context

I am working inside an existing project:

```text
/Users/macbookpro/Projects/page-pilot-dz-vs_opencode-test01
```

The project is based on Leon's `agentic-coding-starter-kit`. Do not replace the stack.

Fixed stack:

- Next.js 16 App Router
- TypeScript
- Better Auth
- PostgreSQL + Drizzle ORM
- Vercel AI SDK + OpenRouter
- shadcn/ui + Tailwind CSS

Important: Do not use Supabase in this project. Any old Supabase mention in the PRD is outdated for this codebase.

---

## 2. Goal

Transform the current boilerplate into an MVP for **PagePilot DZ**.

PagePilot DZ analyzes a Facebook/Instagram page for a small Algerian business and generates:

1. Client-friendly Page Audit report.
2. 7-Day Content Plan.
3. Ready-to-copy post cards.
4. Saved history/library.

Jack will use it internally first, but it must be **client-ready from MVP**. Write the UI and reports as if the client/business owner may use the app later.

---

## 3. Important Rules

- Do not make the product a generic chat UI.
- Do not make `/chat` the main product.
- Hide `/chat` from navigation or leave it outside the MVP.
- Fully replace the boilerplate UI: home, dashboard, starter checklist, demo copy.
- The final report must speak directly to the client/business owner, not to Jack.
- No Meta API in MVP.
- No required scraping in MVP.
- No scheduling or social publishing.
- MVP export: Markdown only.
- Google Sheets export later.

---

## 4. Languages and Niches

Languages:

- Arabic
- Darija
- French
- Arabic + Darija
- Darija + French
- Mixed

Tone:

- Popular/local
- Professional
- Premium
- Youthful
- Educational
- Professional-local

Category dropdown:

- Restaurant / Café
- Clothing / Fashion
- Beauty / Cosmetics
- Clinic / Health
- Training / Education
- Real Estate
- Home Services
- Car Sales / Import
- Import / Export
- Freelance / Agency
- Other

If `Other` is selected, show `customNiche`.

---

## 5. Required Routes

```text
/dashboard
/businesses
/businesses/new
/businesses/[id]
/businesses/[id]/edit
/businesses/[id]/products
/businesses/[id]/page-inputs/new
/businesses/[id]/audits/[auditId]
/businesses/[id]/content-plans/[planId]
/library
```

---

## 6. Required Database Tables

Add these Drizzle/Postgres tables in `src/lib/schema.ts`. Keep Better Auth tables as they are.

- `businesses`
- `productsServices`
- `pageInputs`
- `pageAudits`
- `contentPlans`
- `contentItems`
- `aiGenerations`

Use the Arabic section above for exact field list. All user-owned tables must link to the authenticated user or to a business owned by the user.

---

## 7. Suggested Components

- `AppShell`
- `DashboardOverview`
- `BusinessCard`
- `BusinessForm`
- `BusinessDetailHeader`
- `ProductServiceForm`
- `ProductServiceList`
- `PageInputForm`
- `AuditReport`
- `AuditScoreCard`
- `ScoreBreakdown`
- `WeeklyPlanView`
- `ContentItemCard`
- `CopyButton`
- `MarkdownExportButton`

Use existing shadcn/ui primitives before creating custom components.

---

## 8. Suggested Server Actions

- `createBusiness`
- `updateBusiness`
- `deleteBusiness`
- `createProductService`
- `updateProductService`
- `createPageInput`
- `generatePageAudit`
- `generateWeeklyPlan`
- `updateContentItemStatus`
- `exportAuditMarkdown`
- `exportPlanMarkdown`

Each action must validate the session and user ownership.

---

## 9. AI Prompt Behavior

### Audit generator

Input:

- business profile
- products/services
- page input

Output:

- structured JSON
- readable client-friendly report

Do not mention Jack in the client report.

### Weekly plan generator

Input:

- business profile
- latest audit
- products/services
- weekly goal
- language/tone

Output: 7 content items with:

- day
- goal
- content type
- platform
- format
- hook
- caption
- CTA
- visual idea
- hashtags
- notes

---

## 10. Implementation Phases

### Phase 1 — Clean Boilerplate

- Replace home page with a simple PagePilot DZ landing/home.
- Replace `/dashboard` with a real dashboard.
- Hide `/chat` from navigation.
- Remove setup checklist/starter prompt from visible UI.

### Phase 2 — Database

- Add schema tables.
- Run `pnpm db:generate`.
- Run `pnpm db:migrate`.

### Phase 3 — Business Profile

- Businesses list.
- Create business page.
- Business detail page.

### Phase 4 — Products + Page Input

- Simple products/services CRUD.
- Manual page input form.

### Phase 5 — Audit

- AI audit generation.
- Save audit.
- Render audit report.
- Copy/export markdown.

### Phase 6 — Weekly Plan

- AI weekly plan generation.
- Save content plan + items.
- Render 7 cards.
- Copy/export markdown.

---

## 11. Verification

After each phase run:

```bash
pnpm check
pnpm build:ci
```

If normal build requires migrations and local Postgres is not ready, use `pnpm build:ci` for a Next.js build check without migration.
