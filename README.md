# Alkira Access Portal

This is a small React authentication demo built for the Alkira UI Developer take-home. It includes login validation, a mock email-code MFA step, a protected dashboard, and read-only and read/write user experiences.

## Technologies

- React and TypeScript
- Vite
- React Router
- React Hook Form and Zod
- Vitest and React Testing Library
- Playwright and Axe

## Run locally

Requirements: Node.js 20.19+ or 22.12+.

```bash
corepack pnpm install
npx playwright install chromium
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

## Demo accounts

| Role | Email | Password | MFA code |
| --- | --- | --- | --- |
| Read-only | `viewer@alkira.test` | `Viewer123!` | `123456` |
| Read/write | `editor@alkira.test` | `Editor123!` | `123456` |

The buttons on the login page can also fill either demo account.

## Test the flow

1. Try submitting an empty login form to see the validation errors.
2. Sign in with either demo account.
3. Enter an incorrect MFA code, then enter `123456`.
4. On the dashboard, compare the disabled edit controls for the read-only user with the working edit flow for the read/write user.
5. Refresh the dashboard to confirm that the session survives a refresh, then sign out.
6. From the login screen, open **Create an account** to see the separate sign-up screen and its validation (mismatched passwords, weak password, etc.). Submitting shows a confirmation state; it does not create a real account.

Run the automated checks with:

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

The component tests cover validation, failed credentials, route protection, MFA, role permissions, session restoration, logout, and sign-up validation. The Playwright test covers the main browser flow, keyboard behavior in the edit dialog, editing a resource, and an Axe accessibility scan.

## Implementation decisions

I represented authentication with three states:

```text
anonymous -> mfa-required -> authenticated
```

A correct password creates a pending user, but it does not create an authenticated session. The session is stored only after the MFA code is accepted. I kept this logic in React Context because the shared state is small and does not need a larger state-management library.

Route guards keep access rules outside the page components. `/dashboard` requires a completed MFA flow, while `/verify` requires a successful password step.

The dashboard checks a named permission (`resource:edit`) instead of checking role names throughout the component. I chose to disable edit buttons for the read-only account so the difference between the two roles is easy to see. The edit handler checks the permission as well.

I used Zod schemas with React Hook Form so each form has one place for validation rules and error messages. The tests focus mainly on behavior across forms, routing, authentication state, and permissions rather than component snapshots.

## Project structure

```text
src/
├── auth/        # Auth state machine, mock auth service, roles, permissions
├── routes/      # PublicRoute, MfaRoute, ProtectedRoute guards
├── pages/       # Login, sign-up, MFA, dashboard screens
├── layouts/     # Shared two-column auth layout
├── components/  # FormField, PasswordInput, Modal, brand/icon components
├── validation/  # Zod schemas for each form
└── styles/      # One CSS file for the whole app
e2e/             # Playwright critical-path + Axe accessibility test
```

Pages depend on `auth`, `validation`, and `components`; those layers do not depend back on pages. That keeps the authentication logic testable on its own, which is also why `permissions.ts` has its own unit tests separate from the integration tests in `App.test.tsx`.

## Assumptions and limitations

- Authentication, MFA delivery, account creation, and resource editing are mocked in the browser.
- The route guards and permission checks demonstrate frontend behavior; they are not a real security boundary. A production backend must authenticate requests and authorize every protected operation.
- Demo credentials and the fixed MFA code are visible in the client bundle and must never be handled this way in production.
- The stored session contains browser-readable user data. A production application should normally use an opaque server session in a secure `HttpOnly` cookie.
- The MFA code has no expiry, retry limit, resend throttling, or replay protection.
- Sign-up displays a confirmation but does not create an account.
- Resource changes are held in memory and reset on reload.
- “Remember email” and password recovery are visual demo affordances and are not implemented.
- Browser-level automated coverage currently runs in Chromium only.

## AI usage

I used AI assistance for parts of the initial scaffolding, UI implementation, tests, and documentation. I reviewed the resulting code and used linting, component tests, a production build, and a browser test to verify it. I can explain the submitted flow and the trade-offs above; this remains a frontend demonstration rather than a production authentication system.
