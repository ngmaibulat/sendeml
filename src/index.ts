import { getArgs } from "./args.js";
import { sendEmlFile } from "./smtp.js";

const args = await getArgs();

const filename = "./queue/file.eml";

await sendEmlFile(filename, "sender@example.com", ["recipient@example.com"]);
