# AI Playwright Framework ⚡

> 100% AI-driven QA automation. You write plain-English instructions. AI writes all the code.

**Test site:** https://www.saucedemo.com  
**Stack:** Playwright · JavaScript (ESM) · Claude API

---

## Quick Start

### 1. Install dependencies
```bash
npm install
npx playwright install
```

### 2. Set up environment
```bash
cp .env.example .env
# Open .env and add your ANTHROPIC_API_KEY
```

### 3. Generate Page Objects + Tests from instructions
```bash
npm run generate
```

### 4. Run the tests
```bash
npm test
```

### 5. View the report
```bash
npm run report
```

---

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run generate` | Generate all POMs + test specs from instructions |
| `npm run gen:pom` | Generate Page Objects only |
| `npm run gen:tests` | Generate test specs only |
| `npm test` | Run all Playwright tests |
| `npm run test:headed` | Run tests in headed browser |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run analyze` | AI analysis of test failures |
| `npm run report:bugs` | Analyse last run + create Jira bug tickets |
| `npm run test:report-bugs` | Run tests + auto-create Jira bugs on failure |
| `npm run full` | Generate everything + run all tests |
| `npm run report` | Open the last HTML report |
| `npm run allure:serve` | Generate + open Allure report |

---

## How to Add a New Test

### Step 1 — Describe the page
Create `.context/instructions/pages/my-page.md`

### Step 2 — Describe the scenarios
Create `.context/instructions/features/my-feature-flow.md`

### Step 3 — Generate
```bash
npm run generate
```

That's it. See `ARCHITECTURE.md` for full details.

---

## Project Structure

```
.context/               ← YOU write these (instructions, prompts, context)
src/pages/              ← AI-generated (never edit)
tests/                  ← AI-generated (never edit)
tests/fixtures/         ← Shared test fixtures
test-data/              ← Test credentials (you maintain)
scripts/                ← CLI generation + analysis scripts
```
