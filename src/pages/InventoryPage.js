import { BasePage } from './base/BasePage.js';

export class InventoryPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.title         = page.locator('.title');
    this.cartIcon      = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge     = page.locator('.shopping_cart_badge');
    this.addToCartBtns = page.locator('button[data-test^="add-to-cart"]');
    this.sortDropdown  = page.locator('[data-test="product-sort-container"]');
  }

  async addFirstProductToCart() {
    await this.addToCartBtns.first().click();
    return this;
  }

  async addSecondProductToCart() {
    await this.addToCartBtns.nth(1).click();
    return this;
  }

  async goToCart() {
    await this.cartIcon.click();
    return this;
  }

  async sortBy(label) {
    await this.sortDropdown.selectOption({ label });
    return this;
  }

  async getCartBadgeCount() {
    return this.cartBadge.textContent();
  }
}
