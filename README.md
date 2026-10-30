# ClaimPulse — Frontend

React + TypeScript (strict) + TanStack Query, built with Vite. Node 24 (see `.nvmrc`).

## Setup

```powershell
npm ci
copy .env.example .env.local   # set VITE_API_BASE_URL; never put secrets in VITE_ vars
```

## Commands

| Task                          | Command                                   |
| ----------------------------- | ----------------------------------------- |
| Dev server                    | `npm run dev`                             |
| Build                         | `npm run build`                           |
| Type check                    | `npm run typecheck`                       |
| Lint                          | `npm run lint`                            |
| Format / check                | `npm run format` / `npm run format:check` |
| Test                          | `npm test`                                |
| Test with coverage (80% gate) | `npm run test:coverage`                   |

## Layout

```
src/app/    app-wide setup (query client)
src/test/   test setup
```
