# Furniview Project TODOLIST (Technical Debt & Future Improvements)

This file tracks items that are not immediate blockers but should be addressed in the future. This includes refactoring, removal of mock data, addressing minor bugs, or implementing non-critical enhancements.

## General
- [ ] Review and address peer dependency warnings from `pnpm install` if they cause issues.
- [ ] Standardize component file naming convention (currently a mix of `kebab-case.tsx` for pages and `PascalCase.tsx` for components in PRD example, let's stick to `PascalCase.tsx` for component files and `kebab-case.tsx` for route files like `page.tsx`, `layout.tsx`). Documented in `cursor/rules/folder_structure_and_naming.mdc`.

## Authentication
- [ ] Enhance error handling for auth functions (display user-friendly messages).
- [ ] Implement password recovery/reset functionality.
- [ ] Consider adding OAuth providers (e.g., Google, GitHub) for login.

## Database & Backend
- [ ] Flesh out `data_model.mdc` with detailed Supabase schema including RLS policies as they are defined.

## Frontend
- [ ] Replace placeholder images (e.g., `placeholder.svg` on homepage) with actual assets or dynamic content.
- [ ] Implement more sophisticated loading states for async operations (beyond simple spinners if needed).

## Testing
- [ ] Set up more comprehensive automated tests (e.g., Playwright for E2E, Vitest/Jest for unit/integration) as per PRD CI guidelines. 