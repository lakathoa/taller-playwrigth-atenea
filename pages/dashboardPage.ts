import { Page, Locator } from 'playwright';


export class DashboardPage {
    //Declaración de elementos
    readonly page: Page; 
    readonly dashboardTitle: Locator;

    //constructor inicializa los elementos
    constructor(page: Page) {
        this.page = page;
        this.dashboardTitle = page.getByTestId('titulo-dashboard');
    }

    //LA IDEA PRINCIPAL ES que los métodos hagan cosas específicas, una cosa a la vez
    async visitarPaginaDashboard() {
        await this.page.goto('http://localhost:3000/dashboard');
    }

}
