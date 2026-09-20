const { expect } = require('aurora-report');
const { BasePage } = require('./BasePage');

/** Customer login at /account/login. We only ever try invalid credentials — no accounts are created. */
class AccountPage extends BasePage {
  constructor(page, report) {
    super(page, report);
    this.email = page.locator('input[name="customer[email]"]');
    this.password = page.locator('input[name="customer[password]"]');
    this.signIn = page.locator('form[action="/account/login"] input[type="submit"]').first();
    this.form = page.locator('form[action="/account/login"]');
    this.heading = page.getByRole('heading', { name: 'Customer Login' });
  }

  async openLogin() {
    await this.open('/account/login', 'Open the customer login page');
  }

  async signInWith(email, password) {
    await this.report.step(`Try to sign in as ${email}`, async () => {
      await this.email.fill(email);
      await this.password.fill(password);
      await this.signIn.click();
      await this.page.waitForLoadState('load');
    }, { highlight: this.form });
  }

  async expectStillSignedOut() {
    await this.report.step('The customer is still signed out and stays on the login page', async () => {
      await expect(this.page).toHaveURL(/\/account\/login/);
      await expect(this.heading).toBeVisible();
      await expect(this.loginLink).toBeVisible(); // a signed-in customer would see "Log out"
    }, { highlight: this.heading });
    this.report.note('This store shows no error message for a wrong password — it simply redisplays the login form, so the test checks that the customer is not signed in.');
  }
}

module.exports = { AccountPage };
