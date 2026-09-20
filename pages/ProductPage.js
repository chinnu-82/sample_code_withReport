const { expect } = require('aurora-report');
const { BasePage } = require('./BasePage');

/** A single product page, e.g. /products/grey-jacket */
class ProductPage extends BasePage {
  constructor(page, report) {
    super(page, report);
    this.title = page.locator('h1').last();
    this.price = page.locator('h2').first();
    this.addToCart = page.locator('input.add-to-cart');
    this.addToCartForm = page.locator('form[action="/cart/add"]');
  }

  async openProduct(handle, name) {
    await this.open(`/products/${handle}`, `Open the ${name || handle} product page`);
  }

  async expectDetails({ name, price }) {
    await this.report.step(`Product page shows "${name}" at £${price.toFixed(2)}`, async () => {
      await expect(this.title).toHaveText(name);
      await expect(this.price).toContainText(`£${price.toFixed(2)}`);
    }, { highlight: [this.title, this.price] });
  }

  /**
   * The theme adds to the cart with a background request to /cart/add.js, so we wait for
   * that response instead of guessing with a timeout.
   */
  async addToCartAndWait(name) {
    await this.report.step(`Add "${name}" to the cart`, async () => {
      await Promise.all([
        this.page.waitForResponse((r) => r.url().includes('/cart/add.js') && r.status() === 200),
        this.addToCart.click(),
      ]);
    }, { highlight: this.addToCart });
  }

  async expectSoldOut() {
    await this.report.step('The Add to Cart button is replaced by a disabled "Sold Out" button', async () => {
      await expect(this.addToCart).toHaveValue(/sold out/i);
      await expect(this.addToCart).toBeDisabled();
    }, { highlight: this.addToCart });
  }
}

module.exports = { ProductPage };
