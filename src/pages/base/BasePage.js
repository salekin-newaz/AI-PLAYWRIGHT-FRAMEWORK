/**
 * BasePage — shared base class for all Page Objects.
 * Every page object must extend this class.
 */
export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a path relative to baseURL.
   * @param {string} path
   */
  async navigate(path = '/') {
    await this.page.goto(path);
    return this;
  }

  /**
   * Wait for the page to reach a networkidle state.
   */
  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
    return this;
  }

  /**
   * Get the current page title.
   * @returns {Promise<string>}
   */
  async getTitle() {
    return this.page.title();
  }

  /**
   * Get the current page URL.
   * @returns {string}
   */
  getURL() {
    return this.page.url();
  }

  /**
   * Reload the current page.
   */
  async reload() {
    await this.page.reload();
    return this;
  }
}
