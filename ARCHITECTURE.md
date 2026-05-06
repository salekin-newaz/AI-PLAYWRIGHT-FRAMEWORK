# Architecture — AI Playwright Framework

## Overview

An AI-powered E2E test automation framework built on Playwright + JavaScript.
Engineers write plain-English instruction files. Claude Code reads them and generates
all Page Objects and test specs. Test failures are automatically analysed and raised
as bug tickets in Jira — no manual coding required at any stage.

**Application under test:** https://www.saucedemo.com
**Jira project:** https://md-salekin-newaz.atlassian.net/jira/core/projects/TP/board

---

## Project Structure

```
ai-playwright-framework/
│
├── .ai/                                ← AI instruction layer (human-maintained)
│   ├── context/
│   │   └── global-context.md           App info, selector rules, coding conventions
│   ├── instructions/
│   │   ├── pages/                      One .md per page — elements, actions, behaviours
│   │   │   ├── login-page.md
│   │   │   ├── inventory-page.md
│   │   │   ├── cart-page.md
│   │   │   └── checkout-page.md
│   │   └── features/                   One .md per test flow — scenarios, test data
│   │       ├── login-flow.md
│   │       ├── checkout-flow.md
│   │       └── price-sorting-checkout-flow.md
│   └── prompts/                        System prompts that guide Claude's output
│       ├── pom-generator.md
│       ├── test-generator.md
│       └── failure-analyzer.md
│
├── src/pages/                          ← Page Object Models (AI-generated)
│   ├── base/BasePage.js                Base class — navigate, waitForLoad, getURL
│   ├── InventoryPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
│
├── tests/                              ← Test specs (AI-generated)
│   ├── fixtures/
│   │   ├── base.fixture.js             Fresh browser — for unauthenticated tests
│   │   └── auth.fixture.js             Pre-logged-in as standard_user
│   ├── login/login.spec.js
│   ├── checkout/checkout.spec.js
│   └── price-sorting-checkout/price-sorting-checkout.spec.js
│
├── scripts/
│   └── analyze-and-report.js           Bug analyzer + Jira ticket creator
│
├── test-data/
│   └── users.json                      Test credentials (never hardcode in specs)
│
├── .mcp.json                           Jira MCP server config (gitignored)
├── .claude/settings.json               Auto-approves MCP servers for this project
├── .env                                API keys — Anthropic + Jira (gitignored)
├── playwright.config.js                Playwright + Allure reporter config
└── package.json                        NPM scripts
```

---

## Full Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│  FLOW 1 — Adding a New Test Case                                │
└─────────────────────────────────────────────────────────────────┘

  Jira Ticket (TP project)
        │  requirement described in plain English
        ▼
  Claude Code reads the ticket via Jira MCP
        │
        ▼
  Engineer creates instruction files:
    .ai/instructions/pages/my-page.md       ← UI elements + selectors
    .ai/instructions/features/my-flow.md    ← Test scenarios + steps
        │
        │  "generate"
        ▼
  Claude reads .md files + global-context.md
        │
        ├──▶  src/pages/MyPage.js               Page Object generated
        └──▶  tests/my-flow/my-flow.spec.js      Test spec generated
        │
        │  npm test
        ▼
  Playwright executes tests (Chromium / Firefox / WebKit)
        │
        ├──▶  PASS → Allure Report
        └──▶  FAIL → Flow 2


┌─────────────────────────────────────────────────────────────────┐
│  FLOW 2 — Failure Analysis + Jira Bug Reporting                 │
└─────────────────────────────────────────────────────────────────┘

  Test fails
        │  Playwright writes reports/last-run.json
        ▼
  npm run report:bugs
        │
        ▼
  scripts/analyze-and-report.js
        │
        ├── Reads each failed test from report
        │
        ├── Classifies root cause:
        │     selector  → element not found / selector changed
        │     timing    → timeout exceeded
        │     navigation → redirect did not occur
        │     assertion → text / URL mismatch
        │
        ├── Determines priority by keyword match:
        │     P1 Highest → login, checkout, auth, order, payment
        │     P2 High    → cart, form, submit, navigation, redirect
        │     P3 Medium  → sort, filter, text, UI, badge
        │
        ├── Claude AI (if ANTHROPIC_API_KEY set):
        │     reads .ai/prompts/failure-analyzer.md
        │     produces richer root cause + suggested fix
        │
        └── Creates Jira Task via REST API:
              Summary:     [Bug] Suite › Test name
              Priority:    Highest / High / Medium
              Labels:      automated-bug, playwright, e2e, p1/p2/p3
              Description: Error · Root Cause · Suggested Fix · Stack Trace
