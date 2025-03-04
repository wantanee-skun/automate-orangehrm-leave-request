# automate-orangehrm-leave-request
# 🚀 Playwright Leave Request Automation Project

## 📌 Project Overview

This project automates **Leave Request Management** using **Playwright** for end-to-end testing on the OrangeHRM demo application.

## 📂 Folder Structure
```
leave-request-automation/
│-- config/                         # 📂 Configuration files
│   ├── config.json                 # >> Stores URLs, admin users, timeout settings, path to data input
│-- pages/                          # 📂 Page Object Model (POM) for web pages
│   ├── loginPage.ts                # >> Login page actions
│   ├── leavePage.ts                # >> Leave page actions
│-- playwright-report/              # 📂 Playwright-generated HTML report 
│-- prepare-data/                   # 📂 Script for Data preparation before execution test script
│   ├── prepare-employee.spec.ts    # >> Prepare employee list, reset language and localization, period year
│   ├── reset-holiday.spec.ts       # >> Reset Holiday list to empty
│-- test-data/                      # 📂 Contains all test data
│   ├── employee.csv                # >> Employee info and Leave Entitlement amount
│   ├── leaveinput.csv              # >> Input list for Leave amount and leave options
│-- test-results/                   # 📂 Playwright run results
│-- tests/                          # 📂 Contains all test scripts
│   ├── login-OrangeHRM.spec.ts     # >> Login tests
│   ├── Submit-Verify-Leave.spec    # >> Leave request tests
│-- utils/                          # 📂 Utility functions
│   ├── config.ts                   # >> Loads custom config (JSON )
│   ├── csvUtils.ts                 # >> Reads test data from CSV
│-- playwright.config.ts            # 🎯 Playwright configuration file
│-- package.json                    # 📦 Node.js dependencies and scripts
│-- tsconfig.json                   # ⚙ TypeScript configuration
│-- README.md                       # 📖 Project documentation
```

## 🔧 Installation & Setup

### 📋 Prerequisites

- [**Node.js (LTS)**](https://nodejs.org/)
- **Playwright** (installed via `npm`)

### 📥 Clone the Repository

```
git clone https://github.com/wantanee-skun/automate-orangehrm-leave-request.git
cd automate-orangehrm-leave-request
```

### 📦 Install Playwright and Dependencies

```
npm install --save-dev @playwright/test
```

### 🌍 Install Playwright Browsers

```
npx playwright install
```

## ⚙ Configuration

### 📝 Modify `config/config.json`

```json
{
    "baseURL": "https://opensource-demo.orangehrmlive.com/",
    "adminUsername": "Admin",
    "adminPassword": "admin123",
    "timeout": 240000,
    "inputEmployee": "test-data/employee.csv",
    "inputLeave": "test-data/leaveinput.csv"
}
```

## ▶ Running Tests

### 🔹 Run Test Per Project

#### 1. Run Preparation first
```
npx playwright test --project=prepare-data-chromium
```
#### 2. Run Test Cases
```
npx playwright test --project=run-test-chromium
```

### 🔹 Run a Specific Test File

```
npx playwright test tests/Submit-Verify-Leave.spec.ts
```

### 🔹 Run Tests in Headed Mode (Visible UI)
Note: This project default is change to run in headed mode already.
```
npx playwright test --headed
```

### 🔹 Run Tests in Debug Mode

```
npx playwright test --debug
```

### 🔹 Generate HTML Test Report

```
npx playwright test --reporter=html
```

Then, open the report:

```
npx playwright show-report
```


## 🎯 Input Files
Feel free to change the input file, and run the preparation again with the input.
| **Input**                         | **Purpose**                         |
| --------------------------------- | ----------------------------------- |
| `employee.csv`                    | List of Employee                    |
| `leaveinput.csv`                  | Input for Leave request selection   |


## 📖 Key Features

✅ **Uses Page Object Model (POM)** for maintainable test design.\
✅ **Supports Environment-Specific Configurations** using `config.json`.\
✅ **Reads Test Data from CSV** for data-driven testing.\


