import fs from "node:fs/promises";
import path from "node:path";

import dotenv from "dotenv";
import nodemailer from "nodemailer";

import { simpleParser, ParsedMail } from "mailparser";
import { smtpAuth, smtpOptions, pingOptions } from "./types.js";
import { isDir } from "./dir.js";

dotenv.config();

export function getSmtpPort(): number {
    if (process.env.SMTP_PORT) {
        const port = parseInt(process.env.SMTP_PORT);
        return port;
    } else {
        return 25;
    }
}

export function getSmtpOptions() {
    //type smtpOptions
    const options: smtpOptions = {
        host: process.env.SMTP_HOST || "localhost",
        port: getSmtpPort(),
        secure: false,
        connectionTimeout: 10000,
    };

    if (process.env.SMTP_USER) {
        const auth = {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS || "",
        };
        options.auth = auth;
    }

    return options;
}

export function getSmtpTransport() {
    const options = getSmtpOptions();
    const transport = nodemailer.createTransport(options);
    return transport;
}

export async function sendEmlFile(filename: string, from: string, to: string[]) {
    const envelope = { from, to };
    const buff = await fs.readFile(filename);
    const raw = buff.toString();
    const message = { envelope, raw };

    // send email
    const transport = getSmtpTransport();
    await transport.sendMail(message);
}

export async function smtpPing(options: pingOptions) {
    const envelope = {
        from: options.sender,
        to: [options.rcpt],
    };
    const raw = `From: ${options.sender}
To: ${options.rcpt}
Subject: ${options.subject}

${options.text}
`;
    const message = { envelope, raw };

    // send email
    const transport = getSmtpTransport();
    const res = await transport.sendMail(message);
    return res;
}

export async function parseEml(filename: string): Promise<ParsedMail> {
    const emlContents = await fs.readFile(filename, "utf-8");
    const res = simpleParser(emlContents);
    return res;
}

export async function parseEmlDir(dirname: string) {
    if (!dirname) {
        throw new Error(`Invalid dirname argument`);
    }

    if (typeof dirname != "string") {
        throw new Error(`Invalid dirname argument`);
    }

    if (!isDir(dirname)) {
        throw new Error(`Directory does not exist: ${dirname}`);
    }

    const arr = [];
    const files = await fs.readdir(dirname);

    for (const file of files) {
        const realPath = path.resolve(dirname, file);
        const data = await parseEml(realPath);
        arr.push(data);
    }

    return arr;
}
