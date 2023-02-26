import { ParsedMail } from "mailparser";
import fs from "node:fs/promises";
import path from "node:path";
import { isDir } from "./dir.js";
import { tableEmails } from "./table.js";
import { parseEmlDir } from "./smtp.js";

const data = await parseEmlDir("./queue/2023/02");
const output = tableEmails(data);
console.log(output);
