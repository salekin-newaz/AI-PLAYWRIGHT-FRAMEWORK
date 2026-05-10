---
name: pr-description
description: Writes pull request descriptions. Use when create a PR, writing a PR, or when the user asks to summarize changes for a pull request.
---

When writing a PR description:

1. Run `git diff main...HEAD` to see all changes on this branch
2. Write a description following this format:

## What
One sentence explaining what this PR does.

## Why
Brief context on why this change is needed

## Changes
- Bullet points of specific changes made
- Group related changes together
- Mention any files deleted or renamed

## Testing
- List specific test scenarios or commands to verify changes (e.g., `npm test`, `npm run test:headed`)
- For test/POM changes: include command to regenerate (`npm run generate`)
- For page instructions: show which test features are affected
- Include test coverage or Allure report results if applicable

Keep descriptions concise. Focus on what a reviewer needs to know.