import { test, expect } from '../fixtures/auth.fixture.js';
import { InventoryPage } from '../../src/pages/InventoryPage.js';
import { CartPage }      from '../../src/pages/CartPage.js';
import { CheckoutPage }  from '../../src/pages/CheckoutPage.js';

// Jira: TP-1 — [E2E] Verify Price Sort → Add to Cart → Checkout → Order Confirmation
test.describe('Price Sorting Checkout Flow', () => {
  test('TP-1 — Sort by price (low to high), add cheapest product, complete checkout', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart      = new CartPage(page);
    const checkout  = new CheckoutPage(page);

    // Sort products by price low to high
    await inventory.sortBy('Price (low to high)');

    // Add first (cheapest) product to cart
    await inventory.addFirstProductToCart();
    await expect(inventory.cartBadge).toHaveText('1');

    // Go to cart
    await inventory.goToCart();
    await expect(page).toHaveURL(/cart\.html/);
    expect(await cart.getItemCount()).toBe(1);

    // Proceed to checkout step one
    await cart.clickCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // Fill customer info from TP-1
    await checkout.fillCustomerInfo('Md Salekin', 'Newaz', '1234');
    await checkout.clickContinue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // Finish the order
    await checkout.clickFinish();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkout.confirmHeader).toHaveText('Thank you for your order!');
  });
});
