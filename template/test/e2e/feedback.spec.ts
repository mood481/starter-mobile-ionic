import { expect, test } from '@playwright/test';

test('shows a toast from the examples page', async ({ page }) => {
  await page.goto('/examples');
  await page.getByText('Mostrar aviso').click();
  await expect(page.locator('ion-toast')).toBeVisible();
  await expect(page.getByText('Este es un aviso de ejemplo.')).toBeVisible();
});

test('can cancel a confirmation without accepting it', async ({ page }) => {
  await page.goto('/examples');
  await page.getByText('Pedir confirmación').click();
  await expect(page.locator('ion-alert')).toBeVisible();
  await page.getByRole('button', { name: 'Cancelar' }).click();
  await expect(page.locator('ion-alert')).toBeHidden();
});
