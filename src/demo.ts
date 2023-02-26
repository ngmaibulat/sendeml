import { ParsedMail } from "mailparser";
import fs from "node:fs/promises";
import path from "node:path";
import { isDir } from "./dir.js";

import { parseEmlDir } from "./smtp.js";

function tableEml(data: ParsedMail[]) {
    console.log(data);
}

const data = await parseEmlDir("./queue");

tableEml(data);
