# Alkira Access Portal

A polished React authentication exercise demonstrating credential validation, a distinct multi-factor authentication step, protected routing, and role-based UI permissions.

## What the application demonstrates

- Login with email and password validation
- A separate six-digit MFA verification step
- A protected dashboard that requires both authentication stages
- Read-only and read/write user experiences
- A lightweight sign-up flow with realistic client-side validation
- Session-scoped authentication persistence
- Responsive layouts and accessible form semantics
- Automated tests for the highest-risk user paths

## Quick start

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm (included with Node.js)

### Install and run

For this working copy, dependencies are already installed. Start the app with:

```bash
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

For a fresh clone, install the locked dependency graph through Node's Corepack support, then start Vite:

```bash
corepack pnpm install
npm run dev
```

Using `corepack pnpm` means contributors do not need a globally installed `pnpm` command. The package-manager version is pinned in `package.json` and the exact dependency graph is stored in `pnpm-lock.yaml`.

### Quality checks

```bash
npm run lint
npm test
npm run build
```

Use `npm run test:watch` while developing.

## Demo credentials

| Experience | Email | Password | MFA code |
| --- | --- | --- | --- |
| Read-only | `viewer@alkira.test` | `Viewer123!` | `123456` |
| Read/write | `editor@alkira.test` | `Editor123!` | `123456` |

The login screen also provides demo-account buttons that populate the corresponding credentials. This convenience is intentionally limited to the mock exercise.

## Suggested demo walkthrough

1. Submit an empty login form to show field-level validation.
2. Try a valid email with an incorrect password to show the generic credentials error.
3. Select the **Read-only account**, continue, and enter an incorrect MFA code.
4. Enter `123456` and show that the protected dashboard becomes available only after MFA succeeds.
5. Point out the read-only notice and disabled Edit controls.
6. Sign out, repeat the flow with the **Read/write account**, and rename a network resource.
7. Refresh the authenticated dashboard to demonstrate tab-scoped session persistence.
8. Close the browser tab or sign out to clear the mock session.

## Technical choices

### React + TypeScript + Vite

Vite keeps the take-home fast and configuration-light, while TypeScript makes authentication states, users, roles, and permissions explicit. A framework such as Next.js would be reasonable for a production product with server-side authentication, but its server and rendering features would add little value to this explicitly client-only mock.

### A small authentication state machine

Authentication is represented by three states:

```text
anonymous → mfa-required → authenticated
```

The password step stores a `pendingUser`; it does not populate the authenticated user or session. Only successful MFA transitions to `authenticated`. Keeping these states separate makes it much harder to accidentally grant protected access after the first factor alone.

This is implemented with React Context rather than Redux or another external state manager. The state is small, changes infrequently, and is consumed across routes, so Context is sufficient without the additional concepts and bundle cost of a global state library.

### React Router route guards

`ProtectedRoute` gates the dashboard, while `MfaRoute` prevents direct access to the verification screen without a successful password step. These wrappers keep navigation policy out of page components and make the route hierarchy easy to audit.

In production, client route guards improve UX but are not a security boundary. The backend must independently authenticate every request and authorize every protected operation.

### React Hook Form + Zod

Zod schemas are the single source of truth for field constraints and messages. React Hook Form integrates those schemas without rerendering the entire form on each keystroke. Hand-written validation could reduce dependencies for three small forms, but schemas scale better, are independently testable, and avoid validation rules drifting between screens.

### Explicit permissions rather than role checks in components

The dashboard asks `hasPermission(role, 'resource:edit')` instead of scattering checks such as `role === 'read-write'`. A permission layer is slightly more code today, but it scales cleanly if more roles or capabilities are introduced.

For read-only users, Edit buttons are disabled rather than removed. This makes the access-control difference visible during the assessment and explains why the action is unavailable. The event handler also checks the permission, so the restriction does not depend only on presentation.

### `sessionStorage` rather than `localStorage`

The authenticated mock user survives a refresh but is cleared when the tab closes. That is a better default for an access portal than indefinite local persistence. A production implementation would normally use a secure, `HttpOnly`, `SameSite` cookie issued by the server, not browser-readable user data.

### Custom CSS and small inline icons

The UI uses custom responsive CSS and a small local SVG icon set. A component library could accelerate implementation, but custom styling demonstrates layout and interaction work, avoids imposing a library's visual identity, and keeps the interface tailored to the exercise. No external fonts or image services are required at runtime.

## Project structure

```text
src/
├── auth/          # Auth state, mock service, domain types, permissions
├── components/    # Reusable brand, form, input, and icon components
├── layouts/       # Shared authentication layout
├── pages/         # Login, MFA, sign-up, and dashboard screens
├── routes/        # Public, MFA-only, and protected route guards
├── styles/        # Responsive application styling
├── test/          # Shared test setup
├── validation/    # Zod form schemas
├── App.test.tsx   # Critical-flow integration tests
└── App.tsx        # Route composition
```

## Testing approach

The test suite uses Vitest, React Testing Library, and `user-event`. It tests behavior through the interface rather than component internals:

- Required-field validation
- Redirect away from a protected route while unauthenticated
- Rejection of an incorrect MFA code
- Successful login and MFA for a read/write user
- Enabled editing for read/write users
- Disabled editing for read-only users

These integration-style cases give more confidence than isolated snapshots because they cross form validation, context state, service behavior, navigation, and permission rendering. With a real backend, I would add API contract tests and end-to-end tests covering cookie/session behavior.

## Accessibility and UX details

- Every input has a programmatically associated label.
- Validation errors use `role="alert"` and `aria-describedby`.
- Loading states prevent duplicate submissions.
- Authentication errors do not reveal whether a particular email exists.
- Keyboard focus has a visible indicator.
- Color is not the only status signal; text and icons accompany it.
- Motion is minimized when `prefers-reduced-motion` is enabled.
- The dashboard table scrolls within its container on narrow screens.
- Password visibility controls have accessible names and pressed state.

## Assumptions

- The assessment explicitly permits mock authentication and does not require a backend.
- Both demo users share one mock MFA code to keep the evaluator's walkthrough simple.
- The sign-up requirement is satisfied by a separate validated request flow and confirmation state; account creation is not persisted.
- Editing a network resource is an in-memory demonstration of authorization and resets on reload.
- “Remember email” and password recovery are shown as familiar UI affordances but are intentionally not implemented as product features.

## Known limitations and production changes

This application intentionally simulates authentication. In a production system I would:

- Move password verification, MFA issuance/verification, and authorization to a backend or identity provider.
- Never ship credentials, passwords, or a fixed OTP in client code.
- Store only an opaque session identifier in a secure `HttpOnly` cookie.
- Add OTP expiry, attempt limits, replay protection, resend throttling, and recovery flows.
- Enforce permissions on every server operation, irrespective of the visible UI.
- Add server-backed audit events for login, MFA, logout, and resource changes.
- Use a focus-trapped dialog primitive and restore focus when the editor closes.
- Add broader end-to-end, accessibility, and cross-browser coverage.

## AI usage

AI assistance was used during implementation for scaffolding, code generation, design iteration, and review. The submitted architecture and trade-offs were reviewed deliberately, and the application was verified with linting, automated tests, a production build, and manual responsive browser testing.

AI-generated code should be treated like any other contribution: it still requires understanding, review, and ownership. The sections above document the reasoning behind the major choices so those decisions can be evaluated independently of how the first draft was produced.
