# PagePilot DZ - Phase 4 Implementation Plan

## Goal
Implement the **Products & Services Catalog CRUD** (integrated natively inside the business dashboard tabs) and a premium, guidance-rich **Manual Page Input** workspace page. This establishes the essential product details, prices, platform properties, and example organic feeds needed to run conversion audits and AI weekly content calendars in subsequent phases.

---

## Scope
1. **Products Server Actions:** Create `src/lib/actions/products.ts` containing Drizzle CRUD operations (`createProductAction`, `updateProductAction`, `deleteProductAction`, `toggleProductActiveAction`, `getProductServicesAction`), verifying session authentication and validating business ownership.
2. **Page Inputs Server Actions:** Create `src/lib/actions/page-inputs.ts` to manage manual social feed properties (`createPageInputAction`, `getLatestPageInputAction`).
3. **Workspace View Integration:**
   - Modify `/businesses/[id]` (`src/app/businesses/[id]/page.tsx`) to dynamically query products and page inputs from the database.
   - Refactor **`?tab=products`** to load the custom `<ProductCatalog />` component.
   - Refactor **`?tab=audits`** to conditionally render a page input summary or a premium empty state leading to configuration.
4. **Focused Page Input Route:** Create a new page route at `/businesses/[id]/page-inputs/new` to provide a dedicated, distraction-free setup layout.
5. **Interactive UI Components:**
   - `<ProductCatalog />` - Renders a sleek responsive catalog card grid with quick toggles for AI content planning.
   - `<ProductForm />` - Modern form used inside Dialog modals for single-page adding and editing.
   - `<PageInputForm />` - Premium two-column layout rendering platform selectors, URL/handle inputs, bio/post textareas, and an AI Optimization side guide offering copyable formatting templates.

---

## Out of Scope (Phase 4)
- **AI Audit Execution:** No live AI audit requests, OpenRouter pipeline execution, or JSON score generation.
- **AI Content Plan Calendar Generation:** No weekly schedule generation or caption writing.
- Both features will be unlocked once these assets are structured.

---

## Target Routes
- `/businesses/[id]?tab=products` - Integrated in-tab product/service catalog with Dialog CRUD modals.
- `/businesses/[id]?tab=audits` - Conditionally displays page configuration or redirects to setup.
- `/businesses/[id]/page-inputs/new` - Focused setup page for social media page parameters and post feeds.

---

## Implementation Chunks

### Chunk 1: Server Actions & Database Layer
- Create `src/lib/actions/products.ts`:
  - Secure CRUD operations checking authenticated user ownership over the associated business ID.
  - Quick action `toggleProductActiveAction` to switch the planning status.
- Create `src/lib/actions/page-inputs.ts`:
  - Actions to record social page configurations (`createPageInputAction`) and fetch the latest entries (`getLatestPageInputAction`).

### Chunk 2: Create Dialog-Driven Product UI Components
- Create `src/components/businesses/product-form.tsx`:
  - Multi-variant (create/edit) form component.
  - Validation fields: Name, Type (Product vs Service), Price (custom text pre-filled with DA tag), description, and active status.
- Create `src/components/businesses/product-catalog.tsx`:
  - Visual grid displaying cards with oklch semantic details.
  - Quick status switch triggering the toggle server action with sonner toast feedback.
  - Radix UI Dialog integrations mapping "Add Product", "Edit Product", and "Confirm Delete" options seamlessly.

### Chunk 3: Create Social Page Inputs Form & Dedicated Route
- Create `src/components/businesses/page-input-form.tsx`:
  - Sleek form capturing: Platform (Facebook, Instagram, Both), Page URL, @Handle, Bio, Raw Feed Posts, and Strategic Focus.
  - Side panel providing copy-paste guidelines (using `---` markers) and rich dialect examples to maximize AI prompt performance.
- Create `src/app/businesses/[id]/page-inputs/new/page.tsx`:
  - Route component validating session and loading the page input setup template.

### Chunk 4: Integrate Business Detail Page Tabs
- Modify `src/app/businesses/[id]/page.tsx`:
  - Dynamically load products and page inputs on the server.
  - Replace product tab placeholder with `<ProductCatalog />`.
  - Replace audit tab placeholder with dynamic conditional options.

---

## Verification Commands
Ensure lint parameters, typescript configurations, and CI build parameters compile successfully:
```bash
pnpm check
pnpm build:ci
```

---

## Acceptance Criteria
1. Product CRUD (Create, Edit, Delete) operates smoothly inside dialog drawers without page refreshes.
2. Direct planning active toggles function on the card list with persistent database updates.
3. Pricing fields accept flexible text inputs and default to Algerian Dinar formatting.
4. Dedicated page input route features structured forms and a supportive formatting guideline sidebar.
5. `/businesses/[id]?tab=audits` lists the active page parameters once saved.
6. TypeScript check (`pnpm check`) and build checks compile without any warning flags.
