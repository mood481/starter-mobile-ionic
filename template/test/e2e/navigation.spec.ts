import { expect, test } from '@playwright/test';

test('navigates from the home screen to the examples and back', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Aplicación preparada' })).toBeVisible();
  await page.getByText('Ver ejemplos').click();
  await expect(page.locator('ion-title').filter({ hasText: 'Ejemplos' })).toBeVisible();
  await expect(page.getByText('Mensajes y confirmaciones')).toBeVisible();

  await page.locator('ion-back-button').click();
  await expect(page.getByRole('heading', { name: 'Aplicación preparada' })).toBeVisible();
});
