import { BasePage } from './base/BasePage.js';

export class CartPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.title            = page.locator('.title');
    this.cartItems        = page.locator('.cart_item');
    this.checkoutBtn      = page.locator('[data-test="checkout"]');
    this.continueShopBtn  = page.locator('[data-test="continue-shopping"]');
  }

  async clickCheckout() {
    await this.checkoutBtn.click();
    return this;
  }

  async clickContinueShopping() {
    await this.continueShopBtn.click();
    return this;
  }

  async getItemCount() {
    return this.cartItems.count();
  }
}
