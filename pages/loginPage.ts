import { Page, Locator } from 'playwright';


export class LoginPage {
    //Declaración de elementos
    readonly page: Page; //Vamos a generar una instancia del navegador


    //readonly es el acceso que se le está dando a la variable es decir de solo lectura (no necesitamos sobreescribir page nunca)
    //la variale se llama page y los dos puntos indica que es una variable de tipo Page(clase de palywright)
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    //constructor inicializa los elementos
    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('input[name="email"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.getByTestId('boton-login');
    }

    //LA IDEA PRINCIPAL ES que los métodos hagan cosas específicas, una cosa a la vez
    async visitarPaginaLogin() {
        await this.page.goto('http://localhost:3000/login');
    }

    async completarFormularioLogin(usuario: { email: string; contraseña: string; }) {
        await this.emailInput.fill(usuario.email);
        await this.passwordInput.fill(usuario.contraseña);
    }

    async hacerClickBotonLogin() {
        await this.loginButton.click();
    }

    async completarYHacerClickBotonLogin(usuario: { email: string; contraseña: string; }) {
        await this.completarFormularioLogin(usuario);
        await this.hacerClickBotonLogin();
    }
}
