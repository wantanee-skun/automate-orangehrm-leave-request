import { test, expect } from '@playwright/test';
// import { LoginPage } from '../pages/LoginPage';
import { readCSV, readCSV_leaveDate } from '../utils/csvUtils';
import { LeavePage } from '../pages/leavePage';
import { readConfig } from '../utils/configUtils';

const config = readConfig();

// Before running TC-02, employee should be created first
// To prepare data, Run "npx playwright test --project=prepare-data-chromium"
test.describe('TC-02 : Create and Verify Leave Request - Single Day', () => {
    let testData_employee: { id: string; emp: string; username: string; password: string; firstname: string; lastname: string; leavetype: string; entdays: string; }[] = [];
    let testData_leaveDate: { id: string; fromdate: string, todate: string; singlerange: string, duration: string, requestamount: string }[] = [];
  
    // Loading input data from CSV file
    test.beforeAll(async () => {
        testData_employee = await readCSV(config.inputEmployee, (row) => row.emp === 'TC-02');
        console.log('Loaded Test Data Employee:', testData_employee); // Debugging step

        testData_leaveDate = await readCSV_leaveDate(config.inputLeave, (row_leave) => row_leave.singlerange === 'Single');
        console.log('Loaded Test Data Single Day:', testData_leaveDate); // Debugging step

    });

    test('Verify submit leave request (Single Day) and View leave list', async ({ browser }) => {
        if (testData_employee.length === 0 || testData_leaveDate.length === 0) {
          throw new Error('No test data loaded from CSV!');
        }
        test.setTimeout(config.timeout);
  
        const leavePage = await LeavePage.create(browser);

        // Test iterate data csv
        for (const { id, emp, username, password, firstname, lastname, leavetype, entdays } of testData_employee) {
            await test.step(`Login with username: ${username} and navigate to Leave page`, async () => {            
                await leavePage.init(emp,username,password,firstname,lastname,leavetype,entdays);
                await leavePage.loginThisUser(config.baseURL);
                await leavePage.navigateToLeavePage();
            });         

            for (const {id,fromdate,todate,singlerange,duration,requestamount} of testData_leaveDate ) {
                await test.step(`Submit Leave from ${fromdate} to ${todate} in duration: ${duration}`, async () => {
                    expect(await leavePage.submitLeaveSingle(fromdate,todate,duration,parseFloat(requestamount))).toBe(true);
                });

                await test.step(`Validate My Leave, from ${fromdate}, to ${todate} in duration: ${duration} with request leave: ${requestamount} day`, async () => {
                    expect(await leavePage.verifyLeaveSubmission(fromdate,todate,duration,singlerange,parseFloat(requestamount))).toBe(true);
                });
            }
                        
            await test.step(`Logout with username: ${username}, firstname: ${firstname}`, async () => {    
                await leavePage.logoutThisUser();
            });
            
        }

        await leavePage.closePage();

    });    

});

// Before running TC-03, employee should be created first
// To prepare data, Run "npx playwright test --project=prepare-data-chromium"
test.describe('TC-03 : Create and Verify Leave Request - Days Range', () => {
    let testData_employee: { id: string; emp: string; username: string; password: string; firstname: string; lastname: string; leavetype: string; entdays: string; }[] = [];
    let testData_leaveDate: { id: string; fromdate: string, todate: string; singlerange: string, duration: string, requestamount: string }[] = [];
  
    // Loading input data from CSV file
    test.beforeAll(async () => {
        testData_employee = await readCSV(config.inputEmployee, (row) => row.emp === 'TC-03');
        console.log('Loaded Test Data Employee:', testData_employee); // Debugging step

        testData_leaveDate = await readCSV_leaveDate(config.inputLeave, (row_leave) => row_leave.singlerange === 'Range');
        console.log('Loaded Test Data Days Range:', testData_leaveDate); // Debugging step

    });

    test('Verify submit leave request (Days Range) and View leave list', async ({ browser }) => {
        if (testData_employee.length === 0 || testData_leaveDate.length === 0) {
          throw new Error('No test data loaded from CSV!');
        }
        test.setTimeout(config.timeout);
  
        const leavePage = await LeavePage.create(browser);

        // Test iterate data csv
        for (const { id, emp, username, password, firstname, lastname, leavetype, entdays } of testData_employee) {
            await test.step(`Login with username: ${username} and navigate to Leave page`, async () => {            
                await leavePage.init(emp,username,password,firstname,lastname,leavetype,entdays);
                await leavePage.loginThisUser(config.baseURL);
                await leavePage.navigateToLeavePage();
            });         

            for (const {id,fromdate,todate,singlerange,duration,requestamount} of testData_leaveDate ) {
                await test.step(`Submit Leave from ${fromdate} to ${todate} in duration: ${duration}`, async () => {
                    expect(await leavePage.submitLeaveRange(fromdate,todate,duration,parseFloat(requestamount))).toBe(true);
                });

                await test.step(`Validate My Leave, from ${fromdate}, to ${todate} in duration: ${duration} with request leave: ${requestamount} day`, async () => {
                    expect(await leavePage.verifyLeaveSubmission(fromdate,todate,duration,singlerange,parseFloat(requestamount))).toBe(true);
                });
            }
                        
            await test.step(`Logout with username: ${username}, firstname: ${firstname}`, async () => {    
                await leavePage.logoutThisUser();
            });
            
        }

        await leavePage.closePage();

    });    

});
