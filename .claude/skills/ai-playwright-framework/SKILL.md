---
name: ai-playwright-framework
description: >
  Use this skill whenever working inside the ai-playwright-framework project. Triggers include:
  generating or regenerating Page Object Models (POMs), creating or updating Playwright test specs,
  running the test suite against saucedemo.com, analyzing test failures, creating Jira bug reports
  from failures, adding a new page or feature instruction file, or understanding the project workflow.
  This skill encodes all conventions, file structure rules, coding standards, and generation patterns
  for this specific project — always use it when the user mentions tests, page objects, instructions,
  fixtures, or automation in the context of this framework.
---

# AI Playwright Framework — Skill

An AI-driven E2E QA automation framework. Engineers write plain-English `.md` instruction files.
Claude reads them and generates all Page Objects and test specs. Failures are auto-analyzed and
filed as Jira bugs.

**Test site:** https://www.saucedemo.com  
**Stack:** Playwright · JavaScript (ESM) · Claude API

---

## Project Layout

```
ai-playwright-framework/
├── .context/
│   ├── global/global-context.md         ← App info, selector rules, coding conventions
│   ├── instructions/
│   │   ├── pages/                        ← One .md per UI page (elements, selectors, actions)
│   │   └── features/                     ← One .md per test flow (scenarios, test data)
│   └── prompts/                          ← System prompts guiding generation quality
│       ├── pom-generator.md
│       ├── test-generator.md
│       └── failure-analyzer.md
├── src/pages/                            ← AI-generated Page Objects (do NOT edit manually)
│   ├── base/BasePage.js
│   ├── InventoryPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
├── tests/                                ← AI-generated test specs (do NOT edit manually)
│   ├── fixtures/
│   │   ├── base.fixture.js               ← Unauthenticated tests
│   │   └── auth.fixture.js               ← Pre-logged-in as standard_user
│   ├── login/login.spec.js
│   ├── checkout/checkout.spec.js
│   └── price-sorting-checkout/price-sorting-checkout.spec.js
├── test-data/users.json                  ← Test credentials (never hardcode in specs)
├── scripts/analyze-and-report.js         ← Failure analyzer + Jira bug creator
├── playwright.config.js                  ← Playwright config (Chromium, Firefox, WebKit)
├── .env                                  ← ANTHROPIC_API_KEY, JIRA creds (gitignored)
└── package.json
```

---

## Core Conventions (ALWAYS follow these)

### Page Object Model Rules
- Every POM class **must extend `BasePage`** (`src/pages/base/BasePage.js`)
- Constructor receives only: `page` (Playwright Page object)
- All selectors defined as `this.elementName = page.locator(...)` in constructor — **never inline inside methods**
- All public methods must be `async`
- **Action methods** (click, fill, navigate) return `this` for chaining
- **Getter methods** (getErrorMessage, getItemCount) return the value, not `this`
- `No expect()` inside Page Objects — assertions belong only in test files
- No `page.waitForTimeout()` — use `locator.waitFor()` only
- Max timeout: 10,000 ms
- Include JSDoc comment above every public method

### Selector Priority (follow this order strictly)
1. `page.getByRole('...', { name: /regex/i })` — always try first
2. `page.getByLabel('...')` — for form fields with visible labels
3. `page.locator('[data-test="..."]')` — use `data-test` attributes (most common on saucedemo)
4. `page.locator('#id')` — last resort only

### Test Spec Rules
- Always import from `tests/fixtures/base.fixture.js` or `tests/fixtures/auth.fixture.js` — **never** from `@playwright/test` directly
- Use `base.fixture.js` for unauthenticated tests (login flow)
- Use `auth.fixture.js` for authenticated tests (inventory, cart, checkout)
- Load test credentials from `test-data/users.json` — never hardcode
- All tests wrapped in `test.describe()` with a name matching the feature
- Each test must be 100% independent — no shared state between tests
- No `test.only` or `test.skip` in generated output

---

## NPM Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests headless (Chromium + Firefox + WebKit) |
| `npm run test:headed` | Run with browser visible |
| `npm run test:ui` | Playwright interactive UI mode |
| `npm run generate` | Generate all POMs + test specs from instructions |
| `npm run gen:pom` | Generate Page Objects only |
| `npm run gen:tests` | Generate test specs only |
| `npm run analyze` | AI analysis of test failures |
| `npm run report:bugs` | Analyze last run + create Jira bug tickets |
| `npm run test:report-bugs` | Run tests + auto-create Jira bugs on failure |
| `npm run report` | Open Playwright HTML report |
| `npm run allure:serve` | Generate + open Allure report |

---

## How to Generate a Page Object

When creating or regenerating a POM:

1. Read `.context/global/global-context.md`
2. Read the relevant `.context/instructions/pages/<page-name>.md`
3. Follow the system prompt at `.context/prompts/pom-generator.md`
4. Output file: `src/pages/<PageName>.js`
5. First line must be: `import { BasePage } from './base/BasePage.js';`
6. Named export: `export class PageName extends BasePage { ... }`
7. File must end with a blank line

**Example structure:**
```js
import { BasePage } from './base/BasePage.js';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton   = page.locator('[data-test="login-button"]');
    this.errorMessage  = page.locator('[data-test="error"]');
  }

  /** Fill username field */
  async fillUsername(value) {
    await this.usernameInput.fill(value);
    return this;
  }

  /** Click the login button */
  async clickLogin() {
    await this.loginButton.click();
    return this;
  }

  /** Get the error message text */
  async getErrorText() {
    return this.errorMessage.textContent();
  }
}
```