```

---

## Architecture Decisions

### ADR-001 · Page Object Model
All page interactions are encapsulated in POM classes under `src/pages/`.
Every POM extends `BasePage`. Tests never reference selectors directly.

### ADR-002 · Claude Code as AI Engine
Claude Code (the CLI) is the AI engine — no separate API server needed.
Engineers describe requirements; Claude reads instruction files and writes code.
The `mcp-server/` folder is legacy and no longer part of the active workflow.

### ADR-003 · Markdown Instruction Files
`.md` files in `.ai/instructions/` are the single source of truth for generation.
Consistent instruction format → consistent AI output quality.
Page instructions describe UI. Feature instructions describe test scenarios.

### ADR-004 · Jira MCP Integration
Claude Code connects to Jira via `.mcp.json` (`mcp-jira-cloud` server).
Enables reading ticket requirements directly and creating bug reports automatically.
Credentials stored in `.env` and `.mcp.json` (both gitignored).

### ADR-005 · Fixture-First Test Architecture
All tests import from `tests/fixtures/` — never from `@playwright/test` directly.
`base.fixture.js` → unauthenticated tests (login).
`auth.fixture.js` → pre-logged-in tests (inventory, cart, checkout).

### ADR-006 · Allure Reporting
Allure reporter runs alongside Playwright's built-in HTML and JSON reporters.
Raw results → `allure-results/`. HTML report → `allure-report/`.

### ADR-007 · Automated Bug Reporting
On test failure, `scripts/analyze-and-report.js` reads the Playwright JSON report,
classifies each failure by root cause and priority, then creates a Jira ticket
automatically — closing the loop between test execution and bug tracking.

---

## NPM Scripts

| Command | Description |
|---|---|
| `npm test` | Run all tests headless |
| `npm run test:headed` | Run with browser visible |
| `npm run test:ui` | Playwright interactive UI mode |
| `npm run test:debug` | Playwright debug mode |
| `npm run test:report-bugs` | Run tests + auto-create Jira bugs on failure |
| `npm run report:bugs` | Analyse last run + create Jira bugs |
| `npm run allure:serve` | Generate + open Allure report |
| `npm run allure:generate` | Build Allure HTML report |
| `npm run allure:open` | Open already-built Allure report |
| `npm run report` | Open Playwright HTML report |

---

## How to Add a New Test Case

1. Read or create a Jira ticket describing the requirement
2. Create `.ai/instructions/pages/my-page.md` (elements, selectors, actions)
3. Create `.ai/instructions/features/my-flow.md` (test scenarios, fixture, test data)
4. Tell Claude Code: **"generate"**
5. Claude writes `src/pages/MyPage.js` and `tests/my-flow/my-flow.spec.js`
6. Run `npm test` — or `npm run test:report-bugs` to auto-file bugs on failure

## How to Fix a Failing Test

1. Run `npm run report:bugs` — Jira ticket created automatically
2. Read the ticket: error + root cause + suggested fix are pre-filled
3. If selector changed → update the relevant `.md` instruction file → regenerate
4. If logic changed → tell Claude the updated requirement → regenerate
5. Re-run `npm test` to confirm the fix

---

## Tech Stack

| Tool | Version | Role |
|---|---|---|
| Playwright | ^1.44.0 | Browser automation + test runner |
| Node.js | 18+ | Runtime |
| Claude Code | latest | AI code generation + analysis |
| Allure | ^2.38.1 | Test reporting |
| mcp-jira-cloud | latest | Jira integration via MCP |
| Anthropic SDK | ^0.24.0 | Claude API (optional, for richer analysis) |
| dotenv | ^16.4.5 | Environment config |
