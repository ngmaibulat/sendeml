//accept: filepath, smtp params

import nodemailer from 'nodemailer'

import { getArgs } from './args.js'

const args = await getArgs()

const options = {
    host: 'localhost',
    port: 25,
    // secure: true,
    auth: {
        user: 'user',
        pass: 'pass',
    },
    connectionTimeout: 10000,
}

const transporter = nodemailer.createTransport(options)

const envelope = {
    from: 'sender@example.com',
    to: ['recipient@example.com'],
}

const raw = `From: sender@example.com
To: recipient@example.com
Subject: greetings

Salam Aleikum!`

let message = { envelope, raw }

// send email
await transporter.sendMail(message)
