import { Page, Browser } from '@playwright/test';
import { LoginPage } from './LoginPage';

export class LeavePage {
    private page: Page;
    private browser: Browser;
    private loginPage: LoginPage;
    private emp: string;
    private username: string;
    private password: string;
    private firstname: string;
    private lastname: string;
    private leavetype: string;
    private entdays: string;
    public remainingdays: number;

    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
    }

    static async create(browser: Browser): Promise<LeavePage> {
            const context = await browser.newContext();
            const page = await context.newPage();
            return new LeavePage(page);
    }

    async init(emp: string, username: string, password: string, firstname: string, lastname: string, leavetype: string, entdays: string) {
        this.emp = emp;
        this.username = username;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
        this.leavetype = leavetype;
        this.entdays = entdays;
        this.remainingdays = parseFloat(entdays);
    }

    async loginThisUser(url: string) {
        await this.loginPage.navigate(url);
        await this.loginPage.login(this.username,this.password);
        await this.page.waitForLoadState('networkidle');
        await this.loginPage.isLoggedIn_FirstName(this.firstname);
    }

    async navigateToLeavePage() {
        await this.page.getByRole('link', { name: 'Leave' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async submitLeaveSingle(fromdate: string, todate: string, duration: string, requestamount: number): Promise<boolean>{
        
        await this.page.getByRole('link', { name: 'Apply' }).click();        
        await this.page.waitForLoadState('networkidle');

        await this.page.locator('form i').first().click();
        await this.page.getByRole('option', { name: this.leavetype }).click();
        await this.page.waitForTimeout(1000);

        // *** get remaining days to assign to remainingday variable
        const remainDaysText = await this.page.locator('//label[contains(text(),"Leave Balance")]/../..//p').textContent();

        // also check to be sure that it is not null
        const cleanedText = remainDaysText ? remainDaysText.trim().replace(/[^0-9.]/g, "") : "0";        
        this.remainingdays = parseFloat(cleanedText) - requestamount;
        console.log(`Leave Balance: ${this.remainingdays}`); 
        
        await this.page.getByRole('textbox', { name: 'yyyy-mm-dd' }).first().click();
        await this.page.getByRole('textbox', { name: 'yyyy-mm-dd' }).first().fill(fromdate);
        await this.page.getByRole('textbox', { name: 'yyyy-mm-dd' }).nth(1).click();
        await this.page.getByRole('textbox', { name: 'yyyy-mm-dd' }).nth(1).fill(todate);

        if (duration === 'Full Day') {
            await this.page.locator('div').filter({ hasText: duration }).nth(2).click();
        }
        else {
            await this.page.locator('div').filter({ hasText: /^Full Day$/ }).nth(2).click();
            await this.page.getByRole('option', { name: duration }).click();
        }
        // await this.page.getByRole('option', { name: duration }).first().click();
        await this.page.getByRole('button', { name: 'Apply' }).click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);

        return await this.page.waitForFunction(
            () => document.body.innerText.includes('Success'),
            { timeout: 5000 }
        ).then(() => true).catch(() => false);

    }

    async submitLeaveRange(fromdate: string, todate: string, duration: string, requestamount: number): Promise<boolean>{
        
        await this.page.getByRole('link', { name: 'Apply' }).click();        
        await this.page.waitForLoadState('networkidle');

        await this.page.locator('form i').first().click();
        await this.page.getByRole('option', { name: this.leavetype }).click();
        await this.page.waitForTimeout(1000);

        // *** get remaining days to assign to remainingday variable
        const remainDaysText = await this.page.locator('//label[contains(text(),"Leave Balance")]/../..//p').textContent();

        // also check to be sure that it is not null
        const cleanedText = remainDaysText ? remainDaysText.trim().replace(/[^0-9.]/g, "") : "0";        
        this.remainingdays = parseFloat(cleanedText) - requestamount;
        console.log(`Leave Balance (from Submit Page): ${this.remainingdays}`); 
        
        await this.page.getByRole('textbox', { name: 'yyyy-mm-dd' }).first().click();
        await this.page.getByRole('textbox', { name: 'yyyy-mm-dd' }).first().fill(fromdate);
        await this.page.getByRole('textbox', { name: 'yyyy-mm-dd' }).nth(1).press('Tab');
        await this.page.getByRole('textbox', { name: 'yyyy-mm-dd' }).nth(1).click();
        await this.page.getByRole('textbox', { name: 'yyyy-mm-dd' }).nth(1).fill(todate);
        await this.page.getByRole('textbox', { name: 'yyyy-mm-dd' }).nth(1).press('Tab');

        // await this.page.pause();

        if (duration !== 'All Days') {
            // await this.page.locator('form i').nth(4).click();
            await this.page.locator('//label[contains(text(),"Partial Days")]/../..//div[@class="oxd-select-text-input"]').click();
            await this.page.getByText(duration).click();

            if (duration === 'Start Day Only')
            {                
                await this.page.locator('//label[contains(text(),"Start Day")]/../..//div[@class="oxd-select-text-input"]').click();
                await this.page.getByText('Half Day - Afternoon').click();
            }
            else if (duration === 'End Day Only')
            {
                await this.page.locator('//label[contains(text(),"End Day")]/../..//div[@class="oxd-select-text-input"]').click();
                await this.page.getByText('Half Day - Morning').click();
            }
            else if (duration === 'Start and End Day')
            {
                await this.page.locator('//label[contains(text(),"Start Day")]/../..//div[@class="oxd-select-text-input"]').click();
                await this.page.getByText('Half Day - Afternoon').click();
                await this.page.locator('//label[contains(text(),"End Day")]/../..//div[@class="oxd-select-text-input"]').click();
                await this.page.getByText('Half Day - Morning').click();
            }        
            
        }

        // await this.page.getByRole('option', { name: duration }).first().click();
        await this.page.getByRole('button', { name: 'Apply' }).click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);

        return await this.page.waitForFunction(
            () => document.body.innerText.includes('Success'),
            { timeout: 5000 }
        ).then(() => true).catch(() => false);

    }

    async verifyLeaveSubmission(fromdate: string, todate: string, duration: string, singlerange: string, requestamount: number): Promise<boolean>{
        await this.page.getByRole('link', { name: 'My Leave' }).click();        
        await this.page.waitForLoadState('networkidle');

        await this.page.getByRole('textbox', { name: 'yyyy-mm-dd' }).first().click();
        await this.page.getByRole('textbox', { name: 'yyyy-mm-dd' }).first().fill(fromdate);
        await this.page.getByRole('textbox', { name: 'yyyy-mm-dd' }).first().press('Tab');
        await this.page.getByRole('textbox', { name: 'yyyy-mm-dd' }).nth(1).click();
        await this.page.getByRole('textbox', { name: 'yyyy-mm-dd' }).nth(1).fill(todate);
        await this.page.getByRole('textbox', { name: 'yyyy-mm-dd' }).nth(1).press('Tab');

        // Just to select all status, to avoid issue of share environment usage.
        await this.page.locator('.oxd-select-text--after > .oxd-icon').first().click();
        await this.page.getByRole('option', { name: 'Rejected' }).click();
        await this.page.locator('.oxd-select-text--after > .oxd-icon').first().click();
        await this.page.getByRole('option', { name: 'Cancelled' }).locator('span').click();
        await this.page.locator('.oxd-select-text--after > .oxd-icon').first().click();
        await this.page.getByRole('option', { name: 'Pending Approval' }).locator('span').click();
        await this.page.locator('.oxd-select-text--after > .oxd-icon').first().click();
        await this.page.getByRole('option', { name: 'Scheduled' }).click();
        await this.page.locator('.oxd-select-text--after > .oxd-icon').first().click();
        await this.page.getByRole('option', { name: 'Taken' }).click();
        await this.page.locator('.oxd-select-wrapper > .oxd-select-text > .oxd-select-text--after > .oxd-icon').click();
        await this.page.getByRole('option', { name: 'US - Vacation' }).click();
        await this.page.getByRole('button', { name: 'Search' }).click();
        await this.page.waitForLoadState('networkidle');

        await this.page.waitForTimeout(2000);

        // await this.page.pause();

        const isValid = await this.validateLeaveDetails(fromdate, todate, duration, singlerange, requestamount);
        console.log(isValid ? 'Leave details are correct' : 'Leave details validation failed!');
        console.log('--------------------------');
            
        return isValid;
        
    }

    async validateLeaveDetails(fromdate: string, todate: string, duration: string, singlerange: string, requestamount: number): Promise<boolean> {
        try {
            const elementIndices = [2, 3, 4, 5, 6]; // Table cell indices
            const locators = elementIndices.map(idx => this.page.locator(`(//div[@role="cell"])[${idx}]`));
    
            // Fetch visibility and text content in parallel
            const elementsVisible = await Promise.all(locators.map(async (locator) => await locator.isVisible()));
            const elementsText = await Promise.all(
                locators.map(async (locator, index) => elementsVisible[index] ? await locator.textContent() : null)
            );
    
            const [checkDate, checkEmpName, checkLeaveType, checkLeaveBalance, checkLeaveDays] = elementsText;
    
            // Debugging logs
            console.log(`checkDate: ${checkDate}`);
            console.log(`checkEmpName: ${checkEmpName}`);
            console.log(`checkLeaveType: ${checkLeaveType}`);
            console.log(`checkLeaveBalance: ${checkLeaveBalance}`);
            console.log(`checkLeaveDays: ${checkLeaveDays}`);
    
            // Ensure no null/undefined values before trimming
            const empName = checkEmpName?.trim() ?? '';
            const leaveType = checkLeaveType?.trim() ?? '';            
            const dateValue = checkDate?.trim() ?? '';
    
            // Extract and convert leave balance safely
            const leaveBalanceTxt = checkLeaveBalance?.trim()?.replace(/[^0-9.]/g, "") ?? "0";
            const leaveBalance = parseFloat(leaveBalanceTxt);

            // Extract and convert leave days safely
            const leaveDaysTxt = checkLeaveDays?.trim()?.replace(/[^0-9.]/g, "") ?? "0";
            const leaveDays = parseFloat(leaveDaysTxt);
    
            // Validation checks
            if (empName !== `${this.firstname}  ${this.lastname}`) return false;
            if (leaveType !== this.leavetype) return false;
            if (this.remainingdays !== leaveBalance) return false;
            if (leaveDays !== requestamount) return false;

            if (duration === 'Full Day') {
                if (dateValue !== fromdate) return false;
            } else {
                if (!dateValue.includes(fromdate)) return false;
                if (!dateValue.includes(todate)) return false;
            }

            return true; 
    
        } catch (error) {
            console.error(`Error : ${error.message}`);
            return false;
        }
    }

    async logoutThisUser() {
        // await this.page.pause();
        await this.loginPage.logout(this.firstname);
    }

    async closePage() {
        await this.loginPage.closePage();
    }

}
