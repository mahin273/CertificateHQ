import nodemailer from 'nodemailer';
import { getDB } from '../db';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendCertificateEmail(toEmail: string, name: string, certificateBuffer: Buffer) {
    const db = getDB();

    let subject = 'Your Certificate';
    let body = 'Dear {name},\n\nPlease find your certificate attached.\n\nBest regards,\nAdmin';

    try {
        // Try to get from DB, but don't fail if DB is empty/reset
        const subjectRow = await db.get('SELECT value FROM email_config WHERE key = ?', 'subject');
        const bodyRow = await db.get('SELECT value FROM email_config WHERE key = ?', 'body');

        if (subjectRow?.value) subject = subjectRow.value;
        if (bodyRow?.value) body = bodyRow.value;
    } catch (e) {
        console.log('DB read failed, using defaults/env');
    }

    // Override with Env Vars if present (Vercel way)
    if (process.env.EMAIL_SUBJECT) subject = process.env.EMAIL_SUBJECT;
    if (process.env.EMAIL_BODY) body = process.env.EMAIL_BODY;

    // Template replacement
    body = body.replace(/{name}/g, name);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: subject,
        text: body,
        attachments: [
            {
                filename: 'Certificate.png',
                content: certificateBuffer,
            },
        ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${toEmail}`);
}
