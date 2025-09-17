import { Page, Locator } from 'playwright';


export class ModalCearCuentaPage {
    //Declaración de elementos
    readonly page: Page; 
    readonly tipoCuentaDropdown: Locator;
    readonly montoInput: Locator;
    readonly aceptarButton: Locator;
    readonly cancelarButton: Locator;

    //constructor inicializa los elementos
    constructor(page: Page) {
        this.page = page;
        this.tipoCuentaDropdown = page.getByRole('combobox', {name: 'Tipo de cuenta *' });
        this.montoInput = page.getByRole('spinbutton', {name: 'Monto inicial *' });
        this.aceptarButton = page.getByTestId('boton-crear-cuenta');
        this.cancelarButton = page.getByTestId('boton-cancelar-crear-cuenta');
    }

    async seleccionarTipoCuenta(tipoCuenta: string){
        await this.tipoCuentaDropdown.click();
        await this.page.getByRole('option', {name: tipoCuenta}).click();
    }

    async completarMonto(monto: string){
        await this.montoInput.fill(monto);
    }
}
