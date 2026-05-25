# PagePilot DZ - Phase 3 Implementation Plan

## Goal
Establish the **Business Profile** management workspace in **PagePilot DZ**. This phase enables authenticated users to create, list, view, edit, and delete user-owned business profiles. This forms the essential client data model foundation required for products list, AI audits, and weekly content plans in subsequent waves.

---

## Scope
1. **Drizzle CRUD Server Actions**: Create `src/lib/actions/businesses.ts` to implement secure database CRUD operations for the `businesses` table, validating user authentication and verifying record ownership.
2. **Global Header Integration**: Add `/businesses` to navigation links in the header component (`src/components/site-header.tsx`) for easy accessibility.
3. **Workspace Dashboard Update**: Refactor `/dashboard` to load dynamically, fetching active counts of businesses, audits, and content plans directly from the database, and updating the CTA.
4. **Pages & Routes Creation**:
   - `/businesses` - Lists all user-owned businesses with hover-scaling cards, or shows a premium empty state if none exist.
   - `/businesses/new` - Setup form page.
   - `/businesses/[id]` - Unified business dashboard detail page with tab placeholders (Overview, Products, AI Audits, Content Plans).
   - `/businesses/[id]/edit` - Edit profile page.
5. **Form Component (`<BusinessForm />`)**: Create a high-fidelity visual form featuring native Algerian wilaya selectors, commerce category dropdowns, primary language options, selling channels, and default CTA preferences.

---

## Open Decisions & Proposed Solutions

### 1. Algerian Wilaya Selection
- **Proposed Solution (Recommended)**: Provide a searchable selection containing all **58 Wilayas of Algeria** (e.g. `16 - Alger / الجزائر`), alongside a standard text field for the specific `city`. This provides a highly localized and premium user experience.

### 2. Commerce Channels & Order Methods Selection
- **Proposed Solution (Recommended)**: Render a grid of stylish, interactive pill-checkboxes (e.g., `Facebook`, `Instagram`, `WhatsApp`, `TikTok` for selling channels; and `WhatsApp DM`, `Messenger DM` for order methods), which are saved as structured comma-separated strings in the database.

### 3. Server Component Dashboard Refactoring
- **Proposed Solution (Recommended)**: Refactor the main `/dashboard/page.tsx` page into a server component using `requireAuth()`. This eliminates the client-side "Loading workspace..." flash and loads dynamic stats instantly on page load.

---

## Proposed Changes

### Component & Actions Layer

#### [NEW] [businesses.ts](file:///Users/macbookpro/Projects/page-pilot-dz-antygravity-02/src/lib/actions/businesses.ts)
Contains Server Actions executing Drizzle ORM operations, each validating user authentication and verifying ownership:
- `createBusinessAction(data)`: Validates user session via `requireAuth()`, inserts a new row into the `businesses` table, and returns the generated UUID.
- `updateBusinessAction(id, data)`: Validates ownership of the business profile (`eq(businesses.id, id)` and `eq(businesses.userId, userId)`) and updates the row.
- `deleteBusinessAction(id)`: Verifies ownership and deletes the business profile. Database cascades will automatically clear products, page inputs, audits, and content plans.
- `getBusinessesAction()`: Retrieves all business profiles owned by the logged-in user.
- `getBusinessDetailAction(id)`: Retrieves a specific business profile by ID, ensuring it belongs to the authenticated user.
- `getDashboardStatsAction()`: Aggregates total business profiles, audits, and content plans owned by the user.

---

### Navigation & Header

#### [MODIFY] [site-header.tsx](file:///Users/macbookpro/Projects/page-pilot-dz-antygravity-02/src/components/site-header.tsx)
- Integrate a new `Businesses` link in the site navigation bar for both desktop and mobile header views.

---

### Page Routes

