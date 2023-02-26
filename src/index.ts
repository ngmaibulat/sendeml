import { Command } from "commander";
import isFile from "@aibulat/isfile";

import { isDir, lsDir } from "./dir.js";
import { sendEmlFile, smtpPing } from "./smtp.js";
import { tableEmails } from "./table.js";
import { parseEmlDir } from "./smtp.js";

import { pingOptions, sendOptions, lsOptions, sendDirOptions } from "./types.js";

const program = new Command();

const name = "sendeml";
const description = "Send raw eml files to SMTP server specified via env vars or .env file";
const version = "0.0.1";

program.name(name).description(description).version(version);

program
    .command("ping")
    .description("Test SMTP server by sending a generated message")
    // .argument("<from>", "From Addr")
    // .argument("<to>", "To Addr")
    .requiredOption("-s, --sender <sender>", "sender address", "sender@example.com")
    .requiredOption("-r, --rcpt <rcpt>", "recipient address", "recipient@example.com")
    .option("--subject", "Subject", "Hallar nisek?")
    .option("--text", "Text", "Test Message")
    .option("--debug", "Show debug output for SMTP conversation")
    .action(async (options: pingOptions) => {
        console.log(options);
        console.log(options.sender);
        console.log(options.rcpt);

        const res = await smtpPing(options);
        console.log(res);
    });

program
    .command("send")
    .description("Send eml file")
    .requiredOption("-s, --sender <sender>", "sender address", "sender@example.com")
    .requiredOption("-r, --rcpt <rcpt>", "recipient address", "recipient@example.com")
    .requiredOption("-f, --file <file>", "eml file path")
    .option("--debug", "Show debug output for SMTP conversation")
    .action(async (options: sendOptions) => {
        console.log(options);
        console.log(options.sender);
        console.log(options.rcpt);
        const fileFound = await isFile(options.file);

        if (!fileFound) {
            console.error(`File not found: ${options.file}`);
            process.exit(1);
        }

        await sendEmlFile(options.file, options.sender, [options.rcpt]);
    });

program
    .command("senddir")
    .description("Send eml files from a dir")
    .requiredOption("-s, --sender <sender>", "sender address", "sender@example.com")
    .requiredOption("-r, --rcpt <rcpt>", "recipient address", "recipient@example.com")
    .requiredOption("-d, --dir <dir>", "directory with eml files")
    .option("--max <max>", "Send first <max> amount of emails")
    .action(async (options: sendDirOptions) => {
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
    });

program
    .command("ls")
    .description("List eml files in a dir")
    .requiredOption("-d, --dir <dir>", "dir")
    .action(async (options: lsOptions) => {
        // console.log(options);
        const data = await parseEmlDir(options.dir);
        const output = tableEmails(data);
        console.log(output);
    });

program.parse();
