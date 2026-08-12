import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('completes MFA, enforces accessible dialog behavior, and edits a resource', async ({
  page,
}) => {
  await page.goto('/dashboard');

  await expect(
    page.getByRole('heading', { name: 'Sign in to your account' }),
  ).toBeVisible();

  await page.getByRole('button', { name: /read\/write account/i }).click();
  await page.getByRole('button', { name: /continue securely/i }).click();

  await expect(page).toHaveURL(/\/verify$/);
  await page.getByLabel('Verification code').fill('123456');
  await page.getByRole('button', { name: /verify and continue/i }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText('Read / write', { exact: true })).toBeVisible();

  const editButton = page.getByRole('button', { name: 'Edit Production Core' });
  await editButton.click();

  const dialog = page.getByRole('dialog', { name: 'Edit network' });
  const nameInput = page.getByLabel('Network name');
  const closeButton = dialog.getByRole('button', { name: 'Close' });
  const saveButton = dialog.getByRole('button', { name: 'Save changes' });

  await expect(dialog).toBeVisible();
  await expect(nameInput).toBeFocused();

  await page.keyboard.press('Shift+Tab');
  await expect(closeButton).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(saveButton).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(editButton).toBeFocused();

  await editButton.click();
  await nameInput.fill('Production Edge');
  await dialog.getByRole('button', { name: 'Save changes' }).click();

  await expect(page.getByText('Production Edge', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Network resource updated successfully.'),
  ).toBeVisible();

  const accessibilityScan = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScan.violations).toEqual([]);
});
