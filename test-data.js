/**
 * The catalogue of the public demo store, as it is expected to look.
 * If the shop owner changes a price, a test fails and the report shows
 * "expected £55.00 but the app gave …" — which is exactly the point.
 */
const PRODUCTS = {
  greyJacket: { handle: 'grey-jacket', name: 'Grey jacket', price: 55.0 },
  noirJacket: { handle: 'noir-jacket', name: 'Noir jacket', price: 60.0 },
  stripedTop: { handle: 'striped-top', name: 'Striped top', price: 50.0 },
  blackHeels: { handle: 'flower-print-jeans', name: 'Black heels', price: 45.0 },
  whiteSandals: { handle: 'white-sandals', name: 'White sandals', price: 25.0, soldOut: true },
  bronzeSandals: { handle: 'bronze-sandals', name: 'Bronze sandals', price: 39.99 },
  brownShades: { handle: 'brown-shades', name: 'Brown Shades', price: 20.0, soldOut: true },
};

const CATALOGUE_SIZE = Object.keys(PRODUCTS).length; // 7 products in /collections/all
const FEATURED_ON_HOME = [PRODUCTS.greyJacket, PRODUCTS.noirJacket, PRODUCTS.stripedTop];

module.exports = { PRODUCTS, CATALOGUE_SIZE, FEATURED_ON_HOME };
