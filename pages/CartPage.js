const { expect } = require('aurora-report');
const { BasePage } = require('./BasePage');

/** The shopping cart at /cart. The theme renders two copies of the form, so we only use visible controls. */
class CartPage extends BasePage {
  constructor(page, report) {
    super(page, report);
    this.heading = page.locator('h1').last();
    this.quantities = page.locator('input[name="updates[]"]:visible');
    this.updateButton = page.locator('input[value="Update"]:visible').first();
    this.checkoutButton = page.locator('input[name="checkout"]:visible').first();
    this.removeLinks = page.locator('a[href*="quantity=0"]:visible');
    this.container = page.locator('#cart').first();
    this.lines = page.locator('#cart .row');
    this.totalLine = page.locator('h2').filter({ hasText: /^Total/ }).first();
    this.emptyMessage = page.getByText('your cart is currently empty', { exact: false });
  }

  async openCart() {
    await this.open('/cart', 'Open the cart page');
  }

  /** The order total the store shows, as a number. */
  async readTotal(stepTitle = 'Read the cart total') {
    return this.report.step(stepTitle, async () => {
      const body = (await this.page.locator('body').innerText()).replace(/\s+/g, ' ');
      const match = body.match(/Total\s*(£[\d.,]+)/i);
      const total = match ? BasePage.money(match[1]) : NaN;
      this.report.note(`The store shows a total of £${total.toFixed(2)}`);
      return total;
    });
  }

  async expectTotal(expected) {
    await this.report.step(`Cart total is £${expected.toFixed(2)}`, async () => {
      const total = await this.readTotal('Read the total shown in the cart');
      expect(total, 'cart total in £').toBeCloseTo(expected, 2);
    }, { highlight: this.container });
  }

  async expectContains(names) {
    await this.report.step(`Cart contains: ${names.join(', ')}`, async () => {
      for (const name of names) {
        await expect(this.container).toContainText(name);
      }
    }, { highlight: this.container });
  }

  async setQuantity(lineNumber, quantity) {
    await this.report.step(`Change the quantity of line ${lineNumber} to ${quantity}`, async () => {
      const box = this.quantities.nth(lineNumber - 1);
      await box.fill(String(quantity));
      await this.updateButton.click();
      await this.page.waitForLoadState('load');
    }, { highlight: this.quantities.nth(lineNumber - 1) });
  }

  async removeLine(lineNumber) {
    await this.report.step(`Remove line ${lineNumber} from the cart`, async () => {
      await this.removeLinks.nth(lineNumber - 1).click();
      await this.page.waitForLoadState('load');
    });
  }

  async expectEmpty() {
    await this.report.step('The cart is empty again', async () => {
      await expect(this.emptyMessage).toBeVisible();
    }, { highlight: this.emptyMessage });
  }

  async expectCheckoutAvailable() {
    await this.report.step('A "Check Out" button is offered', async () => {
      await expect(this.checkoutButton).toBeVisible();
      await expect(this.checkoutButton).toBeEnabled();
    }, { highlight: this.checkoutButton });
    this.report.note('The test stops here on purpose: this is a live demo store, so no order is ever placed.', 'warn');
  }
}

module.exports = { CartPage };
