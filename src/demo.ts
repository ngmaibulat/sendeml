import { ParsedMail } from "mailparser";
import fs from "node:fs/promises";
import path from "node:path";
import { isDir } from "./dir.js";
import { tableEmails } from "./table.js";
import { parseEmlDir } from "./smtp.js";

import { faker } from "@faker-js/faker";

const numberOfRecords = 100;
const fileName = "fake_data.csv";

// Define the header for the CSV file
const header = "FirstName, LastName, Email, Phone, Card, IBAN\n";

// Generate the fake PII data
let fakeData = "";
for (let i = 0; i < numberOfRecords; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email(firstName, lastName);
    const phoneNumber = faker.phone.number();
    const card = faker.finance.creditCardNumber();
    const iban = faker.finance.iban();
    fakeData += `${firstName}, ${lastName}, ${email}, ${phoneNumber}, ${card}, ${iban}\n`;
}

// Write the data to a file
await fs.writeFile(fileName, header + fakeData);
