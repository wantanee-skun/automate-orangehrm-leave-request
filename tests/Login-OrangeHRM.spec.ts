import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { readCSV } from '../utils/csvUtils';
import { readConfig } from '../utils/configUtils';

const config = readConfig();

test.describe('TC-00 : Admin Login', () => {
  test('TC-00 : Verify Admin login with valid credentials', async ({ browser }) => {
      const loginPage = await LoginPage.create(browser);
      await loginPage.navigate(config.baseURL);
      await loginPage.login(config.adminUsername, config.adminPassword);
      expect(await loginPage.isLoggedIn_DashBoard()).toBe(true);
      await loginPage.closePage();
  });
});

// Before running TC-01, employee should be created first
// To prepare data, Run "npx playwright test --project=prepare-data-chromium"
test.describe('TC-01 : Employee Login', () => {
  let testData: { id: string; emp: string; username: string; password: string; firstname: string; lastname: string; leavetype: string; entdays: string;  }[] = [];

  // Loading input data from CSV file
  test.beforeAll(async () => {
    testData = await readCSV(config.inputEmployee, () => true);
    console.log('Loaded Test Data:', testData); // Debugging step
  });

  test('TC-01 : Verify employee login with valid credentials', async ({ browser }) => {
      if (testData.length === 0) {
        throw new Error('No test data loaded from CSV!');
      }
      test.setTimeout(config.timeout);

      const loginPage = await LoginPage.create(browser);

      // Test iterate data csv
      for (const { id, emp, username, password, firstname, lastname, leavetype, entdays } of testData) {
        await test.step(`Login with user: ${username}`, async () => {          
          await loginPage.navigate(config.baseURL);
          await loginPage.login(username, password);
          expect(await loginPage.isLoggedIn_FirstName(firstname)).toBe(true);
          await loginPage.logout(firstname);          
        });
      }

      await loginPage.closePage();

  });
});

