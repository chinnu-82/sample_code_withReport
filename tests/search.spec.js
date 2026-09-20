const { test, expect } = require('../fixtures');
const { PRODUCTS } = require('../test-data');

test.describe('Search', () => {
  test('finds the products a shopper is looking for @smoke', async ({ search, report }) => {
    report.feature('Search');
    report.severity('high');
    report.description('Searching for "jacket" must return both jackets in the shop.');

    await search.searchFor('jacket');

    await report.step('The results page confirms what was searched for', async () => {
      await expect(search.page.getByText('Showing results for jacket')).toBeVisible();
    });

    await search.expectResultsContain([PRODUCTS.greyJacket.name, PRODUCTS.noirJacket.name]);

    const found = await report.step('Collect the result names', async () => {
      const names = (await search.results.allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').replace(/£.*/, '').trim());
      await report.attach('Search results for "jacket"', names);
      return names;
    }, { screenshot: false });

    report.note(`The store returned ${found.length} results.`);
  });

  test('says so politely when nothing matches', async ({ search, report }) => {
    report.feature('Search');
    const term = 'zzzqqq';

    report.note(`"${term}" is deliberate nonsense — no product can match it.`);
    await search.searchFor(term);
    await search.expectNoResults(term);

    await report.step('No product cards are offered', async () => {
      await expect(search.results).toHaveCount(0);
    });
  });
});
