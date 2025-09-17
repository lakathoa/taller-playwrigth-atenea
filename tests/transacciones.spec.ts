import {test, expect} from '@playwright/test';
import { DashboardPage } from '../pages/dashboardPage';
import { ModalEnviarTransferenciaPage } from '../pages/modalEnviarTransferencia';
import TestData from '../data/testData.json'

let dashboardPage: DashboardPage;
let modalEnviarTransferenciaPage: ModalEnviarTransferenciaPage;

const testUsuarioEnvia = test.extend({
    storageState: require.resolve('../playwrigth/.auth/usuarioEnvia.json') //empieza a ejecutar casos de prueba con los datos del usuario que envía
})

const testUsuarioRecibe = test.extend({
    storageState: require.resolve('../playwrigth/.auth/usuarioRecibe.json') //empieza a ejecutar casos de prueba con los datos del usuario que recibe
})

test.beforeEach(async({ page }) => {
    dashboardPage = new DashboardPage(page);
    modalEnviarTransferenciaPage = new ModalEnviarTransferenciaPage(page);
    await dashboardPage.visitarPaginaDashboard();
})

testUsuarioEnvia('TC-21 Verificar transacción exitosa', async({ page })=> {
    await expect(dashboardPage.dashboardTitle).toBeVisible();
    await dashboardPage.enviarDineroButton.click();
    await modalEnviarTransferenciaPage.completarYHacerClickBotonEnviar(TestData.usuarioValido.email, '100')
    await expect(page.getByText('Transferencia enviada a '+ TestData.usuarioValido.email)).toBeVisible();
})

testUsuarioRecibe('TC-22 Verificar que el usuario reciba la transferencia', async({ page })=> {
    await expect(dashboardPage.dashboardTitle).toBeVisible();
    await expect(page.getByText('Transferencia de email').first()).toBeVisible();
})