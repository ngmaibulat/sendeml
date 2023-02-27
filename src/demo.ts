import { ParsedMail } from "mailparser";
import fs from "node:fs/promises";
import path from "node:path";
import { isDir } from "./utils/dir.js";
import { tableEmails } from "./table.js";
import { parseEmlDir } from "./smtp.js";

import { readHQueueFile } from "./haraka/hqueue.js";
import { sendEml } from "./smtp.js";

const filename = "./queue/haraka/1676349832351_1676369986649_7_35_fl96Rc_8_c21194a1a5c3";

const res = readHQueueFile(filename);

// await sendEml(res.eml, res.mail_from.original, ["test@demo.com"]);

console.log(res);
