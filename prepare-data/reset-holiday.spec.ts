import { test, expect } from '@playwright/test';
import { readConfig } from '../utils/configUtils';

const config = readConfig();

test.describe('Remove all Holiday', () => {

    test('test', async ({ page }) => {
        test.setTimeout(config.timeout);

        await test.step(`Login Admin`, async () => {
            await page.goto(config.baseURL);

            // login with admin
            await page.getByRole('textbox', { name: 'Username' }).fill(config.adminUsername);
            await page.getByRole('textbox', { name: 'Password' }).fill(config.adminPassword);
            await page.getByRole('button', { name: 'Login' }).click();
            await page.waitForLoadState('networkidle');
            await expect(page.locator('header')).toContainText('Dashboard');
        });

        await test.step('Reset Holiday (if needed)', async () => {
            await page.getByRole('link', { name: 'Leave' }).click();
            await page.waitForLoadState('networkidle');
            await page.getByRole('listitem').filter({ hasText: 'Configure' }).locator('i').click();
            await page.getByRole('menuitem', { name: 'Holidays' }).click();
            await page.waitForLoadState('networkidle');

            const appLocator = await page.locator('#app').textContent();

            if (!(appLocator && appLocator.includes("No Records Found")))
            {
                // check box at header to select all rows
                await page.locator('//div[@role="columnheader"]//label').click();
                await page.waitForLoadState('networkidle');

                await page.waitForSelector("//button[contains(., 'Delete Selected')]", { timeout: 5000 });
                await page.locator("//button[contains(., 'Delete Selected')]").click();

                // Wait for confirmation modal to appear
                await page.waitForSelector("//button[contains(., 'Yes, Delete')]", { timeout: 5000 });
                await page.getByRole('button').filter({ hasText: 'Yes, Delete' }).click();
                await page.waitForLoadState('networkidle');

                await page.waitForTimeout(3000);

            }
                

        });
    });
});