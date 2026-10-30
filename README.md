# ClaimPulse — Frontend

ClaimPulse is a mini claim and denial tracker for a healthcare billing team. It covers the core of what Knack RCM does, at a small scale.

## About the project

A billing user can:

- Add **patients** and insurance **payers**.
- Create **claims** and move each one through its lifecycle: **Submitted → Paid or Denied** (a denied claim can be **Resubmitted**).
- Record **why a claim was denied**.
- See a **dashboard** of where the money stands: billed vs collected and the denial rate.

Access is role-based (Admin and Biller). Only authorized billing staff can sign in, and anyone who is not signed in is sent to the login screen.

This repository is the web client. The API (FastAPI) and database (PostgreSQL) live in the separate backend repository.

### Tech stack

React, TypeScript (strict), TanStack Query, Zod, Mantine (date picker only), Vite, Vitest. Backend: FastAPI and PostgreSQL.

### Status

| Area                                         | State                                            |
| -------------------------------------------- | ------------------------------------------------ |
| Login screen (responsive) and auth gating    | Built, using demo accounts instead of a real API |
| Dashboard, claims, denials, patients, payers | Planned                                          |

The login currently checks hard-coded demo accounts in `src/api/auth.ts` (password `Demo@123`). It must be replaced with the backend auth endpoint before any real use.

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

Node 24 is required (see `.nvmrc`).

## Layout

```
src/app/     app-wide setup (query client, path routing)
src/auth/    session storage and auth context
src/api/     API clients
src/pages/   screens (Login, Dashboard, Claims, ...)
src/components/ui/  reusable themed controls (Button, TextField, SelectField, ...)
src/styles/ui.css   the single stylesheet for those controls, built on theme tokens
src/test/    test setup
```

Work items for this repo are tracked in `ClaimPulse-Frontend-Work-Items.json`.
