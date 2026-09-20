const { expect } = require('aurora-report');

/**
 * Shared behaviour for every page object.
 *
 * Every method wraps itself in `report.step(...)`, so the Aurora report shows a
 * screenshot-by-screenshot story of what the customer did — without the test
 * having to ask for a single screenshot.
 */
class BasePage {
  constructor(page, report) {
    this.page = page;
    this.report = report;
    // Header, present on every page of the store.
    // The theme renders a hidden duplicate of the cart link, so we always pick the visible one:
    // "My Cart (n)" is the drop-down toggle, "Check Out" is the link that opens /cart.
    this.cartCounter = page.locator('a:has-text("My Cart"):visible').first();
    this.cartLink = page.locator('a[href="/cart"]:visible').first();
    this.checkoutLink = page.getByRole('link', { name: 'Check Out' }).first();
    this.loginLink = page.getByRole('link', { name: 'Log In' });
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
    this.mainMenu = page.locator('#nav, nav').first();
    this.breadcrumb = page.locator('.breadcrumb, #breadcrumb').first();
  }

  /** Open a store URL and record it as a step with a screenshot. */
  async open(pathname, title) {
    await this.report.step(title || `Open ${pathname}`, async () => {
      await this.page.goto(pathname, { waitUntil: 'load' });
    });
  }

  /** The number the header shows in "My Cart (n)". Retries, because the theme updates it asynchronously. */
  async expectCartCount(count) {
    await this.report.step(`Header cart shows ${count} item(s)`, async () => {
      await expect(this.cartCounter).toContainText(`(${count})`);
    }, { highlight: this.cartCounter });
  }

  async goToCart() {
    await this.report.step('Open the cart from the header', async () => {
      await this.cartLink.click();
      await this.page.waitForLoadState('load');
    }, { highlight: this.cartLink });
  }

  async openMenuItem(name) {
    await this.report.step(`Choose "${name}" in the menu`, async () => {
      await this.page.getByRole('link', { name, exact: true }).first().click();
      await this.page.waitForLoadState('load');
    });
  }

  /** Prices on this store look like "£55.00". */
  static money(text) {
    const m = String(text).match(/£\s*([\d,]+(?:\.\d{2})?)/);
    return m ? Number(m[1].replace(/,/g, '')) : NaN;
  }
}

module.exports = { BasePage };
