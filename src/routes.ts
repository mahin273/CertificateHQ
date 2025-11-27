import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { generateCertificate } from './services/certificate';
import { sendCertificateEmail } from './services/email';
import { getDB } from './db';

const router = express.Router();

// Webhook for Google Forms
router.post('/webhook', async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            res.status(400).json({ error: 'Name and email are required' });
            return;
        }

        console.log(`Processing request for ${name} (${email})`);

        // Generate Certificate
        const buffer = await generateCertificate(name);

        // Send Email
        await sendCertificateEmail(email, name, buffer);

        // Log to DB
        const db = getDB();
        await db.run('INSERT INTO logs (email, name) VALUES (?, ?)', email, name);

        res.status(200).json({ message: 'Certificate sent successfully' });
    } catch (error: any) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: error.message });
    }
});

// Admin: Update Email Config
router.put('/admin/email', async (req: Request, res: Response) => {
    try {
        const { subject, body } = req.body;
        const db = getDB();

        if (subject) {
            await db.run('INSERT INTO email_config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', 'subject', subject);
        }
        if (body) {
            await db.run('INSERT INTO email_config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', 'body', body);
        }

        res.json({ message: 'Email config updated' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Upload Template
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..')); // Save to root (d:/Formo)
    },
    filename: (req, file, cb) => {
        cb(null, 'template.png'); // Always overwrite template.png
    },
});

const upload = multer({ storage });

router.post('/admin/template', upload.single('template'), (req: Request, res: Response) => {
    res.json({ message: 'Template updated successfully' });
});

export default router;
