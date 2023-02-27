import { isDir, lsDir } from "../utils/dir.js";
import { sendEmlFile, smtpPing } from "../smtp.js";

import { sendDirOptions } from "../types.js";

export async function actionSendDir(options: sendDirOptions) {
    const dirFound = await isDir(options.dir);

    if (!dirFound) {
        console.error(`Dir not found: ${options.dir}`);
        process.exit(1);
    }

    const files = await lsDir(options.dir, true);

    let filesToProcess = [];

    if (options.max) {
        filesToProcess = files.slice(0, options.max);
    } else {
        filesToProcess = files;
    }

    // console.log(files);
    // console.log(filesToProcess);

    for (const item of filesToProcess) {
        await sendEmlFile(item, options.sender, [options.rcpt]);
        console.log(`Sent: ${item}`);
    }
}
