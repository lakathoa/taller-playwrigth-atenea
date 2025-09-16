import { test, expect, request } from '@playwright/test';
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

test('TC-7 Verificar login exitoso y redireccionamiento al Dashboard', async ({ page }) => {
  await loginPage.completarYHacerClickBotonLogin(TestData.usuarioValido);
  await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible();
  await expect(dashboardPage.dashboardTitle).toBeVisible();
});

test('TC-18 Loguearse con un nuevo usuario creado por BE', async ({ page, request }) => {
  const email = (TestData.usuarioValido.email.split('@')[0]) + Date.now().toString() + '@' + (TestData.usuarioValido.email.split('@')[1]);
  const response = await request.post('http://localhost:4000/api/auth/signup',{
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'content-type': 'application/json'
    },
    data: {
      firstName: TestData.usuarioValido.nombre,
      lastName: TestData.usuarioValido.apellido,
      email: email,
      password: TestData.usuarioValido.contraseña
    }
  });
  const responseBody = await response.json();
  expect(response.status()).toBe(201);
  await loginPage.completarYHacerClickBotonLogin({email: email, contraseña:TestData.usuarioValido.contraseña});
  await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible();
  await expect(dashboardPage.dashboardTitle).toBeVisible();
});

test('TC-19 Loguearse con un nuevo usuario creado por BE y validar response', async ({ page, request }) => {
  const email = (TestData.usuarioValido.email.split('@')[0]) + Date.now().toString() + '@' + (TestData.usuarioValido.email.split('@')[1]);
  const response = await request.post('http://localhost:4000/api/auth/signup',{
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'content-type': 'application/json'
    },
    data: {
      firstName: TestData.usuarioValido.nombre,
      lastName: TestData.usuarioValido.apellido,
      email: email,
      password: TestData.usuarioValido.contraseña
    }
  });
  expect(response.status()).toBe(201);

  const responsePromiseLogin = page.waitForResponse('http://localhost:4000/api/auth/login');
  await loginPage.completarYHacerClickBotonLogin({email: email, contraseña:TestData.usuarioValido.contraseña});
  
  const responseLogin = await responsePromiseLogin;//esperando la respuesta del request de la línea 58
  const responseBodyLoginJson = await responseLogin.json();//guardamos la respuesta del request

  expect(responseLogin.status()).toBe(200);
  expect(responseBodyLoginJson).toHaveProperty('token');//en esta valida que exista como tal la propiedad token
  expect(typeof responseBodyLoginJson.token).toBe('string');//nos valida que el valos de la llave token sea un string
  expect(responseBodyLoginJson).toHaveProperty('user');
  expect(responseBodyLoginJson.user).toEqual(expect.objectContaining({ //Va a validar lo que respondió con lo que tenemos en nuestro archivo de TestData
      id: expect.any(String),
      firstName: TestData.usuarioValido.nombre,
      lastName: TestData.usuarioValido.apellido,
      email: email
    }));

  await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible();
  await expect(dashboardPage.dashboardTitle).toBeVisible();
});