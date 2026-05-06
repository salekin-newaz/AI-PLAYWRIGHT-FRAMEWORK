# AI Playwright Framework ⚡

> 100% AI-driven QA automation. You write plain-English instructions. AI writes all the code.

**Test site:** https://www.saucedemo.com  
**Stack:** Playwright · JavaScript (ESM) · Claude API · MCP Server

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

## MCP Server Setup (for Claude Desktop / VS Code)

Add this to your Claude MCP config (`~/.claude/mcp_servers.json`):

```json
{
  "playwright-qa-mcp": {
    "command": "node",
    "args": ["/absolute/path/to/ai-playwright-framework/mcp-server/index.js"],
    "env": {
      "ANTHROPIC_API_KEY": "your-key-here",
      "BASE_URL": "https://www.saucedemo.com",
      "MCP_INSTRUCTION_SOURCE": "local"
    }
  }
}
```

Then in Claude, you can say:
- *"List all instruction files"*
- *"Generate page object for Login"*
- *"Generate tests for login-flow"*
- *"Why did my tests fail?"*

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
| `npm run full` | Generate everything + run all tests |
| `npm run report` | Open the last HTML report |
| `npm run mcp:start` | Start the MCP server |

---

## How to Add a New Test

### Step 1 — Describe the page
Create `.ai/instructions/pages/my-page.md`

### Step 2 — Describe the scenarios
Create `.ai/instructions/features/my-feature-flow.md`

### Step 3 — Generate
```bash
npm run generate
```

That's it. See `ARCHITECTURE.md` for full details.

---

## Project Structure

```
.ai/                    ← YOU write these
src/pages/              ← AI-generated (never edit)
tests/                  ← AI-generated (never edit)
tests/fixtures/         ← Shared test fixtures
test-data/              ← Test credentials (you maintain)
mcp-server/             ← MCP tools for Claude
scripts/                ← CLI generation scripts
```
