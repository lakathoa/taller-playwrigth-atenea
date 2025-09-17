import { test as setup, expect, request } from "@playwright/test";
import { BackendUtils } from "../utils/backendUtils"; //crea usuarios a partir del BE
import TestData from '../data/testData.json'
import { LoginPage } from "../pages/loginPage";
import { DashboardPage } from "../pages/dashboardPage";
import { ModalCearCuentaPage } from "../pages/modalCrearCuenta";

let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let modalCrearCuenta: ModalCearCuentaPage;

const usuarioEnviaAuthFile = "playwrigth/.auth/usuarioEnvia.json";
const usuarioRecibeAuthFile = "playwrigth/.auth/usuarioRecibe.json";

setup.beforeEach(async({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    modalCrearCuenta = new ModalCearCuentaPage(page);
    await loginPage.visitarPaginaLogin();
})

setup("Generar usuario que envía dinero", async ({ page, request }) => {
  const nuevoUsuario = await BackendUtils.crearUsuarioPorAPI( request, TestData.usuarioValido);
  await loginPage.completarYHacerClickBotonLogin(nuevoUsuario);
  await dashboardPage.agregarCuentaButton.click();
  //await modalCrearCuenta.tipoCuentaDropdown.selectOption('Débito');//Método SelectOption sólo se utiliza para elementos de tipo dropdown o combobox
  await modalCrearCuenta.seleccionarTipoCuenta('Débito');
  await modalCrearCuenta.completarMonto('1000');
  await modalCrearCuenta.aceptarButton.click();
  await expect(page.getByText('Cuenta creada exitosamente')).toBeVisible();
  await page.context().storageState({ path: usuarioEnviaAuthFile});
});

setup("Loguearse con usuario que recibe dinero", async ({ page, request }) => {
  await loginPage.completarYHacerClickBotonLogin(TestData.usuarioValido);
  await expect(dashboardPage.dashboardTitle).toBeVisible();
  await dashboardPage.agregarCuentaButton.click();
  await modalCrearCuenta.seleccionarTipoCuenta('Débito');
  await modalCrearCuenta.completarMonto('100');
  await modalCrearCuenta.aceptarButton.click();
  await expect(page.getByText('Cuenta creada exitosamente')).toBeVisible();
  await page.context().storageState({ path: usuarioRecibeAuthFile});
});
