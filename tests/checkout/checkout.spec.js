import { test, expect } from '../fixtures/auth.fixture.js';
import { InventoryPage } from '../../src/pages/InventoryPage.js';
import { CartPage }      from '../../src/pages/CartPage.js';
import { CheckoutPage }  from '../../src/pages/CheckoutPage.js';

test.describe('Checkout Flow', () => {
  test('1 — Happy Path: add two products and complete checkout', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart      = new CartPage(page);
    const checkout  = new CheckoutPage(page);

    // Add first two products to cart
    await inventory.addFirstProductToCart();
    await expect(inventory.cartBadge).toHaveText('1');

    await inventory.addSecondProductToCart();
    await expect(inventory.cartBadge).toHaveText('2');

    // Go to cart
    await inventory.goToCart();
    await expect(page).toHaveURL(/cart\.html/);
    expect(await cart.getItemCount()).toBe(2);

    // Proceed to checkout step one
    await cart.clickCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // Fill customer info
    await checkout.fillCustomerInfo('John', 'Doe', '12345');
    await checkout.clickContinue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // Finish the order
    await checkout.clickFinish();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkout.confirmHeader).toHaveText('Thank you for your order!');
  });
});
