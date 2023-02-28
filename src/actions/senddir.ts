import path from "node:path";
import { isDir, lsDir, moveFile } from "../utils/dir.js";
import { sendEmlFile, smtpPing } from "../smtp.js";

import { sendDirOptions } from "../types.js";

import { logger } from "../logger.js";

export async function actionSendDir(options: sendDirOptions) {
    const dirFound = await isDir(options.dir);
    const moveDirFound = await isDir(options.moveDest);

    if (!dirFound) {
        console.error(`Dir not found: ${options.dir}`);
        process.exit(1);
    }

    if (!moveDirFound) {
        console.error(`Move dir not found: ${options.moveDest}`);
        process.exit(1);
    }

    const files = await lsDir(options.dir, true);

    let filesToProcess = [];

    if (options.max) {
        filesToProcess = files.slice(0, options.max);
    } else {
        filesToProcess = files;
    }

    for (const item of filesToProcess) {
        await sendEmlFile(item, options.sender, [options.rcpt]);
        console.log(`Sent: ${item}`);

        const basename = path.basename(item);
        const newPath = path.resolve(options.moveDest, basename);

        const res = await moveFile(item, newPath);

        if (!res) {
            const msg = `Could not move file: ${basename}`;
            logger.error(msg);
        }
    }
}
