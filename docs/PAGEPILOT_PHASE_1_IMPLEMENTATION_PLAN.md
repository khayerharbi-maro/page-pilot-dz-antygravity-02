# PagePilot DZ - Phase 1 Implementation Plan

## Goal
Transform the generic Agentic Coding Starter Kit boilerplate into a clean, client-ready, high-fidelity UI shell and navigation structure for **PagePilot DZ**—an internal-first SaaS web app tailored for analyzing Facebook/Instagram pages of Algerian small businesses.

---

## Scope
1. **Core UI/UX Styling:** Configure branding, colors (OKLCH gradients), and fonts to match the custom tokens specified in `DESIGN.md`.
2. **Landing Page:** Replace the existing developer starter tutorials, setup checklists, and video embeds with a stunning, bilingual (French & Arabic/Darija accents) landing page highlighting the core value proposition of PagePilot DZ.
3. **Workspace Dashboard Shell:** Rewrite the `/dashboard` page to act as the primary workspace dashboard. Introduce high-fidelity empty states, navigation grids, and quick action pathways.
4. **App Header & Footer:** Modify navigation links to display **Dashboard** and **Library** when logged in. Hide `/chat` links. Customize footer copy for PagePilot DZ.
5. **Library Page Placeholder:** Create a `/library` shell to establish the workspace layout for saved historic reports and content grids.
6. **Code Cleanup:** Remove unused boilerplate components: `setup-checklist.tsx`, `starter-prompt-modal.tsx`, and `github-stars.tsx`.

---

## Out of Scope (Phase 1)
- **Database Tables & Drizzle Migrations:** No schema modifications, database changes, or queries will be run in this phase.
- **AI Integrations & OpenRouter Handlers:** No AI audit generator, prompt normalization, or post variation actions will be integrated yet.
- **CRUD Operations:** No true database writes/reads for businesses, products, or reports. All state is strictly UI shell, navigation, and mocked workspace views.

---

## Target Routes
- `/` - Public bilingual Algerian small business landing page.
- `/dashboard` - Protected workspace dashboard with business list skeleton and quick actions.
- `/library` - Protected historical archive shell.
- `/chat` - **Hidden but NOT deleted.** Accessible only via direct URL entry for development and utility.

---

## Implementation Chunks

### Chunk 1: Clean Unused Components & Update Navigation Layout
- Delete:
  - `src/components/setup-checklist.tsx`
  - `src/components/starter-prompt-modal.tsx`
  - `src/components/ui/github-stars.tsx`
- Modify `src/components/site-header.tsx`:
  - Change branding to "PagePilot DZ" with a Lucide `Compass` icon and gradient text.
  - Add conditional navigation links for authenticated users: *Dashboard* (`/dashboard`) and *Library* (`/library`).
  - Keep `/chat` completely hidden from the header links.
- Modify `src/components/site-footer.tsx`:
  - Remove developer star badges and Leon van Zyl references.
  - Standardize branding to PagePilot DZ.

### Chunk 2: Create PagePilot DZ Landing Page
- Modify `src/app/page.tsx`:
  - Establish a modern, premium Algerian SaaS aesthetic.
  - Implement dynamic marketing grids showcasing the three pillars: **Page Auditing**, **7-Day Planning**, and **Algerian Dialect Generation** (Arabic, Darija, French).
  - Add clear, high-conversion calls to action directing users to the Sign In / Dashboard flow.

### Chunk 3: Create Workspace Dashboard Shell
- Modify `src/app/dashboard/page.tsx`:
  - Build a high-fidelity workspace manager interface.
  - Display KPI cards for Active Businesses, Generated Audits, and Weekly Plans.
  - Design a premium, step-by-step empty-state workspace directing users to add their first business or analyze a page.

### Chunk 4: Create Library Placeholder Shell
- Create `src/app/library/page.tsx`:
  - Implement direct authentication protection (session checks).
  - Design a skeleton library layout for archiving historical audit scores and content campaigns.

---

## Verification Commands
Ensure there are no compile-time check failures, lint errors, or TypeScript defects:
```bash
pnpm lint
pnpm typecheck
pnpm build:ci
```

---

## Acceptance Criteria
1. Navigation is beautiful, client-ready, and aligns perfectly with `DESIGN.md`.
2. Header shows **PagePilot DZ** logo with `Compass` icon and links to `/dashboard` and `/library` when logged in.
3. `/chat` link is completely hidden from the user interface.
4. Home page displays a clean, bilingual marketing presentation rather than developer tutorials.
5. `/dashboard` displays a professional layout with KPI metrics and an interactive empty-state checklist.
6. `/library` compiles and requires authentication.
7. Unused starter-kit code files are removed without compiler errors.
8. `pnpm check` and `pnpm build:ci` commands pass successfully.
