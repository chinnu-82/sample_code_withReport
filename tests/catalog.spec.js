const { test, expect } = require('../fixtures');
const { PRODUCTS, CATALOGUE_SIZE } = require('../test-data');

test.describe('Catalogue', () => {
  test('lists every product in the shop with a price @smoke', async ({ catalog, report }) => {
    report.feature('Catalogue');
    report.severity('high');
    report.description('A shopper opens "Catalog" and expects to see the whole range, priced, with sold-out items marked.');

    await catalog.openCatalog();

    const products = await catalog.listProducts('Read every product card');

    await report.step(`The catalogue offers ${CATALOGUE_SIZE} products`, async () => {
      expect(products.length, 'products in the catalogue').toBe(CATALOGUE_SIZE);
    }, { highlight: catalog.grid });

    await report.check('Every product has a price', async () => {
      for (const p of products) {
        expect(Number.isFinite(p.price), `${p.name} shows a price`).toBe(true);
      }
    });

    await report.check('Sold-out products are labelled on their card', async () => {
      const soldOut = products.filter((p) => p.soldOut).map((p) => p.name);
      await report.attach('Sold-out products', soldOut);
      expect(soldOut).toContain(PRODUCTS.brownShades.name);
    });
  });

  test('a product card opens the matching product page', async ({ catalog, product, report }) => {
    report.feature('Catalogue');
    const item = PRODUCTS.greyJacket;

    await catalog.openCatalog();
    await catalog.openProduct(item.name);
    await product.expectDetails(item);

    await report.step('The breadcrumb shows where the shopper is', async () => {
      await expect(product.page.getByText(`Home — ${item.name}`)).toBeVisible();
    });
  });
});
