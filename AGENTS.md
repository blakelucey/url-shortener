# Repository Guidelines

## Project Structure & Module Organization
- Next.js client code sits in `src/`: `app/` routes + server actions, `components/` shared UI, `hooks/` utilities, `lib/` integrations (Mongo, Stripe, PostHog), `store/` Redux slices, and `logging/` wrappers around `logFn`.
- Static assets live in `public/`, the `markdown/` content fragments, and `faq.json`.
- Spring Boot microservices (`shortening-service/`, `redirection-service/`) power link creation and redirects; `docker-compose.yml` wires them with the client.
- Root `.env`, `.env.dev`, and `.env.prod` hold the variables consumed across the stack.

## Build, Test, and Development Commands
- `bun run dev` launches the client on http://localhost:3000.
- `bun run build` followed by `bun run start` validates a production build; run both before shipping.
- `bun run lint` enforces the Next.js ESLint rules—fix every warning before review.
- Service entry points: `cd shortening-service && mvn spring-boot:run` and `cd redirection-service && mvn spring-boot:run`; use `mvn package` when you need JARs.
- Spin up everything with `docker-compose up --build`; shut it down via `docker-compose down`.

## Coding Style & Naming Conventions
- Keep TypeScript lint-clean, defaulting to 2-space indentation unless surrounding code uses another width.
- React components use PascalCase, hooks and helpers use camelCase, App Router folders stay kebab-case.
- Tailwind utilities drive layout—group related classes and remove unused ones.
- Java modules follow Spring Boot defaults under `com.shorteningservice` and `com.redirectionservice`.
- Separate formatting-only commits from functional work.

## Testing Guidelines
- Add Jest + React Testing Library specs as `<name>.test.tsx` next to the component (include tooling updates when needed).
- Run `bun run lint` for every change set and describe manual QA in the PR if automation is missing.
- Java services should keep tests in `src/test/java`; execute `mvn test` before pushing.
- Use `node src/lib/testMongo.js` after changing Mongo credentials to ensure connectivity.

## Commit & Pull Request Guidelines
- Prefer conventional commits (`feat(auth): support wallet login`, `fix(ui): guard dashboard redirect`) and keep scopes tight.
- PRs must explain intent, list verification steps (`bun run lint`, `mvn test`, manual checks), and link issues.
- Share screenshots for UI changes and call out environment updates.
- Request reviews from service owners and keep secrets in local `.env*` files only.

## Environment & Security Notes
- Populate `.env*` with `NEXT_MONGODB_URI`, `NEXT_SECRET_STRIPE_API_KEY`, `NEXT_PUBLIC_FRONTEND_URL`, mail credentials, and other service keys before running.
- Only publish safe values through `NEXT_PUBLIC_*` and watch diffs for accidental secret leaks.
- Rotate keys referenced by `docker-compose.yml` whenever access changes.
