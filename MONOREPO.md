# Finsinghts Monorepo

This is a monorepo containing both the backend and frontend applications for Finsinghts.

## Structure

```
finsinghts/
├── apps/
│   ├── backend/      # NestJS backend application
│   └── frontend/     # React frontend application
├── packages/
│   └── shared/       # Shared types and utilities
├── package.json      # Root workspace configuration
└── pnpm-workspace.yaml
```

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Development

Run the backend in development mode:
```bash
pnpm dev:backend
```

Run the frontend in development mode:
```bash
pnpm dev:frontend
```

### Building

Build all packages:
```bash
pnpm build
```

Build individual packages:
```bash
pnpm build:backend
pnpm build:frontend
pnpm build:shared
```

### Working with Workspaces

Run commands in specific workspaces:
```bash
pnpm backend <command>     # Run command in backend
pnpm frontend <command>    # Run command in frontend
pnpm shared <command>      # Run command in shared package
```

Examples:
```bash
pnpm backend add express           # Add dependency to backend
pnpm frontend add react-router-dom # Add dependency to frontend
pnpm backend migration:create      # Run backend-specific script
```

### Shared Package

The `packages/shared` directory is for code shared between frontend and backend, such as:
- TypeScript types and interfaces
- Shared utilities
- Common constants

To use shared code in your apps, add it as a dependency:

In `apps/backend/package.json` or `apps/frontend/package.json`:
```json
{
  "dependencies": {
    "@finsinghts/shared": "workspace:*"
  }
}
```

Then import:
```typescript
import { YourType } from '@finsinghts/shared';
```

## Migration Notes

- Backend code moved from root `src/` to `apps/backend/src/`
- Frontend code moved from `frontend/` to `apps/frontend/`
- All dependencies are now managed through pnpm workspaces
- Root `package.json` contains only workspace configuration and common dev dependencies
