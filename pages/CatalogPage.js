const { expect } = require('aurora-report');
const { BasePage } = require('./BasePage');

/** The home page and the "Catalog" collection page: both are grids of product cards. */
class CatalogPage extends BasePage {
  constructor(page, report) {
    super(page, report);
    this.productLinks = page.locator('a[href*="/products/"]');
    this.grid = page.locator('#content, .grid, main').first();
    this.heading = page.locator('h1').last();
  }

  async openHome() {
    await this.open('/', 'Open the Sauce Demo home page');
  }

  async openCatalog() {
    await this.open('/collections/all', 'Open the product catalogue');
  }

  /** Product names + prices as shown on the cards, attached to the report as data. */
  async listProducts(stepTitle = 'Read the products on the page') {
    return this.report.step(stepTitle, async () => {
      const cards = await this.productLinks.all();
      const seen = new Map();
      for (const card of cards) {
        const text = (await card.innerText()).replace(/\s+/g, ' ').trim();
        const name = text.replace(/Sold Out/i, '').replace(/£.*/, '').trim();
        if (name && !seen.has(name)) {
          seen.set(name, { name, price: BasePage.money(text), soldOut: /sold out/i.test(text) });
        }
      }
      const products = [...seen.values()];
      await this.report.attach('Products found on the page', products);
      return products;
    });
  }

  async expectProductCount(count) {
    await this.report.step(`The page lists ${count} products`, async () => {
      const products = await this.listProducts('Count the product cards');
      expect(products.length, 'number of distinct products').toBe(count);
    }, { highlight: this.grid });
  }

  async openProduct(name) {
    await this.report.step(`Open the "${name}" product page`, async () => {
      await this.productLinks.filter({ hasText: name }).first().click();
      await this.page.waitForLoadState('load');
    });
  }
}

module.exports = { CatalogPage };
