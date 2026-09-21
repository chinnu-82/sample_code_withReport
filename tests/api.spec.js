const { test, expect } = require('../fixtures');
const { StoreApi } = require('../pages/StoreApi');
const { PRODUCTS, CATALOGUE_SIZE } = require('../test-data');

/**
 * API checks. The first two never open a browser — Aurora records the steps and the
 * payloads, just without screenshots. The last one mixes both: it shops through the
 * UI and then asks the cart API what it thinks is in the basket.
 */
test.describe('Store API', () => {
  test('the catalogue API agrees with our expected prices', { tag: ['@api', '@smoke'] }, async ({ api, report }) => {
    report.feature('Catalogue API');
    report.severity('high');
    report.description('The prices the tests rely on come from the shop itself, so a price change must fail loudly.');

    const products = await api.products();

    await report.step(`The API returns ${CATALOGUE_SIZE} products`, async () => {
      expect(products.length, 'products in the API response').toBe(CATALOGUE_SIZE);
    });

    for (const expected of Object.values(PRODUCTS)) {
      await report.check(`${expected.name} still costs £${expected.price.toFixed(2)}`, async () => {
        const found = products.find((p) => p.title === expected.name);
        expect(found, `"${expected.name}" exists in the API`).toBeTruthy();
        expect(Number(found.variants[0].price), `price of ${expected.name}`).toBe(expected.price);
      });
    }

    report.note('Each price is a soft check, so one price change reports all the others too.', 'success');
  });

  test('stock flags in the API match the shop floor', { tag: '@api' }, async ({ api, report }) => {
    report.feature('Catalogue API');

    const products = await api.products('Read the catalogue');
    const soldOut = await report.step('Work out what is sold out', async () => {
      const names = products.filter((p) => !p.variants.some((v) => v.available)).map((p) => p.title).sort();
      await report.attach('Sold out according to the API', names);
      return names;
    });

    await report.step('Exactly the two known sold-out products are unavailable', async () => {
      expect(soldOut).toEqual([PRODUCTS.brownShades.name, PRODUCTS.whiteSandals.name].sort());
    });
  });

  test('the cart API sees what the shopper put in the basket', { tag: ['@api', '@cart'] }, async ({ page, product, report }) => {
    report.feature('Cart API');
    report.severity('critical');
    report.description('A hybrid check: shop through the UI, then confirm the back end agrees.');

    const item = PRODUCTS.greyJacket;
    report.link(`https://sauce-demo.myshopify.com/products/${item.handle}`, 'Product under test');

    await product.openProduct(item.handle, item.name);
    await product.addToCartAndWait(item.name);

    // page.request shares the browser's cookies, so it sees the same cart as the UI.
    const cartApi = new StoreApi(page.request, report);
    const cart = await cartApi.cart('Ask the cart API what it holds');

    await report.step('The API reports one Grey jacket at the right price', async () => {
      expect(cart.item_count, 'items in the cart').toBe(1);
      expect(cart.items[0].title, 'item title').toContain(item.name);
      expect(cart.total_price / 100, 'cart total in £').toBeCloseTo(item.price, 2);
    });

    await report.screenshot('The cart as the shopper sees it', { fullPage: true, page });
  });
});
