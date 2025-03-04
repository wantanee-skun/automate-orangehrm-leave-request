import { test, expect } from '@playwright/test';
import { readCSV } from '../utils/csvUtils';
import { readConfig } from '../utils/configUtils';

const config = readConfig();

test.describe('Create All Employee', () => {
    let testData: { id: string; emp: string; username: string; password: string; firstname: string; lastname: string; leavetype: string; entdays: string; }[] = [];
  
    test.beforeAll(async () => {
      testData = await readCSV(config.inputEmployee, () => true);
      console.log('Loaded Test Data:', testData); // Debugging step
    });
    
    test('Create All Employee from CSV', async ({ browser }) => {
      if (testData.length === 0) {
        throw new Error('No test data loaded from CSV!');
      }
      test.setTimeout(config.timeout);
      const context = await browser.newContext();
      const page = await context.newPage();
      
      await test.step(`Login Admin`, async () => {
        await page.goto(config.baseURL);

        // login with admin
        await page.getByRole('textbox', { name: 'Username' }).fill(config.adminUsername);
        await page.getByRole('textbox', { name: 'Password' }).fill(config.adminPassword);
        await page.getByRole('button', { name: 'Login' }).click();
        await page.waitForLoadState('networkidle');
        await expect(page.locator('header')).toContainText('Dashboard');
      });

      await test.step(`Reset Language and Locale`, async () => {
        // reset language and locale
        await page.getByRole('link', { name: 'Admin' }).click();
        await page.waitForLoadState('networkidle');
        await page.getByRole('listitem').filter({ hasText: 'Configuration' }).locator('i').click();
        await page.getByRole('menuitem', { name: 'Localization' }).click();
        await page.locator('form i').first().click();
        await page.getByRole('option', { name: 'English (United States)' }).click();
        await page.locator('form i').nth(1).click();
        await page.getByText('yyyy-mm-dd').first().click();
        await page.getByRole('button', { name: 'Save' }).click();
      });

      await test.step(`Reset Leave Period to start from 01 January`, async () => {
        // reset leave period to start from 01 January, (to avoid any issue that other are configure to other periods)
        await page.getByRole('link', { name: 'Leave' }).click();
        await page.waitForLoadState('networkidle');
        await page.getByRole('listitem').filter({ hasText: 'Configure' }).locator('i').click();
        await page.getByRole('menuitem', { name: 'Leave Period' }).click();
        await page.waitForLoadState('networkidle');

        await page.locator('form i').first().click();
        await page.getByRole('option', { name: 'January' }).click();
        await page.locator('form i').nth(1).click();
        await page.getByRole('option', { name: '01' }).click();

        await page.getByRole('button', { name: 'Save' }).click();
        await page.waitForLoadState('networkidle');
      });
  
      for (const { id, emp, username, password, firstname, lastname, leavetype, entdays } of testData) {
        await test.step(`Delete previous: ${username} (if found)`, async () => {
            ////////////////////////////////////
            // Delete previous Employee -- Start
            await page.getByRole('link', { name: 'PIM' }).click();
            await page.waitForLoadState('networkidle');
            await page.getByRole('textbox').nth(2).fill(emp);
            await page.getByRole('button', { name: 'Search' }).click();
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            const empLocator = page.locator(`//div[@role='table']//*[contains(text(),'${emp}')]`);

            if (await empLocator.count() > 0) 
            {
              console.log(emp + " is found");
              await page.locator('//i[@class="oxd-icon bi-trash"]').first().click();
              // Wait for confirmation modal to appear
              await page.waitForSelector("//button[contains(., 'Yes, Delete')]", { timeout: 5000 });
              await page.getByRole('button').filter({ hasText: 'Yes, Delete' }).click();
              await page.waitForLoadState('networkidle');
            }
            else {
              console.log(emp + " is not found");
            }
        });
                
        await test.step(`Create username: ${username}`, async () => {        
            ///////////////////////////////
            // Create New Employee -- Start
            await page.getByRole('link', { name: 'PIM' }).click();
            await page.waitForLoadState('networkidle');
            await page.getByRole('link', { name: 'Add Employee' }).click();
            await page.waitForLoadState('networkidle');

            await page.getByRole('textbox', { name: 'First Name' }).fill(firstname);
            await page.getByRole('textbox', { name: 'Last Name' }).fill(lastname);
            await page.locator('//label[contains(text(),"Employee Id")]/../..//input').fill(emp);

            await page.locator('form span').click();
            
            await page.locator('//label[text()="Username"]/../../*/input').fill(username);
            await page.locator('input[type="password"]').first().fill(password);  // =  (//input[@type='password'])[1]
            await page.locator('input[type="password"]').nth(1).fill(password);   // =  (//input[@type='password'])[2]
            await page.getByRole('button', { name: 'Save' }).click();
            await page.waitForLoadState('networkidle');
            
            const header_emp_name = page.locator('.orangehrm-edit-employee-name');
            await page.waitForSelector('.orangehrm-edit-employee-name');
            await expect(page.locator('.orangehrm-edit-employee-name h6')).toContainText(firstname);
                          
            // Create New Employee -- End
            ///////////////////////////////
        });

        await test.step(`Add Entitlement for user: ${username}, with: ${entdays} days for leave type: ${leavetype}`, async () => {  
            ///////////////////////////////
            // Add Entitlement -- Start
            await page.getByRole('link', { name: 'Leave' }).click();
            await page.waitForLoadState('networkidle');
            
            await page.getByRole('listitem').filter({ hasText: 'Entitlements' }).locator('i').click();
            await page.getByRole('menuitem', { name: 'Add Entitlements' }).click();
            await page.getByRole('textbox', { name: 'Type for hints...' }).fill(firstname + ' ' + lastname);
            await page.waitForLoadState('networkidle');
            await page.getByRole('option', { name: firstname + ' ' + lastname }).click();
        
            await page.locator('//label[contains(text(),"Leave Type")]/../..//i').click();
            await page.getByText(leavetype).click();
            
            await page.locator('//label[contains(text(),"Entitlement")]/../..//input').fill(entdays);
            
            await page.getByRole('button', { name: 'Save' }).click();
            await page.waitForLoadState('networkidle');
            
            await expect(page.getByRole('dialog')).toContainText('Updating Entitlement');
            await expect(page.getByRole('dialog')).toContainText('Confirm');
            await page.getByRole('button', { name: 'Confirm' }).click();
            await page.waitForLoadState('networkidle');

            await page.waitForSelector(`//div[@role='table']//*[contains(text(),'${leavetype}')]`);

            await expect(page.getByRole('table')).toContainText(leavetype);
            await expect(page.getByRole('table')).toContainText(entdays);
            
            // Add Entitlement -- End
            ///////////////////////////////

        });
      }

      await page.close();

    });
  });
