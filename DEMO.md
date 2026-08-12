# Demo and Interview Rehearsal

Use this as a rehearsal outline, not a script to read verbatim. The strongest presentation sounds conversational and responds to what the interviewer notices.

## Before the call

```bash
npm run lint
npm test
npm run build
npm run test:e2e
npm run dev
```

Keep two credential rows available:

| Role | Email | Password | MFA |
| --- | --- | --- | --- |
| Read-only | `viewer@alkira.test` | `Viewer123!` | `123456` |
| Read/write | `editor@alkira.test` | `Editor123!` | `123456` |

Start with a fresh tab so `sessionStorage` does not skip the login flow. Keep the terminal available to show the quality checks if asked.

## Five-minute walkthrough

### 0:00–0:40 — Frame the solution

> I treated authentication as three explicit states: anonymous, MFA required, and authenticated. The protected screen is available only after both factors succeed. The backend is intentionally mocked because the exercise permits it, but I kept that mock behind a service boundary.

Show the login screen and briefly mention the two demo-role shortcuts.

### 0:40–1:20 — Validation and authentication failure

1. Submit the empty login form.
2. Point out field-specific messages and accessible error associations.
3. Optionally enter an incorrect password.

> Credential errors are deliberately generic so the UI does not reveal whether a given account exists.

### 1:20–2:00 — MFA boundary

1. Choose the read-only account.
2. Enter an incorrect six-digit code once.
3. Enter `123456`.

> A successful password does not create an authenticated session. It creates a pending user, and only successful MFA promotes that user into the authenticated state.

### 2:00–2:45 — Read-only authorization

1. Show the role badge and read-only explanation.
2. Show the disabled Edit controls.
3. Mention the defensive permission check in the event handler.

> I check a named permission rather than comparing role strings throughout the UI. That gives us one place to evolve the role-to-capability mapping.

### 2:45–3:45 — Read/write experience

1. Sign out and use the read/write account.
2. Complete MFA and open an Edit dialog.
3. Rename a resource and save it.
4. Point out the success feedback.

If appropriate, demonstrate Escape closing the dialog and focus returning to Edit.

> The role changes capability, not just labeling. The dialog traps focus, supports Escape, and restores focus to the control that opened it.

### 3:45–4:30 — Testing and delivery quality

Show the test names or CI workflow rather than reading source code line by line.

> Component integration tests cover validation, route protection, invalid MFA, and both permission states. One Playwright test covers the critical browser path and runs Axe on the authenticated dashboard. CI executes lint, component tests, build, and browser testing from a clean install.

### 4:30–5:00 — Boundaries and production changes

> Client route guards are a UX control, not a production security boundary. With a real backend, credentials and MFA would be verified server-side, the session would use a secure HttpOnly cookie, and every edit operation would be authorized again by the API.

Finish by asking whether they would like to explore a particular implementation decision.

## High-probability questions

### Why Context instead of Redux?

The state is small, low-frequency, and app-wide. Context keeps the dependency and conceptual cost proportional to the problem. Redux becomes attractive if authentication grows into a larger client state model with complex transitions, caching, or cross-feature coordination.

### Why not Next.js or a backend?

The brief explicitly allows mock authentication. Vite lets the submission focus on the evaluated UI, state, and authorization behavior. In production, a server or identity provider would be essential; adding a pretend backend here would increase setup and code without making the mock secure.

### Why `sessionStorage`?

It preserves the demo session through refresh but clears it when the tab closes. It is a deliberate mock convenience, not a recommendation for storing production authentication data.

### Why disable read-only actions instead of hiding them?

Disabled controls make the role difference discoverable and easy to evaluate. The explanatory notice and tooltip clarify why the action is unavailable. In a context where the action itself is sensitive, hiding it could be preferable.

### Why both component and Playwright tests?

Component tests give fast, focused feedback across more edge cases. Playwright verifies that routing, focus, CSS, browser behavior, and the full integration work together. Axe adds automated accessibility coverage, although manual keyboard and screen-reader review would still be necessary for production.

### What would you do next?

Prioritize real identity-provider integration, server-enforced permissions, MFA expiry and attempt limiting, audit logs, focus/screen-reader testing, and additional failure-path browser tests. The order would depend on the product's threat model and supported browsers.

## Honest AI-usage answer

> I used AI heavily for scaffolding and implementation drafts. I treated that output as untrusted code: I reviewed the architecture, kept the scope deliberate, ran static checks and tests, exercised the UI in a browser, and fixed issues the automated Axe scan surfaced. I can explain the state transitions, permission model, test boundaries, and production limitations because I made and verified those final decisions.

Be prepared to open any file the interviewer chooses. In particular, understand the path through `LoginPage`, `AuthContext`, `MfaRoute`, `ProtectedRoute`, `permissions`, and `DashboardPage`.

## If the demo misbehaves

- Refresh and select the demo account again.
- If the dashboard appears immediately, sign out or open a fresh tab to clear the session.
- If port 5173 is busy, use the alternate URL Vite prints.
- Keep the passing terminal output available as evidence, but do not substitute it for demonstrating the product.
