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
