import { BasePage } from './base/BasePage.js';

export class CheckoutPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // Step One — customer info
    this.firstNameInput  = page.locator('[data-test="firstName"]');
    this.lastNameInput   = page.locator('[data-test="lastName"]');
    this.zipCodeInput    = page.locator('[data-test="postalCode"]');
    this.continueBtn     = page.locator('[data-test="continue"]');
    this.errorMsg        = page.locator('[data-test="error"]');

    // Step Two — order overview
    this.finishBtn       = page.locator('[data-test="finish"]');

    // Complete — confirmation
    this.confirmHeader   = page.locator('[data-test="complete-header"]');
    this.backHomeBtn     = page.locator('[data-test="back-to-products"]');
  }

  async fillCustomerInfo(firstName, lastName, zipCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipCodeInput.fill(zipCode);
    return this;
  }

  async clickContinue() {
    await this.continueBtn.click();
    return this;
  }

  async clickFinish() {
    await this.finishBtn.click();
    return this;
  }

  async clickBackHome() {
    await this.backHomeBtn.click();
    return this;
  }
}
