# Playwright + MCP Learning

A Playwright Test framework in TypeScript for the [SauceDemo](https://www.saucedemo.com) e-commerce demo app. It was built to learn **AI-assisted testing with the Playwright MCP server**: an AI explores the app, helps design tests and generates code, and a human reviews every result.

![CI](https://github.com/dkumarbgh/Playwright-MCP-Learning/actions/workflows/playwright.yml/badge.svg)

## What's covered

- **Page Object Model.** Each screen has one class (`LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`, `ProductDetailsPage`).
- **Custom fixtures.** Tests get their page objects and API clients injected through `fixtures/testFixtures.ts`.
- **UI tests.** Login (positive and negative), cart and the full checkout flow.
- **Data-driven tests.** One table generates one test per row, each with its own scenario ID in the report.
- **Business-rule assertions.** Tax is checked as a rule (`total = itemTotal + tax`, `tax = 8%`), not only as fixed numbers.
- **Known-defect regression tests.** `test.fail()` keeps documented bugs visible without breaking the build.
- **API tests** against `jsonplaceholder.typicode.com` (GET and POST, through an `UserApi` client).
- **Cross-browser CI.** Every push runs Chromium, Firefox and WebKit in GitHub Actions.

## Project structure

```
api/                 API client classes (UserApi)
fixtures/            Custom Playwright fixtures (page objects + API clients)
pages/               Page Object classes
tests/               Spec files
.github/workflows/   GitHub Actions CI pipeline
playwright.config.ts Browsers, reporter, baseURL, screenshots/video on failure
.env.example         Environment variable template
```

## Getting started

```bash
npm ci
npx playwright install
cp .env.example .env        # Windows: copy .env.example .env
```

| Command | What it does |
|---|---|
| `npx playwright test` | Run everything on all 3 browsers |
| `npx playwright test --project=chromium` | Run on Chromium only (quickest) |
| `npx playwright test checkout.spec.ts` | Run a single spec |
| `npx playwright test --headed` | Watch the browser while tests run |
| `npx playwright show-report` | Open the HTML report |

`BASE_URL` comes from `.env` and falls back to `https://www.saucedemo.com`, so CI runs without a `.env` file.

## Test suites

| Spec | Tests | Covers |
|---|---|---|
| `checkout.spec.ts` | 9 | CHK-001 to CHK-008: end-to-end purchase, cart badge, cart contents, field validation (data-driven), validation precedence, tax rule for two item mixes |
| `problem-user.spec.ts` | 6 | PU-001 to PU-004: known `problem_user` defects, marked `test.fail()` |
| `login-pom.spec.ts`, `login-negative.spec.ts`, `login.spec.ts` | 4 | Successful login, invalid credentials, locked-out user |
| `api.spec.ts`, `user-api.spec.ts`, `add-user-api.spec.ts` | 3 | REST API GET/POST, directly and through the fixture-based API client |
| `assertions.spec.ts`, `locators.spec.ts`, `example.spec.ts`, `google.spec.ts` | 5 | First learning exercises: locators and web-first assertions |

27 tests per browser, 81 per CI run.

## AI-assisted testing workflow (Playwright MCP)

The [Playwright MCP server](https://github.com/microsoft/playwright-mcp) lets an AI assistant (here, GitHub Copilot in VS Code) drive a real browser through accessibility snapshots. Each feature went through this loop:

1. **Explore.** The AI maps pages, flows and validations, and labels every finding as *Observed* or *Needs verification*.
2. **Design.** Scenarios are written with named techniques (equivalence partitioning, boundary values, state transitions, error precedence), and a human sets the priorities.
3. **Generate.** The AI writes tests under explicit rules: existing fixtures and page objects, `data-test`/role locators, web-first assertions, no `waitForTimeout`, no JavaScript evaluation.
4. **Review.** Every generated test is reviewed like a pull request: could it pass while the feature is broken?
5. **Refactor.** Review comments go back to the AI, then the **full** suite is re-run.

### MCP configuration

```json
"playwright": {
  "command": "npx",
  "args": ["@playwright/mcp@latest", "--browser", "chromium", "--isolated"]
}
```

- `--browser chromium` uses Playwright's bundled Chromium. Branded Chrome showed a **"Change your password" data-breach popup** after logging in with SauceDemo's public password. The popup is browser UI, so the AI can't see it in the snapshot, and it silently blocked clicks.
- `--isolated` starts every session with a fresh in-memory profile, with no saved passwords or state from earlier runs.

## Defects found (`problem_user`)

Found through MCP-assisted exploratory testing, comparing `problem_user` with `standard_user`. All of them reproduce on Chromium, Firefox and WebKit unless noted.

| ID | Defect | Severity | Regression test |
|---|---|---|---|
| PU-001 | Typing in Last Name overwrites First Name at checkout, so no order can be completed | Blocker | ✅ `test.fail()` |
| PU-004 | Add to cart does nothing for Bolt T-Shirt, Fleece Jacket and Red T-Shirt | Critical | ✅ `test.fail()` ×3 |
| PU-003 | Product name links open the *next* product's page (off-by-one `?id=`); Fleece Jacket goes to "ITEM NOT FOUND". On Chromium the click doesn't navigate at all. | Major | ✅ `test.fail()` |
| PU-002 | Sorting (Z–A, price low→high, price high→low) has no effect | Major | ✅ `test.fail()` |
| PU-005 | Every product image is the same placeholder picture | Minor/Major | Screenshot evidence only |
| GEN-001 | Checkout pages can be opened directly with an empty cart (all users) | Major | Not yet automated |

When a defect is fixed, its `test.fail()` test passes unexpectedly and goes red. That's the signal to remove the marker.

## Lessons learned

- **AI output needs evidence-based review.** One exploration summary reported a validation message as "Observed" that the run never triggered. It came from an earlier chat. Start each exploration in a fresh chat and check claims against the action log.
- **Rule out the tool before blaming the app.** A "Backpack can't be added to cart" finding was a false positive caused by the browser popup. It didn't reproduce in a clean session.
- **Snapshots are blind to visuals and browser UI.** Accessibility snapshots don't show image content or browser popups. Use screenshots for visual checks.
- **`count()` and `isVisible()` don't wait; `expect()` does.** Use `toHaveCount()` and `toBeVisible()` in assertions to avoid flaky timing.
- **Don't put the expected value inside the locator.** Locate the element by structure and assert its text, so a failure says "expected X, got Y", not "element not found".
- **`test.fail()` passes on *any* failure.** Pin the failure reason (for example, assert the URL before the content) and review expected failures from time to time.
- **AI scope creep is real.** Generated changes to shared page objects need a full-suite regression run, not just the new spec.

## Tech stack

Playwright Test · TypeScript · Node.js · dotenv · Playwright MCP · GitHub Copilot · GitHub Actions
