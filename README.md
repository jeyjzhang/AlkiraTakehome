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

The component tests cover validation, failed credentials, route protection, MFA, role permissions, session restoration, logout, and sign-up validation. The Playwright tests cover the main browser flow, keyboard behavior in the edit dialog, editing a resource, an Axe accessibility scan, and mobile viewport containment.

## Design decisions and trade-offs

**Three explicit auth states instead of a boolean.** The flow is `anonymous -> mfa-required ->
authenticated`. A correct password doesn't create a session, it creates a `pendingUser`. Only a
correct MFA code promotes that into `authenticated` and actually writes to storage. I did it this
way so a bug in the password step can't accidentally skip MFA. The two factors are separate
states, not just two steps that happen to run in order.

**React Context instead of Redux.** Auth state here is small, just a status and one user object,
and it doesn't change often. Redux would mean setting up actions, reducers, and a store to manage
something this simple. I'd switch to Redux if the state grew to include caching, multiple features
reading and writing to it, or frequent updates from different places. None of that applies here.

**Route guards instead of checks inside each page.** `/dashboard` requires a completed MFA flow
and `/verify` requires a successful password step, both enforced by small wrapper components
(`ProtectedRoute`, `MfaRoute`) rather than an `if` at the top of every page. It's easier to audit
three guards than to trust that every page remembered to check.

**Named permissions instead of checking roles directly.** The dashboard calls
`hasPermission(user.role, 'resource:edit')` instead of writing `role === 'read-write'` everywhere
it needs to know if editing is allowed. For two roles that's slightly more code than it needs to
be, but it means if a third role or a new capability shows up later, I change it in one place
instead of hunting down every button and handler. I also check the permission inside the event
handler, not just on the disabled attribute, so a future CSS or markup change can't accidentally
make an action clickable for a role that shouldn't have it.

**Disabled buttons instead of hiding them for read-only users.** I want the difference between the
two roles to actually be visible so it's easy to evaluate. If this were a case where even knowing
an action exists is sensitive, like a delete-organization button, I'd hide it instead. Here it
makes more sense to show it and explain why it's off.

**sessionStorage instead of localStorage.** It survives a refresh but clears when the tab closes,
which felt like the right default for a mock access portal instead of something that sticks around
indefinitely. Neither one is what a real product should do though. Production auth should keep
only an opaque session id in a secure, HttpOnly, SameSite cookie set by the server, not user data
sitting in something JavaScript can read.

**React Hook Form and Zod instead of writing my own form state.** For three forms I could have
gotten away with plain useState and manual checks. I used schemas instead so each form has one
place that defines its rules and its error messages, and that place can be tested on its own.
React Hook Form handles typing, submission, and loading state, and Zod just tells it what counts
as valid.

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

I used Codex and ClaudeCode as my primary implementation tools, and they generated essentially all of the submitted code. Workflow-wise, I prioritized establishing automated checks early and broke the work down into incremental parts rather than asking for the finished application in one pass. Clarifying requirements and deciding trade-offs was something I prioritized so I could follow the implementation, review it critically, and catch mistakes in the generated output or offer improvements.
