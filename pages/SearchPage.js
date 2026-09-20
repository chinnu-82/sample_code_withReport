const { expect } = require('aurora-report');
const { BasePage } = require('./BasePage');

/** Site search: the header form posts to /search?q=... */
class SearchPage extends BasePage {
  constructor(page, report) {
    super(page, report);
    this.input = page.locator('input[name="q"]:visible').first();
    this.results = page.locator('a[href*="/products/"]');
    this.heading = page.locator('h1').last();
    this.resultsArea = page.locator('#content, main').first();
  }

  async searchFor(term) {
    await this.report.step(`Search for "${term}"`, async () => {
      await this.open('/search', 'Open the search page');
      await this.input.fill(term);
      await this.input.press('Enter');
      await this.page.waitForLoadState('load');
    }, { highlight: this.input });
  }

  async expectResultsContain(names) {
    await this.report.step(`Results include: ${names.join(', ')}`, async () => {
      for (const name of names) {
        await expect(this.results.filter({ hasText: name }).first()).toBeVisible();
      }
    }, { highlight: this.resultsArea });
  }

  async expectNoResults(term) {
    await this.report.step(`The store says there is nothing matching "${term}"`, async () => {
      await expect(this.page.getByText(`No results found for ${term}`, { exact: false })).toBeVisible();
      await expect(this.page).toHaveTitle(new RegExp(`0 results found for "${term}"`));
    }, { highlight: this.resultsArea });
  }
}

module.exports = { SearchPage };
