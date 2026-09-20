const { test, expect } = require('../fixtures');
const { PRODUCTS } = require('../test-data');

test.describe('Shopping cart', () => {
  test('a shopper can put a jacket in the cart @smoke', async ({ product, cart, report }) => {
    const item = PRODUCTS.greyJacket;
    report.feature('Cart');
    report.severity('critical');
    report.owner('Checkout team');
    report.description('The core journey: open a product, add it to the cart, and find it there at the right price.');

    await product.openProduct(item.handle, item.name);
    await product.addToCartAndWait(item.name);
    await product.expectCartCount(1);

    await product.goToCart();
    await cart.expectContains([item.name]);
    await cart.expectTotal(item.price);

    await report.attach('What the shopper bought', { product: item.name, quantity: 1, expectedTotal: item.price });
  });

  test('the total follows the quantity', async ({ product, cart, report }) => {
    const item = PRODUCTS.stripedTop;
    report.feature('Cart');
    report.severity('high');
    report.description('Changing the quantity to 3 must triple the total.');

    await product.openProduct(item.handle, item.name);
    await product.addToCartAndWait(item.name);
    await product.goToCart();
    await cart.expectTotal(item.price);

    report.note(`One ${item.name} costs £${item.price.toFixed(2)}, so three should cost £${(item.price * 3).toFixed(2)}.`);

    await cart.setQuantity(1, 3);
    await cart.expectTotal(item.price * 3);
    await cart.expectCartCount(3);
  });

  test('removing the last item empties the cart', async ({ product, cart, report }) => {
    const item = PRODUCTS.blackHeels;
    report.feature('Cart');
    report.description('A shopper changes their mind and removes the only item in the cart.');

    await product.openProduct(item.handle, item.name);
    await product.addToCartAndWait(item.name);
    await product.goToCart();
    await cart.expectContains([item.name]);

    await cart.removeLine(1);
    await cart.expectEmpty();
    await cart.expectCartCount(0);
  });

  test('two different products are kept side by side and added up', async ({ product, cart, report }) => {
    const first = PRODUCTS.greyJacket;
    const second = PRODUCTS.noirJacket;
    report.feature('Cart');
    report.severity('high');
    report.description('Two products in one cart: both lines are listed and the total is their sum.');

    await product.openProduct(first.handle, first.name);
    await product.addToCartAndWait(first.name);

    await product.openProduct(second.handle, second.name);
    await product.addToCartAndWait(second.name);
    await product.expectCartCount(2);

    await product.goToCart();
    await cart.expectContains([first.name, second.name]);

    report.note(`£${first.price.toFixed(2)} + £${second.price.toFixed(2)} = £${(first.price + second.price).toFixed(2)}`);
    await cart.expectTotal(first.price + second.price);
  });

  test('a filled cart offers a way to check out', async ({ product, cart, report }) => {
    const item = PRODUCTS.blackHeels;
    report.feature('Checkout');
    report.severity('critical');
    report.description('The last step before payment: with goods in the cart, a Check Out button must be available. No order is placed.');

    await product.openProduct(item.handle, item.name);
    await product.addToCartAndWait(item.name);
    await product.goToCart();
    await cart.expectContains([item.name]);
    await cart.expectCheckoutAvailable();
  });
});
