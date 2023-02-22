import fs from "node:fs/promises";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { smtpAuth, smtpOptions } from "./types.js";

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
