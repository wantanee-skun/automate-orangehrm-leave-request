import fs from 'fs';
import csv from 'csv-parser';

interface TestData {
  id: string;
  emp: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  leavetype: string;
  entdays: string;
}

interface TestLeaveDate {
  id: string;
  fromdate: string;
  todate: string;
  singlerange: string;
  duration: string;
  requestamount: string;
}

export async function readCSV(filePath: string, filterFn?: (row: TestData) => boolean): Promise<TestData[]> {
  return new Promise((resolve, reject) => {
    const results: TestData[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        if (!filterFn || filterFn(data)) {
          results.push(data);
        }
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}


export async function readCSV_leaveDate(filePath: string, filterFn?: (row: TestLeaveDate) => boolean): Promise<TestLeaveDate[]> {
  return new Promise((resolve, reject) => {
    const results: TestLeaveDate[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        if (!filterFn || filterFn(data)) {
          results.push(data);
        }
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}
