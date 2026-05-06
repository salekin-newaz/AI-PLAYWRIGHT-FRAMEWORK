import { test as base, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../test-data/users.json'), 'utf-8')
);

/**
 * Auth fixture — provides a page that is already logged in as standard_user.
 * Use this for tests that require an authenticated session (inventory, cart, etc).
 *
 * Usage in tests:
 *   import { test, expect } from '../fixtures/auth.fixture.js';
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    // Log in before each test
    await page.goto('/');
    await page.locator('[data-test="username"]').fill(users.standard_user.username);
    await page.locator('[data-test="password"]').fill(users.standard_user.password);
    await page.locator('[data-test="login-button"]').click();

    // Wait for redirect to inventory
    await page.waitForURL('**/inventory.html');

    await use(page);

    // No teardown needed — context is isolated per test
  },
});

export { expect };
