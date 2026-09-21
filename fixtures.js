const { test: base, expect } = require('aurora-report');
const { BasePage } = require('./pages/BasePage');
const { CatalogPage } = require('./pages/CatalogPage');
const { ProductPage } = require('./pages/ProductPage');
const { CartPage } = require('./pages/CartPage');
const { SearchPage } = require('./pages/SearchPage');
const { AccountPage } = require('./pages/AccountPage');
const { StoreApi } = require('./pages/StoreApi');

/**
 * Every page object receives `report`, so each action it performs becomes a
 * step (with a screenshot) in the Aurora story for that test.
 */
const test = base.extend({
  catalog: async ({ page, report }, use) => use(new CatalogPage(page, report)),
  product: async ({ page, report }, use) => use(new ProductPage(page, report)),
  cart: async ({ page, report }, use) => use(new CartPage(page, report)),
  search: async ({ page, report }, use) => use(new SearchPage(page, report)),
  account: async ({ page, report }, use) => use(new AccountPage(page, report)),
  store: async ({ page, report }, use) => use(new BasePage(page, report)),
  /** Talks to the JSON endpoints without opening a browser. */
  api: async ({ request, report }, use) => use(new StoreApi(request, report)),
});

module.exports = { test, expect, money: BasePage.money };
