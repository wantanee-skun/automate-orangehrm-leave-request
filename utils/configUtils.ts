import fs from 'fs';

interface Config {
    baseURL: string;
    adminUsername: string;
    adminPassword: string;
    timeout: number;
    inputEmployee: string;
    inputLeave: string;
}

export function readConfig(): Config {
    const data = fs.readFileSync('config/config.json', 'utf-8');
    return JSON.parse(data);
}