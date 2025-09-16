import { test, expect, request } from '@playwright/test';
import { RegisterPage } from '../pages/registerPage';
import TestData from '../data/testData.json'

let registerPage: RegisterPage; //Toda la clase va a tener acceso a esta variable

test.beforeEach(async ({ page}) => {
  registerPage = new RegisterPage(page);
  await registerPage.visitarPaginaRegistro();
})

test('TC-1 Verificación de elementos visuales en la página de registro', async ({ page }) => {
  await expect(registerPage.firstNameInput).toBeVisible();
  await expect(registerPage.lastNameInput).toBeVisible();
  await expect(registerPage.emailInput).toBeVisible();
  await expect(registerPage.passwordInput).toBeVisible();
  await expect(registerPage.registerButton).toBeVisible();
});

test('TC-2 Verificar botón de rgistro está inhabilitado por defecto', async ({ page }) => {
  await expect(registerPage.registerButton).toBeDisabled();
});

test('TC-3 Verificar botón de rgistro se habilita al completar los campos obligatorios', async ({ page }) => {
  await registerPage.completarFormularioRegistro(TestData.usuarioValido);
  await expect(registerPage.registerButton).toBeEnabled();
});

test('TC-4 Verificar redireccionamiento a página de inicio de sesión al hacer click en Iniciar sesión', async ({ page }) => {
  await registerPage.hacerClickBotonLogin();
  await expect(page).toHaveURL('http://localhost:3000/login');
});

test('TC-5 Verificar registro exitoso con datos válidos', async ({ page }) => {
  test.step('Completar el formulario de registro con datos válidos', async() =>{
    const email = (TestData.usuarioValido.email.split('@')[0]) + Date.now().toString() + '@' + (TestData.usuarioValido.email.split('@')[1]);
    TestData.usuarioValido.email = email;
    await registerPage.completarFormularioRegistro(TestData.usuarioValido);
  });
  test.step('Hacer click en el botón de Registro', async() =>{
    await registerPage.hacerClickBotonRegistro();
  });
  await expect(page.getByText('Registro exitoso')).toBeVisible();
});

test('TC-6 Verificar que un usuario no pueda registrarse con email ya existente', async ({ page }) => {
  const email = (TestData.usuarioValido.email.split('@')[0]) + Date.now().toString() + '@' + (TestData.usuarioValido.email.split('@')[1]);
  TestData.usuarioValido.email = email;
  await registerPage.completarYHacerClickBotonRegistro(TestData.usuarioValido);
  await expect(page.getByText('Registro exitoso')).toBeVisible();
  //
  await registerPage.visitarPaginaRegistro();
  await registerPage.completarYHacerClickBotonRegistro(TestData.usuarioValido);
  await expect(page.getByText('Email already in use')).toBeVisible();
  await expect(page.getByText('Registro exitoso')).not.toBeVisible();
});

test('TC-15 Verificar registro exitoso con datos válidos verificando respuesta de la API', async ({ page }) => {
  test.step('Completar el formulario de registro con datos válidos', async() =>{
    const email = (TestData.usuarioValido.email.split('@')[0]) + Date.now().toString() + '@' + (TestData.usuarioValido.email.split('@')[1]);
    TestData.usuarioValido.email = email;
    await registerPage.completarFormularioRegistro(TestData.usuarioValido);
  });
  test.step('Hacer click en el botón de Registro', async() =>{
     //Vamos a verificr que la API de tipo post responde co un status 201
    const responsePromise = page.waitForResponse('http://localhost:4000/api/auth/signup'); // Este es un listener que espera que el request 
                                                                                          // se ejecute para después hacer algo específico
    await registerPage.hacerClickBotonRegistro();
    const response = await responsePromise; //Va a esperar a que se ejeute lo que está en la pimera cosnt (línea 65)
    const responseBody = await response.json();
    expect(response.status()).toBe(201);
    expect((await response.body()).toString()).toContain('token');//Línea 73 y 74 validan lo mismo de diferente manera
    expect(responseBody).toHaveProperty('token');//en esta valida que exista como tal la propiedad token
    expect(typeof responseBody.token).toBe('string');//nos valida que el valos de la llave token sea un string
    expect(responseBody).toHaveProperty('user');
    expect(responseBody.user).toEqual(expect.objectContaining({ //Va a validar lo que respondió con lo que tenemos en nuestro archivo de TestData
      id: expect.any(String),
      firstName: TestData.usuarioValido.nombre,
      lastName: TestData.usuarioValido.apellido,
      email: TestData.usuarioValido.email
    }));
  });
  await expect(page.getByText('Registro exitoso')).toBeVisible();
});

test('TC-16 Generar signup desde API', async ({ page, request }) => {
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
    expect(responseBody).toHaveProperty('token');//en esta valida que exista como tal la propiedad token
    expect(typeof responseBody.token).toBe('string');//nos valida que el valos de la llave token sea un string
    expect(responseBody).toHaveProperty('user');
    expect(responseBody.user).toEqual(expect.objectContaining({ //Va a validar lo que respondió con lo que tenemos en nuestro archivo de TestData
      id: expect.any(String),
      firstName: TestData.usuarioValido.nombre,
      lastName: TestData.usuarioValido.apellido,
      email: email
    }));
});

test('TC-17 Verificar comportamiento del front ante un error 500 en el registro', async ({ page, request }) => {
  const email = (TestData.usuarioValido.email.split('@')[0]) + Date.now().toString() + '@' + (TestData.usuarioValido.email.split('@')[1]);

  //Interceptar la solicitud de registro y devolcer un error 500
  await page.route('**/api/auth/signup', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({message: 'Internal Server Error'}),
    });
  });
  //Llnar el formulario. La navegación se hace en el beforeEach.
  await registerPage.firstNameInput.fill(TestData.usuarioValido.nombre); 
  await registerPage.lastNameInput.fill(TestData.usuarioValido.apellido);
  await registerPage.emailInput.fill(email);
  await registerPage.passwordInput.fill(TestData.usuarioValido.contraseña);

  //Hacer click en el botón de registro
  await registerPage.hacerClickBotonRegistro();

  //Verificar que se muestra un mensaje de error
  await expect(page.getByText('Internal Server Error')).toBeVisible();
});