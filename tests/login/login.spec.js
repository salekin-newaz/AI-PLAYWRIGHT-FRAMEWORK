import { test, expect } from '../fixtures/base.fixture.js';
import users from '../../test-data/users.json' assert { type: 'json' };

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1 — Happy Path: standard user can log in', async ({ page }) => {
    await page.locator('[data-test="username"]').fill(users.standard_user.username);
    await page.locator('[data-test="password"]').fill(users.standard_user.password);
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.title')).toContainText('Products');
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
  });

  test('2 — Locked Out User: shows locked out error', async ({ page }) => {
    await page.locator('[data-test="username"]').fill(users.locked_out_user.username);
    await page.locator('[data-test="password"]').fill(users.locked_out_user.password);
    await page.locator('[data-test="login-button"]').click();

    await expect(page).not.toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('locked out');
  });

  test('3 — Wrong Password: shows mismatch error', async ({ page }) => {
    await page.locator('[data-test="username"]').fill(users.standard_user.username);
    await page.locator('[data-test="password"]').fill('wrong_password');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('4 — Empty Form: shows username required error', async ({ page }) => {
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
  });

  test('5 — Missing Password: shows password required error', async ({ page }) => {
    await page.locator('[data-test="username"]').fill(users.standard_user.username);
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Password is required');
  });

  test('6 — Error Dismissal: error disappears after clicking X', async ({ page }) => {
    await page.locator('[data-test="username"]').fill(users.standard_user.username);
    await page.locator('[data-test="password"]').fill('wrong_password');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await page.locator('.error-button').click();
    await expect(page.locator('[data-test="error"]')).not.toBeVisible();
    await expect(page.locator('[data-test="username"]')).toBeVisible();
  });
});
