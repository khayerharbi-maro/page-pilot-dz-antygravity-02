# PagePilot DZ - Phase 2 Implementation Plan

## Goal
Establish the PostgreSQL database schema for **PagePilot DZ** using **Drizzle ORM** and execute migrations on the live Neon Database. This data model will support all the relational entities needed to drive businesses, products, page inputs, audits, content plans, content items, and AI generations.

---

## Scope
1. **Drizzle Schema Extension:** Declare the seven core tables (`businesses`, `productsServices`, `pageInputs`, `pageAudits`, `contentPlans`, `contentItems`, `aiGenerations`) in `src/lib/schema.ts` with explicit foreign key relationships and index optimizations.
2. **UUID Generation:** Ensure all newly defined tables utilize randomly generated `uuid` primary key identifiers.
3. **Migration Generation:** Run `pnpm db:generate` to produce the SQL migration files.
4. **Migration Deployment:** Run `pnpm db:migrate` to deploy the new tables on the Neon PostgreSQL instance.
5. **Code Checks:** Verify compiled codebase health.

---

## Out of Scope (Phase 2)
- **Frontend Form CRUD Integration:** No input forms or UI actions will submit database queries yet. That will be implemented in subsequent phases.
- **AI Backend API Integration:** Prompt normalizers and OpenRouter call handlers will not be hooked to tables in this wave.

---

## Implementation Chunks

### Chunk 1: Update Drizzle Schema
- Modify `src/lib/schema.ts` to declare:
  - Imports: `uuid`, `integer`, `jsonb` from `"drizzle-orm/pg-core"`.
  - Tables: `businesses`, `productsServices`, `pageInputs`, `pageAudits`, `contentPlans`, `contentItems`, `aiGenerations`.
  - Relationships: Foreign keys targeting parent records (`user`, `businesses`, `pageInputs`, `pageAudits`, `contentPlans`).
  - Indexing: Explicit indexes on foreign keys to optimize workspace load speeds.

### Chunk 2: Drizzle Migration Generation
- Propose and run the generate command:
  ```bash
  pnpm db:generate
  ```
  - Verify SQL file outputs in the `./drizzle` directory.

### Chunk 3: Drizzle Migration Execution
- Propose and run the migrate command:
  ```bash
  pnpm db:migrate
  ```
  - Verify table structures appear on the active Neon Database.

---

## Verification Commands
Ensure compile and lint targets pass cleanly:
```bash
pnpm check
pnpm build:ci
```

---

## Acceptance Criteria
1. Drizzle imports and table extensions in `src/lib/schema.ts` compile successfully.
2. Newly created tables use `uuid` columns for primary keys, defaulting to randomly generated values.
3. Drizzle kit generates SQL migration scripts cleanly in `./drizzle`.
4. Database migrations successfully deploy on the Neon database instance without errors.
5. Compile checks (`pnpm check`) and build checks (`pnpm build:ci`) execute successfully.
