# Global Application Context

## Application
- Name: Sauce Demo
- Purpose: E-commerce demo shop for QA automation practice
- Base URL: https://www.saucedemo.com

## Tech Stack (Selector Hints for AI)
- Vanilla JS frontend — no SPA framework
- Static HTML pages — full page reload on navigation
- Form fields use `id` and `data-test` attributes
- Selector priority (AI must follow this order):
    1. page.getByRole()              ← prefer always
    2. page.getByLabel()             ← for labelled fields
    3. page.locator('[data-test]')   ← explicit test attrs
    4. page.locator('#id')           ← fallback only

## Authentication
- Session stored in localStorage (key: session_username)
- Successful login redirects to: /inventory.html
- Logout: burger menu (top-left) → click "Logout"

## Test Accounts
| Username                  | Password      | Use For                    |
|---------------------------|---------------|----------------------------|
| standard_user             | secret_sauce  | Happy path tests           |
| locked_out_user           | secret_sauce  | Locked account error tests |
| problem_user              | secret_sauce  | Broken UI edge cases       |
| performance_glitch_user   | secret_sauce  | Slow load / timeout tests  |

## Coding Conventions (AI must always follow these)
- All Page Objects MUST extend BasePage (src/pages/base/BasePage.js)
- Constructor receives only: page (Playwright Page object)
- All selectors defined as class properties in constructor — never inline
- All methods must be async
- Methods return `this` for chaining where applicable
- No `expect()` inside Page Objects — assertions belong in test files only
- No `page.waitForTimeout()` — use `locator.waitFor()` only
- Maximum timeout: 10 000 ms
- Test files import from `tests/fixtures/base.fixture.js` — NOT from `@playwright/test` directly
- All tests wrapped in `test.describe()` with a name matching the feature
- Each test must be 100% independent — no shared state between tests

## Environments
- Default: https://www.saucedemo.com
- Configured via: process.env.BASE_URL in playwright.config.js

## Pages in Scope
- Login Page        → instructions/pages/login-page.md
- Inventory Page    → instructions/pages/inventory-page.md
- Cart Page         → instructions/pages/cart-page.md
- Checkout Page     → instructions/pages/checkout-page.md
