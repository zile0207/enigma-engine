# Enigma Engine

A monorepo for building component registries with Next.js, CLI tools, and shared packages.

## Structure

```
enigma-engine/
├── apps/
│   ├── web/                # Next.js 16 App (Dashboard & Docs)
│   └── cli/                # The Enigma CLI Wrapper
├── packages/
│   ├── database/           # Shared Supabase client & types
│   ├── registry-schema/    # Shared Zod schemas for shadcn JSON
│   └── ui/                 # Enigma's own UI components
├── turbo.json              # Monorepo build pipeline
└── package.json            # Root workspace config
```

## Getting Started

```bash
# Install dependencies
npm install

# Run all packages in dev mode
npm run dev

# Build all packages
npm run build

# Type check all packages
npm run typecheck

# Lint all packages
npm run lint

# Clean all build artifacts
npm run clean
```

## Packages

### `@enigma/cli`
Command-line interface for managing component registries.

### `@enigma/database`
Shared Supabase client and TypeScript types for database operations.

### `@enigma/registry-schema`
Zod schemas for validating component registry JSON structures.

### `@enigma/ui`
Shared UI components built with React and Tailwind CSS.

## Web App

The `apps/web` package is a Next.js 16 application with:
- Dashboard for browsing components
- Documentation site
- Tailwind CSS v4
