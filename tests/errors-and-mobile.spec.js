const { test, expect } = require('../fixtures');
const { PRODUCTS } = require('../test-data');

test.describe('Error handling', () => {
  test('an unknown address shows a helpful 404 page', async ({ store, report, page }) => {
    report.feature('Error pages');
    report.description('A shopper follows a stale link. The shop should apologise and offer a way back, not break.');

    const response = await report.step('Open a page that does not exist', async () => {
      return page.goto('/pages/this-page-does-not-exist', { waitUntil: 'load' });
    });

    await report.step('The server answers with 404 Not Found', async () => {
      expect(response.status(), 'HTTP status').toBe(404);
    }, { screenshot: false });

    await report.check('The page explains what happened', async () => {
      await expect(page.getByText('We can’t find the page that you are looking for', { exact: false })).toBeVisible();
    });

    await report.check('A link back to the homepage is offered', async () => {
      await expect(page.getByRole('link', { name: /homepage/i })).toBeVisible();
    });

    await report.step('The shop header is still available on the error page', async () => {
      await expect(store.cartCounter).toBeVisible();
      await expect(page.getByRole('link', { name: 'Catalog' })).toBeVisible();
    });
  });
});

test.describe('Small screens', () => {
  test('the shop works on a phone @responsive', async ({ catalog, product, report, page }) => {
    report.feature('Responsive');
    report.description('Most shoppers arrive on a phone, so browsing and adding to the cart must work at 390px wide.');

    report.note(`Viewport: ${page.viewportSize().width}×${page.viewportSize().height}`);

    await catalog.openHome();
    await report.step('The home page fits the screen without sideways scrolling', async () => {
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
      expect(overflow, 'page scrolls sideways').toBe(false);
    });

    const item = PRODUCTS.greyJacket;
    await catalog.openProduct(item.name);
    await product.expectDetails(item);
    await product.addToCartAndWait(item.name);
    await product.expectCartCount(1);
  });
});
