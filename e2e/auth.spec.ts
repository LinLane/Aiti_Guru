import { expect, test } from '@playwright/test';

test.describe('Страница авторизации', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await expect(
      page.getByRole('heading', { name: 'Добро пожаловать!' }),
    ).toBeVisible({ timeout: 30_000 });
  });

  test('показывает форму входа', async ({ page }) => {
    await expect(
      page.getByText('Пожалуйста, авторизируйтесь'),
    ).toBeVisible();
    await expect(
      page.getByRole('textbox', { name: 'Логин' }),
    ).toBeVisible();
    await expect(
      page.locator('input[name="password"]'),
    ).toBeVisible();
    await expect(
      page.getByRole('checkbox', { name: /запомнить/i }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Войти' })).toBeVisible();
  });

  test('при пустой отправке показывает сообщение об ошибке', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Войти' }).click();
    await expect(page.getByRole('alert')).toContainText(/Введите/);
  });

  test('успешный вход ведёт на страницу товаров', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Логин' }).fill('emilys');
    await page.locator('input[name="password"]').fill('emilyspass');
    await page.getByRole('button', { name: 'Войти' }).click();

    await expect(page).toHaveURL(/\/products/);
    await expect(
      page.getByRole('heading', { name: 'Товары', level: 1 }),
    ).toBeVisible({ timeout: 30_000 });
  });
});
