const { test, expect } = require('../fixtures');
const { FEATURED_ON_HOME } = require('../test-data');

test.describe('Home page', () => {
  test('shows the featured products a first-time visitor sees @smoke', async ({ catalog, report }) => {
    report.feature('Home page');
    report.severity('critical');
    report.owner('Storefront team');
    report.description('A visitor lands on the shop and is offered the three featured products, each with a price.');

    await catalog.openHome();

    report.note('The home page promotes three products: Grey jacket, Noir jacket and Striped top.');

    const products = await catalog.listProducts('Read the featured products');

    await report.step('All three featured products are shown with the right prices', async () => {
      for (const expected of FEATURED_ON_HOME) {
        const found = products.find((p) => p.name === expected.name);
        expect(found, `"${expected.name}" is on the home page`).toBeTruthy();
        expect(found.price, `price of ${expected.name}`).toBe(expected.price);
      }
    }, { highlight: catalog.productLinks.first() });

    await report.step('The shop introduces itself in the header', async () => {
      await expect(catalog.page.getByText('Just a demo site showing off what Sauce can do.')).toBeVisible();
    });
  });

  test('main menu takes a visitor to the catalogue, blog and about page', async ({ catalog, report, page }) => {
    report.feature('Navigation');
    report.description('The header menu is the main way around the shop, so every entry must lead somewhere.');

    await catalog.openHome();

    for (const [label, expectedUrl, expectedTitle] of [
      ['Catalog', /\/collections\/all/, /^Products/],
      ['Blog', /\/blogs\/news/, /^News/],
      ['About Us', /\/pages\/about-us/, /^About Us/],
    ]) {
      await catalog.openMenuItem(label);
      await report.check(`"${label}" opens the ${label} page`, async () => {
        await expect(page).toHaveURL(expectedUrl);
        await expect(page).toHaveTitle(expectedTitle);
      });
      await catalog.openMenuItem('Home');
    }

    report.note('Each menu entry was checked with a soft check, so one broken link still reports the others.', 'success');
  });
});
