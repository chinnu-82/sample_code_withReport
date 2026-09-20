const { test, expect } = require('../fixtures');

test.describe('Customer account', () => {
  test('the login page asks for an email and a password', async ({ account, report }) => {
    report.feature('Account');
    report.description('Before anyone can sign in, the form itself has to be there and usable.');

    await account.openLogin();

    await report.step('Both fields and a Sign In button are offered', async () => {
      await expect(account.email).toBeEditable();
      await expect(account.password).toBeEditable();
      await expect(account.signIn).toBeEnabled();
    }, { highlight: account.form });

    await report.check('A "Forgot your password?" link is offered', async () => {
      await expect(account.page.getByRole('link', { name: /forgot your password/i })).toBeVisible();
    });
  });

  test('wrong credentials do not sign anybody in', async ({ account, report }) => {
    report.feature('Account');
    report.severity('critical');
    report.description('A wrong password must never let anyone in. No account is ever created by these tests.');

    report.note('Using an address that cannot exist on this demo store.');

    await account.openLogin();
    await account.signInWith('nobody-does-not-exist@example.com', 'definitely-the-wrong-password');
    await account.expectStillSignedOut();
  });
});
