const { expect } = require('aurora-report');

/**
 * The store's JSON endpoints.
 *
 * Aurora records API work as story steps too — there are no screenshots without a
 * browser, but every request, its payload and the data it returned are in the report.
 */
class StoreApi {
  /**
   * @param request an APIRequestContext — either the `request` fixture (no browser)
   *                or `page.request`, which shares the browser's cookies.
   */
  constructor(request, report) {
    this.request = request;
    this.report = report;
  }

  async products(stepTitle = 'GET /products.json') {
    return this.report.step(stepTitle, async () => {
      const response = await this.request.get('/products.json');
      expect(response.status(), 'catalogue API status').toBe(200);
      const { products } = await response.json();
      await this.report.attach('Catalogue returned by the API', products.map((p) => ({
        title: p.title,
        price: Number(p.variants[0].price),
        available: p.variants.some((v) => v.available),
      })));
      return products;
    });
  }

  /** The cart belonging to the browser session — pass `page.request` so the cookies match. */
  async cart(stepTitle = 'GET /cart.js') {
    return this.report.step(stepTitle, async () => {
      const response = await this.request.get('/cart.js');
      expect(response.status(), 'cart API status').toBe(200);
      const cart = await response.json();
      await this.report.attach('Cart as the API sees it', {
        itemCount: cart.item_count,
        totalPrice: cart.total_price / 100,
        currency: cart.currency,
        items: cart.items.map((i) => ({ title: i.title, quantity: i.quantity, price: i.price / 100 })),
      });
      return cart;
    });
  }
}

module.exports = { StoreApi };
