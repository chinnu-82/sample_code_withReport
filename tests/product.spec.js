const { test, expect } = require('../fixtures');
const { PRODUCTS } = require('../test-data');

test.describe('Product page', () => {
  test('shows the name, the price and a way to buy @smoke', async ({ product, report }) => {
    const item = PRODUCTS.noirJacket;
    report.feature('Product page');
    report.severity('critical');
    report.description('Everything a shopper needs in order to buy: what it is, what it costs, and an Add to Cart button.');

    await product.openProduct(item.handle, item.name);
    await product.expectDetails(item);

    await report.step('An enabled "Add to Cart" button is offered', async () => {
      await expect(product.addToCart).toBeVisible();
      await expect(product.addToCart).toBeEnabled();
      await expect(product.addToCart).toHaveValue(/add to cart/i);
    }, { highlight: product.addToCart });

    await report.check('The product description section is filled in', async () => {
      await expect(product.page.locator('form[action="/cart/add"]')).toBeVisible();
      await expect(product.page.getByText('This area is populated by the product description', { exact: false })).toBeVisible();
    });
  });

  test('a sold-out product cannot be bought', async ({ product, report }) => {
    const item = PRODUCTS.brownShades;
    report.feature('Product page');
    report.severity('high');
    report.description('Sold-out stock must not be addable to the cart, otherwise the shop takes money for goods it has not got.');

    await product.openProduct(item.handle, item.name);
    await product.expectDetails({ name: item.name, price: item.price });
    await product.expectSoldOut();

    report.note('The button is disabled, so a shopper cannot add out-of-stock goods to the cart.', 'success');
  });
});
