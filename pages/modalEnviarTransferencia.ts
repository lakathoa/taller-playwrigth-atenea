import { Page, Locator } from 'playwright';
import TestData from '../data/testData.json'


export class ModalEnviarTransferenciaPage {
    //Declaración de elementos
    readonly page: Page; 
    readonly emailDestinatarioInput: Locator;
    readonly cuentaOrigenDropdown: Locator;
    readonly montoInput: Locator;
    readonly enviarButton: Locator;
    readonly cancelarButton: Locator;
    readonly cuentaOrigenOption: Locator;

    //constructor inicializa los elementos
    constructor(page: Page) {
        this.page = page;
        this.emailDestinatarioInput = page.getByRole('textbox', {name: 'Email del destinatario *'})
        this.cuentaOrigenDropdown = page.getByRole('combobox', {name: 'Cuenta origen *' });
        this.montoInput = page.getByRole('spinbutton', {name: 'Monto a enviar *' });
        this.enviarButton = page.getByRole('button', {name: 'Enviar'});
        this.cancelarButton = page.getByRole('button', {name: 'Cancelar'});
        this.cuentaOrigenOption = page.getByRole('option', { name: '••••' });
    }

    async completarYHacerClickBotonEnviar(emailDestinatario: string, monto: string) {
        await this.emailDestinatarioInput.fill(emailDestinatario);
        await this.cuentaOrigenDropdown.click();
        await this.cuentaOrigenOption.click();
        await this.montoInput.fill(monto);
        await this.enviarButton.click();
    }

}
