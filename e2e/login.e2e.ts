describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ delete: true });
  });

  it('should login successfully', async () => {
    await element(by.id('email_input')).typeText('test@mail.com');
    await element(by.id('password_input')).typeText('123456');

    await element(by.id('login_button')).tap();

    await expect(element(by.id('home_screen'))).toBeVisible();
  });
});
