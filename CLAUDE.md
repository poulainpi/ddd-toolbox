# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Domain-Driven Design (DDD) toolbox built with Nx monorepo architecture, using Astro with React integration for the frontend. The project leverages Astro's Islands Architecture for improved SEO and UX while maintaining interactive React components where needed.

## Architecture

**Monorepo Structure (Nx-based):**

- `apps/ddd-toolbox/` - Main Astro application with React integration
- `apps/ddd-toolbox-e2e/` - End-to-end tests using Playwright
- `libs/feature-domain-storytelling/` - Domain storytelling feature library
- `libs/ui/` - Shared UI components library (Radix UI + Tailwind CSS)
- `libs/util/` - Shared utility functions library

**Technology Stack:**

- **Frontend:** Astro 5.7+ with React 19+ integration
- **Styling:** Tailwind CSS 4.1+ with Tailwind CSS Animate
- **UI Components:** Radix UI primitives with shadcn/ui patterns
- **Build System:** Nx 21.4+ with Vite
- **Testing:** Vitest for unit tests, Playwright for e2e tests
- **Code Quality:** ESLint + Prettier with Husky pre-commit hooks

## Common Commands

**Development:**

```bash
# Start development server
npx nx dev ddd-toolbox

# Build the application
npx nx build ddd-toolbox

# Preview production build
npx nx preview ddd-toolbox
```

**Testing:**

```bash
# Run unit tests
npx nx test <project-name>

# Run e2e tests
npx nx e2e ddd-toolbox-e2e
```

**Code Quality:**

```bash
# Lint all projects
npx nx lint <project-name>

# Lint affected files only
npx nx affected:lint

# Type checking
npx nx typecheck <project-name>

# Format code
npx nx format:write
```

**Nx Commands:**

```bash
# View project dependencies
npx nx graph

# Run target across affected projects
npx nx affected:<target>

# Sync TypeScript project references
npx nx sync

# Check if sync is needed (for CI)
npx nx sync:check
```

## Development Guidelines

**Component Architecture:**

- Use Astro components for static content and layouts
- Use React components (`.tsx`) for interactive features
- React component file names should be in kebab-case (e.g., `my-component.tsx`)
- Leverage Astro's partial hydration for optimal performance
- Follow shadcn/ui patterns for consistent component design

**Styling Approach:**

- Tailwind CSS for utility-first styling
- Use `class-variance-authority` for component variants
- `clsx` and `tailwind-merge` for conditional classes
- Tailwind CSS 4.1+ with native CSS custom properties

**Library Dependencies:**

- UI components built with Radix UI primitives
- Form handling with `react-hook-form` + `zod` validation
- Icons from `lucide-react`
- Interactive drawing with `tldraw` for domain storytelling features

**Project Structure Patterns:**

- Each library follows Nx project conventions
- Use `@nx/enforce-module-boundaries` ESLint rule for proper dependency management
- Shared utilities in `libs/util/`
- Feature-specific code in dedicated `libs/feature-*` directories

## Package Management

Uses `pnpm` with workspace configuration. The root `package.json` includes a `postinstall` script that ensures the main app dependencies are installed.

## Git Workflow

Pre-commit hooks are configured with Husky to run:

- Linting with auto-fix on affected files
- Code formatting with Prettier on staged files

**Commit Convention:**

- Use conventional commit format for commit messages (e.g., `feat:`, `fix:`, `chore:`, `docs:`)

**Development Workflow:**

- After completing code changes, always run typecheck and lint commands to ensure no errors remain
