import { test, expect } from '@playwright/test';

test('TC-1 Verificación de elementos visuales en la página de registro', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.locator('input[name="firstName"]')).toBeVisible();
  await expect(page.locator('input[name="lastName"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.getByTestId('boton-registrarse')).toBeVisible();
});

test('TC-2 Verificar botón de rgistro está inhabilitado por defecto', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByTestId('boton-registrarse')).toBeDisabled();
});

test('TC-3 Verificar botón de rgistro se habilita al completar los campos obligatorios', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('input[name="firstName"]').fill('Lady');
  await page.locator('input[name="lastName"]').fill('Orozco');
  await page.locator('input[name="email"]').fill('mail@example.com');
  await page.locator('input[name="password"]').fill('pass123');
  await expect(page.getByTestId('boton-registrarse')).toBeEnabled();
});

test('TC-4 Verificar redireccionamiento a página de inicio de sesión al hacer click en Iniciar sesión', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByTestId('boton-login-header-signup').click();
  await expect(page).toHaveURL('http://localhost:3000/login');
  await page.waitForTimeout(5000);
});

test('TC-5 Verificar registro exitoso con datos válidos', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('input[name="firstName"]').fill('Lady');
  await page.locator('input[name="lastName"]').fill('Orozco');
  await page.locator('input[name="email"]').fill('mail' + Date.now().toString() + '@example.com');
  await page.locator('input[name="password"]').fill('pass123');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Registro exitoso')).toBeVisible();
});

test('TC-6 Verificar que un usuario no pueda registrarse con email ya existente', async ({ page }) => {
  const email = 'mail'+Date.now().toString()+'@example.com';
  await page.goto('http://localhost:3000/');
  await page.locator('input[name="firstName"]').fill('Lady');
  await page.locator('input[name="lastName"]').fill('Orozco');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill('pass123');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Registro exitoso')).toBeVisible();
  //
  await page.goto('http://localhost:3000/');
  await page.locator('input[name="firstName"]').fill('Lady');
  await page.locator('input[name="lastName"]').fill('Orozco');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill('pass123');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Email already in use')).toBeVisible();
  await expect(page.getByText('Registro exitoso')).not.toBeVisible();
});