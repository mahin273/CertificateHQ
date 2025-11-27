import nodemailer from 'nodemailer';
import { getDB } from '../db';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {

        // Override with Env Vars if present (Vercel way)
        if(process.env.EMAIL_SUBJECT) subject = process.env.EMAIL_SUBJECT;
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
