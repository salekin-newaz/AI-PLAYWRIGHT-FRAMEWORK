import { test as base } from '@playwright/test';

/**
 * Base fixture — extends Playwright's built-in test with a fresh page.
 * All generated test files import from here instead of @playwright/test directly.
 *
 * Usage in tests:
 *   import { test, expect } from '../fixtures/base.fixture.js';
 */
export const test = base.extend({
  // Fresh page — no extra setup. Suitable for tests that start unauthenticated.
  page: async ({ page }, use) => {
    await use(page);
  },
});

export { expect } from '@playwright/test';
