import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
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
        const db = await getDB();
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
        const db = await getDB();

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

// Admin: Upload Template (Custom Background)
const storage = multer.memoryStorage(); // Use memory storage for Vercel/DB
const upload = multer({ storage });

router.post('/admin/template', upload.single('template'), async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        // Convert buffer to Base64
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        const db = await getDB();
        await db.run('INSERT INTO certificate_config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', 'backgroundImage', base64Image);

        res.json({ message: 'Background updated successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Delete Template (Reset to Default)
router.delete('/admin/template', async (req: Request, res: Response) => {
    try {
        const db = await getDB();
        await db.run('DELETE FROM certificate_config WHERE key = ?', 'backgroundImage');
        res.json({ message: 'Background reset to default' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Get Certificate Style
router.get('/admin/certificate/style', async (req: Request, res: Response) => {
    try {
        const db = await getDB();
        const styleRow = await db.get('SELECT value FROM certificate_config WHERE key = ?', 'style');

        if (styleRow?.value) {
            res.json(JSON.parse(styleRow.value));
        } else {
            // Return default style if not found
            res.json({
                backgroundColor: '#f5f5f5',
                borderColor: '#2c3e50',
                innerBorderColor: '#3498db',
                titleText: 'CERTIFICATE OF COMPLETION',
                titleFontSize: 48,
                titleColor: '#2c3e50',
                subtitleText: 'This certificate is proudly presented to',
                subtitleFontSize: 24,
                subtitleColor: '#7f8c8d',
                nameFontSize: 56,
                nameColor: '#e74c3c',
                footerText: 'For successfully completing the course',
                footerFontSize: 20,
                footerColor: '#2c3e50'
            });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Update Certificate Style
router.put('/admin/certificate/style', async (req: Request, res: Response) => {
    try {
        const style = req.body;
        const db = await getDB();

        await db.run('INSERT INTO certificate_config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', 'style', JSON.stringify(style));

        res.json({ message: 'Certificate style updated' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Preview Certificate
router.get('/admin/certificate/preview', async (req: Request, res: Response) => {
    try {
        const name = (req.query.name as string) || 'John Doe';
        const buffer = await generateCertificate(name);

        res.setHeader('Content-Type', 'image/png');
        res.send(buffer);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
