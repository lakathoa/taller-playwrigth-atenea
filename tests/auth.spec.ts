import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';
import TestData from '../data/testData.json'

let loginPage: LoginPage; //Toda la clase va a tener acceso a esta variable
let dashboardPage: DashboardPage;

test.beforeEach(async ({ page}) => {
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  await loginPage.visitarPaginaLogin();
})

test('TC-8 Verificar login exitoso y redireccionamiento al Dashboard', async ({ page }) => {
    test.step('Completar el formulario de login con datos válidos', async() =>{
        await loginPage.completarYHacerClickBotonLogin(TestData.usuarioValido);
    });
    test.step('Validar mensaje de inicio de sesión exitoso', async() =>{
        await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible();
    });
    test.step('Validar que redireccion al usuario a la pantalla del Dashboard y que tenga un título', async() =>{
        await expect(page).toHaveURL('http://localhost:3000/dashboard');
        await expect(dashboardPage.dashboardTitle).toBeVisible();
    });
});

test('TC-9 Verificar login no exitoso por credenciales no válidas', async ({ page }) => {
    const passWrong = "passWrong";
    TestData.usuarioValido.contraseña = passWrong;
    await loginPage.completarYHacerClickBotonLogin(TestData.usuarioValido);
    await expect(page.getByText('Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL('http://localhost:3000/login');
});
test('TC-10 Verificar intento de login con campos vacíos', async ({ page }) => {
    await loginPage.hacerClickBotonLogin();
    const mensajeEmail = await page.$eval('input[type="email"]', (el: HTMLInputElement) => el.validationMessage);
    expect(mensajeEmail).toBe('Please fill out this field.');
    await expect(page).toHaveURL('http://localhost:3000/login');
});
test('TC-11 Verificar login no exitoso por no diligenciar contraseña', async ({ page }) => {
    const passEmpty = "";
    const mensajePassword = await page.$eval('input[type="password"]', (el: HTMLInputElement) => el.validationMessage);
    TestData.usuarioValido.contraseña = passEmpty;
    await loginPage.completarYHacerClickBotonLogin(TestData.usuarioValido);
    expect(mensajePassword).toBe('Please fill out this field.');
    await expect(page).toHaveURL('http://localhost:3000/login');
});
test('TC-12 Verificar login no exitoso por email sin formato correcto', async ({ page }) => {
    const emailWrong = (TestData.usuarioValido.email.split('@')[0])+(TestData.usuarioValido.email.split('@')[1]);
    TestData.usuarioValido.email = emailWrong;
    await loginPage.completarYHacerClickBotonLogin(TestData.usuarioValido);
    const esInvalido = await page.$eval('input[type="email"]', (el: HTMLInputElement) => el.validity.valid === false);
    expect(esInvalido).toBeTruthy();
    await expect(page).toHaveURL('http://localhost:3000/login');
});
test('TC-13 Verificar redireccionamiento a página de registro', async ({ page }) => {
    await loginPage.hacerClickLinkRegistrarse();
    await expect(page).toHaveURL('http://localhost:3000/signup');
});
test('TC-14 Verificar cierre de sesión exitoso y protección de rutas', async ({ page }) => {
    await loginPage.completarYHacerClickBotonLogin(TestData.usuarioValido);
    await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible();
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    //Cierre de sesión
    await dashboardPage.hacerClickCerrarSesion();
    await expect(page.getByText('Sesión cerrada correctamente')).toBeVisible();
    await expect(page).toHaveURL('http://localhost:3000/login');
    //Intentar ingresar al dashboard
    await dashboardPage.visitarPaginaDashboard();
    await expect(page).toHaveURL('http://localhost:3000/login');
});



