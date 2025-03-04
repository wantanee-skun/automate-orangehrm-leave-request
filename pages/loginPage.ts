import { Page, Browser, BrowserContext } from '@playwright/test';

export class LoginPage {
    private page: Page;
    private browser: Browser;
    private context: BrowserContext;
    
    constructor(page: Page) {
        this.page = page;
    }

    static async create(browser: Browser): Promise<LoginPage> {
        const context = await browser.newContext();
        const page = await context.newPage();
        return new LoginPage(page);
    }

    async navigate(url: string) {
        await this.page.goto(url);
    }

    async login(username: string, password: string) {
        await this.page.getByRole('textbox', { name: 'Username' }).fill(username);
        await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
        await this.page.getByRole('button', { name: 'Login' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async isLoggedIn_DashBoard(): Promise<boolean> {
        const headerText = await this.page.locator('header').textContent();
        return headerText !== null && headerText.includes('Dashboard');
    }

    async isLoggedIn_FirstName(firstname: string): Promise<boolean> {
        const firstnameText = await this.page.locator('//p[@class="oxd-userdropdown-name"]').textContent();
        return firstnameText !== null && firstnameText.includes(firstname);
    }

    async logout(firstname: string) {
        await this.page.getByRole('listitem').filter({ hasText: firstname }).locator('i').click();
        await this.page.getByRole('menuitem', { name: 'Logout' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async closePage() {
        await this.page.close();
    }
}