---

## How to Generate a Test Spec

When creating or regenerating a test spec:

1. Read `.context/global/global-context.md`
2. Read the relevant `.context/instructions/features/<feature-name>.md`
3. Read the relevant generated POM files from `src/pages/`
4. Follow the system prompt at `.context/prompts/test-generator.md`
5. Output file: `tests/<feature-name>/<feature-name>.spec.js`

**File must start with:**
```js
import { test, expect } from '../fixtures/base.fixture.js'; // or auth.fixture.js
import users from '../../test-data/users.json' assert { type: 'json' };
// Import relevant Page Object classes
```

**Structure:**
```js
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('N — Descriptive test name', async ({ page }) => {
    // Use Page Object methods only — never call page.locator() directly in tests
    // All assertions use await expect(...)
  });
});
```

---

## How to Add a New Test Case

1. **Create page instruction:** `.context/instructions/pages/my-page.md`
   - Describe: page URL, all visible elements, their selectors/roles, and possible actions

2. **Create feature instruction:** `.context/instructions/features/my-flow.md`
   - Describe: which fixture to use, scenarios (each becomes a `test()`), step-by-step actions, expected outcomes

3. **Tell Claude:** "generate" — Claude reads the `.md` files and generates:
   - `src/pages/MyPage.js` (Page Object)
   - `tests/my-flow/my-flow.spec.js` (Test spec)

4. **Run:** `npm test`

---

## How to Fix a Failing Test

1. Run `npm run report:bugs` — creates Jira ticket automatically with error + root cause + suggested fix
2. **If selector changed:** update the relevant `.context/instructions/pages/*.md` → regenerate POM
3. **If test logic changed:** update `.context/instructions/features/*.md` → regenerate spec
4. **Never edit generated files directly** — always update instructions and regenerate

---

## Test Accounts (saucedemo.com)

| Username | Password | Use For |
|----------|----------|---------|
| `standard_user` | `secret_sauce` | Happy path tests |
| `locked_out_user` | `secret_sauce` | Locked account error tests |
| `problem_user` | `secret_sauce` | Broken UI edge cases |
| `performance_glitch_user` | `secret_sauce` | Slow load / timeout tests |

Credentials are stored in `test-data/users.json`.

---

## Existing Page Objects

### BasePage (`src/pages/base/BasePage.js`)
- `navigate(path)` — goto relative path
- `waitForLoad()` — wait for networkidle
- `getTitle()` — returns page title
- `getURL()` — returns current URL
- `reload()` — reloads page

### InventoryPage (`src/pages/InventoryPage.js`)
- `addFirstProductToCart()` — clicks first Add to Cart button
- `addSecondProductToCart()` — clicks second Add to Cart button
- `goToCart()` — clicks cart icon
- `sortBy(label)` — selects sort dropdown option by visible label
- `getCartBadgeCount()` — returns cart badge text
- Key locators: `this.cartBadge`, `this.sortDropdown`, `this.addToCartBtns`

### CartPage (`src/pages/CartPage.js`)
- `clickCheckout()` — clicks Checkout button
- `clickContinueShopping()` — clicks Continue Shopping button
- `getItemCount()` — returns number of cart items

### CheckoutPage (`src/pages/CheckoutPage.js`)
- `fillCustomerInfo(firstName, lastName, zipCode)` — fills step-one form
- `clickContinue()` — continues to step two
- `clickFinish()` — completes the order
- `clickBackHome()` — returns to products
- Key locators: `this.confirmHeader`, `this.errorMsg`

---

## Existing Test Specs

### `tests/login/login.spec.js`
Uses `base.fixture.js`. 6 tests covering:
- Happy path login (standard_user)
- Locked out user error
- Wrong password error
- Empty form → "Username is required"
- Missing password → "Password is required"
- Error dismissal (X button clears error)

### `tests/checkout/checkout.spec.js`
Uses `auth.fixture.js` (pre-logged-in). 1 test:
- Add 2 products → cart → checkout → fill info → finish → confirm order

### `tests/price-sorting-checkout/price-sorting-checkout.spec.js`
Uses `auth.fixture.js`. 1 test (Jira: TP-1):
- Sort by price low→high → add cheapest product → checkout → confirm order

---

## Failure Analysis

When tests fail, `scripts/analyze-and-report.js` reads `reports/last-run.json` and:
- Classifies root cause: `selector | timing | navigation | assertion`
- Assigns priority based on keywords:
  - **P1 Highest:** login, checkout, auth, order, payment
  - **P2 High:** cart, form, submit, navigation, redirect
  - **P3 Medium:** sort, filter, text, UI, badge
- Creates a Jira Task with: error summary, root cause, suggested fix, stack trace

---

## Environment Setup

Required in `.env`:
```
ANTHROPIC_API_KEY=sk-ant-...
BASE_URL=https://www.saucedemo.com
JIRA_BASE_URL=https://md-salekin-newaz.atlassian.net
JIRA_EMAIL=salekinnewaz0@gmail.com
JIRA_API_TOKEN=...
JIRA_PROJECT_KEY=TP
```

---

## Playwright Config Summary

- `testDir: './tests'`
- `fullyParallel: true`
- Reporters: HTML (`reports/playwright-report`), JSON (`reports/last-run.json`), Allure (`allure-results`), list
- `baseURL: process.env.BASE_URL || 'https://www.saucedemo.com'`
- `headless: true`, `screenshot: 'only-on-failure'`, `video: 'on-first-retry'`
- Projects: Chromium, Firefox, WebKit