#### [MODIFY] [page.tsx](file:///Users/macbookpro/Projects/page-pilot-dz-antygravity-02/src/app/dashboard/page.tsx)
- Refactor the dashboard to be a Server Component utilizing `requireAuth()`.
- Dynamically query active counts of businesses, audits, and content plans using our Neon DB helper.
- Render the correct counts inside the dashboard cards rather than static zeroes.
- Link the dashboard CTA directly to `/businesses/new` to prompt profile setup.

#### [NEW] [page.tsx](file:///Users/macbookpro/Projects/page-pilot-dz-antygravity-02/src/app/businesses/page.tsx)
- Server Component that calls `getBusinessesAction()`.
- Lists all created businesses using modern, premium visual cards with hover scaling.
- Renders an elegant empty state if no profiles exist.

#### [NEW] [page.tsx](file:///Users/macbookpro/Projects/page-pilot-dz-antygravity-02/src/app/businesses/new/page.tsx)
- Server Component providing the workspace layout to create a new profile.
- Renders the custom client-ready `<BusinessForm />` component.

#### [NEW] [page.tsx](file:///Users/macbookpro/Projects/page-pilot-dz-antygravity-02/src/app/businesses/[id]/page.tsx)
- Dynamic Server Component `/businesses/[id]`.
- Fetches detailed business stats and displays a beautiful, highly polished workspace dashboard.
- Organizes the business ecosystem into clean tabs:
  - **Overview**: Detailed business profile breakdown (target audience, selling channels, default CTAs, weekly posting goals).
  - **Products & Services (Phase 4 placeholder)**: Quick overview showing "No products added yet" with an "Add Product" button.
  - **AI Audits (Phase 5 placeholder)**: Lists recent page audits or shows "No audits run yet" with a prompt to set up page inputs.
  - **Content Plans (Phase 6 placeholder)**: Lists weekly schedules.
- Features top actions: "Edit Profile" and "Delete Business" (with custom confirmation modal).

#### [NEW] [page.tsx](file:///Users/macbookpro/Projects/page-pilot-dz-antygravity-02/src/app/businesses/[id]/edit/page.tsx)
- Dynamic Server Component `/businesses/[id]/edit`.
- Fetches existing profile details and pre-fills the `<BusinessForm isEdit={true} />` component for modifications.

---

### UI Components

#### [NEW] [business-form.tsx](file:///Users/macbookpro/Projects/page-pilot-dz-antygravity-02/src/components/businesses/business-form.tsx)
- High-fidelity visual form component with interactive states.
- Follows the precise field requirements from `DESIGN.md`.
- Features dropdown selectors for:
  - **Categories**: Restaurant/Café, Clothing/Fashion, Clinic/Health, etc. Triggers a custom text field if `Other` is selected.
  - **Wilayas of Algeria**: Searchable selection containing the 58 wilayas.
  - **Primary Languages**: English, French, Arabic, Darija, Mixed, etc.
  - **Tone & Style**: Popular/local, Professional, Premium, Youthful, Educational, Professional-local.
- Stylish grids of selectable pill-checkboxes for:
  - **Selling Channels**: Facebook, Instagram, WhatsApp, TikTok, Website, Physical Store.
  - **Order Methods**: WhatsApp message, Messenger DM, Phone Call, Website order, Physical visit.

---

## Verification Plan

### Automated Checks
Ensure Next.js static page parameters, typescript definitions, and lint targets execute successfully:
```bash
pnpm check
pnpm build:ci
```

### Manual Validation
1. **Login & Setup**: Sign in to the app, verify that navigating to `/businesses` renders the premium empty state card.
2. **Create Profile**: Click "Add Business", fill in the form fields (checking the dynamic `customNiche` reveal when selecting category "Other"), select Wilayas and channels, and save. Verify instant redirect to the new Business Detail Page.
3. **Edit Profile**: Click "Edit Profile", alter the target values, save, and confirm that the updated values reflect immediately.
4. **Delete Profile**: Trigger "Delete Business", confirm the custom alert dialogue, and verify redirect back to `/businesses` with the listing successfully deleted.
5. **Dashboard Updates**: Return to `/dashboard` and verify that the stats counter correctly reflects the new business profiles created.
