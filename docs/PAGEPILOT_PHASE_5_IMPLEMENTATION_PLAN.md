# PagePilot DZ - Phase 5 Implementation Plan

## Goal
Implement **AI Page Audits** for social media channels. This phase integrates the automated AI generation engine (Vercel AI SDK + OpenRouter model) that analyzes business profiles, products catalog, and social media feed history. It parses conversion loopholes, rewrites user bios, detects copywriting weaknesses, and stores/renders the final client-ready audits as stunning, interactive reports.

---

## Scope
1. **Audits Server Actions:** Create `src/lib/actions/audits.ts` to manage audits:
   - `generatePageAuditAction(businessId)`: Gathers active business profile parameters, active products/services catalog metadata, and the latest manual page inputs. Connects to OpenRouter (`OPENROUTER_MODEL`), executes a carefully crafted structured JSON prompt, saves the result to `pageAudits` table, and revalidates paths.
   - `getBusinessAuditsAction(businessId)`: Retrieves historic audits for a business.
   - `getAuditDetailAction(auditId)`: Retrieves a specific audit record, verifying session credentials and business ownership.
2. **AI Prompts & Zod Schema:** Implement a strict, comprehensive system prompt that instructs the AI model to act as a world-class social conversion consultant tailored for the Algerian market. Defines a clean validation schema matching the database table structures:
   - Overall Score (0 to 100).
   - Bio Rewrite (highlighting copywriting hooks in dialect Darija/Arabic/French).
   - Strengths, Weaknesses, and Urgent Fixes (structured arrays).
   - Detailed review summaries (Trust, Conversion, Content Mix, Language alignment).
   - Dynamic marketing pillars and a proposal for a Pinned Post.
3. **Workspace View Integration (`?tab=audits`):**
   - Refactor `?tab=audits` inside `/businesses/[id]` to query and list past audits.
   - Renders a table of past score benchmarks with timestamps.
   - Replaces the disabled button "Run Page Audit" with an active, loading-spinner state that executes `generatePageAuditAction` asynchronously.
4. **Dedicated Audit Route:** Create a new page route at `/businesses/[id]/audits/[auditId]` to display a stunning, client-ready report.
5. **Interactive UI Components:**
   - `<AuditReport />` - Renders the client-friendly layout including:
     - Animated score meter (circular progress).
     - Side-by-side **Bio Rewrite** card (Old vs. New) with simple copy tools.
     - Accordions or tabs for Trust Review, Content Mix, and Next Steps.
     - Copy/Export Markdown tool generating a clean client-ready document.

---

## Out of Scope (Phase 5)
- **AI Weekly Content Plan Generation:** Generating 7-day calendars, hook grids, and visual ideas. This will be developed in Phase 6, utilizing the audit results created here.

---

## Target Routes
- `/businesses/[id]?tab=audits` - Workspace listing historic score benchmarks and initiating new generations.
- `/businesses/[id]/audits/[auditId]` - Full-screen, premium conversion audit report page with print/copy integrations.

---

## Implementation Chunks

### Chunk 1: Database Actions & OpenRouter Integration
- Create `src/lib/actions/audits.ts`:
  - Fetch active business details, active product catalogs, and the latest page inputs.
  - Formulate the system prompt specifying Algerian-specific commercial dynamics (Yalidine shipping, cash on delivery, Darija captions).
  - Use `generateText` with explicit JSON formats to call the OpenRouter endpoint.
  - Parse output using a typed schema, store the results in `page_audits` table, and return the record ID.

### Chunk 2: Create Audit Report Viewer Page
- Create `src/app/businesses/[id]/audits/[auditId]/page.tsx`:
  - Dynamic Server Component verifying user authentication and associated record ownership.
  - Renders the custom client-ready `<AuditReport />` component.

### Chunk 3: Create Premium UI Component `<AuditReport />`
- Create `src/components/businesses/audit-report.tsx`:
  - **Animated Circle Score:** Visual gauge representing the overall conversion score.
  - **Triage Cards:** Harmonious oklch panels for Strengths (green), Weaknesses (yellow), and Urgent Fixes (destructive red).
  - **Bio Rewrite Box:** Custom comparison module allowing users to copy the optimized Darija/French bio.
  - **Strategy Sections:** Tabs/accordions detailing conversion loopholes, language recommendations, and recommended content pillars.
  - **Markdown Exporter:** Generates a structured client-ready text draft with a single click.

### Chunk 4: Integrate Business Detail Audits Tab
- Modify `/businesses/[id]` (`src/app/businesses/[id]/page.tsx`):
  - Fetch and pass down the array of past generated audits.
  - Render an elegant listing of past audits (showing score badge, date, and "View Details" navigation link).
  - Connect the "Run Page Audit" trigger to a client action executing `generatePageAuditAction`, utilizing dynamic loading states and success overlays.

---

## Verification Plan

### Automated Checks
Ensure Next.js compilation compiles without warnings:
```bash
pnpm check
pnpm build:ci
```

### Manual Validation
1. **Trigger Generation:** Navigate to the business details page, configure the page inputs, go to `AI Audits` and click "Run Page Audit". Verify a beautiful loading screen appears (explaining that the AI model is analyzing their feed).
2. **Review Output:** Check that once complete, the user is redirected to `/businesses/[id]/audits/[auditId]` showing a beautifully styled report.
3. **Verify Localized Dialect:** Confirm the `bioRewrite` provides an authentic Algerian dialect hook (e.g. including Darija phrases, appropriate emojis, Yalidine delivery references).
4. **Copy & Export:** Click "Copy bio", paste it to ensure clipboard capture. Click "Export Markdown" and confirm a clean, readable, client-ready markdown draft is generated.
5. **Benchmark History:** Return to `/businesses/[id]?tab=audits` and verify the newly generated audit now appears in the benchmark list with the correct score and timestamp.
