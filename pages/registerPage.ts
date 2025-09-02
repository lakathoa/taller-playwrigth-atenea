import {Page , Locator} from '@playwright/test';

export class RegisterPage{ //export lo que quiere decir es que es una clas que se puede importar desde otro lado
    //Declaración de elementos
    readonly page: Page; //Vamos a generar una instancia del navegador
                         //readonly es el acceso que se le está dando a la variable es decir de solo lectura (no necesitamos sobreescribir page nunca)
                         //la variale se llama page y los dos puntos indica que es una variable de tipo Page(clase de palywright)
    readonly firstNameInput: Locator; 
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly registerButton: Locator;
    readonly loginButton: Locator;

    //constructor inicializa los elementos
    constructor(page: Page){
        this.page = page;
        this.firstNameInput = page.locator('input[name="firstName"]');
        this.lastNameInput = page.locator('input[name="lastName"]');
        this.emailInput = page.locator('input[name="email"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.registerButton = page.getByTestId('boton-registrarse');
        this.loginButton = page.getByTestId('boton-login-header-signup');
    }

    //LA IDEA PRINCIPAL ES que los métodos hagan cosas específicas, una cosa a la vez
    async visitarPaginaRegistro(){
        await this.page.goto('http://localhost:3000/');
    }

    /*async completarFormularioRegistro(firstName: string, lastName: string, email: string, password: string){
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
    }*/
    async completarFormularioRegistro(usuario:{nombre: string, apellido: string, email: string, contraseña: string}){
        await this.firstNameInput.fill(usuario.nombre);
        await this.lastNameInput.fill(usuario.apellido);
        await this.emailInput.fill(usuario.email);
        await this.passwordInput.fill(usuario.contraseña);
    }

    async hacerClickBotonRegistro(){
        await this.registerButton.click();
    }

    async hacerClickBotonLogin(){
        await this.loginButton.click();
    }

    /*async completarYHacerClickBotonRegistro(firstName: string, lastName: string, email: string, password: string){
        await this.completarFormularioRegistro(firstName, lastName, email, password);
        await this.hacerClickBotonRegistro();
    } */
    async completarYHacerClickBotonRegistro(usuario:{nombre: string, apellido: string, email: string, contraseña: string}){
        await this.completarFormularioRegistro(usuario);
        await this.hacerClickBotonRegistro();
    }
}