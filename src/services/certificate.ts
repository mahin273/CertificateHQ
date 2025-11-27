import { createCanvas, loadImage, Image } from '@napi-rs/canvas';
import { getDB } from '../db';

interface CertificateStyle {
    backgroundColor: string;
    borderColor: string;
    innerBorderColor: string;
    titleText: string;
    titleFontSize: number;
    titleColor: string;
    subtitleText: string;
    subtitleFontSize: number;
    subtitleColor: string;
    nameFontSize: number;
    nameColor: string;
    footerText: string;
    footerFontSize: number;
    footerColor: string;
}

export async function generateCertificate(name: string): Promise<Buffer> {
    // Get style from database
    const db = await getDB();
    const styleRow = await db.get('SELECT value FROM certificate_config WHERE key = ?', 'style');
    const bgImageRow = await db.get('SELECT value FROM certificate_config WHERE key = ?', 'backgroundImage');

    const defaultStyle: CertificateStyle = {
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
    };

    const savedStyle = styleRow?.value ? JSON.parse(styleRow.value) : {};

    // Merge defaults with saved style to ensure no undefined values
    const style: CertificateStyle = { ...defaultStyle, ...savedStyle };

    const width = 800;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    if (bgImageRow?.value) {
        try {
            const image = await loadImage(bgImageRow.value);
            ctx.drawImage(image, 0, 0, width, height);
        } catch (e) {
            console.error('Failed to load background image, using default style', e);
            // Fallback to default style
            ctx.fillStyle = style.backgroundColor;
            ctx.fillRect(0, 0, width, height);

            // Outer Border
            ctx.strokeStyle = style.borderColor;
            ctx.lineWidth = 20;
            ctx.strokeRect(10, 10, width - 20, height - 20);

            // Inner border
            ctx.strokeStyle = style.innerBorderColor;
            ctx.lineWidth = 3;
            ctx.strokeRect(30, 30, width - 60, height - 60);
        }
    } else {
        // Default programmatic background
        ctx.fillStyle = style.backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // Outer Border
        ctx.strokeStyle = style.borderColor;
        ctx.lineWidth = 20;
        ctx.strokeRect(10, 10, width - 20, height - 20);

        // Inner border
        ctx.strokeStyle = style.innerBorderColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(30, 30, width - 60, height - 60);
    }

    // Title
    ctx.fillStyle = style.titleColor;
    ctx.font = `bold ${style.titleFontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(style.titleText, width / 2, 120);

    // Subtitle
    ctx.font = `${style.subtitleFontSize}px Arial`;
    ctx.fillStyle = style.subtitleColor;
    ctx.fillText(style.subtitleText, width / 2, 200);

    // Name (the main personalization)
    ctx.font = `bold ${style.nameFontSize}px Arial`;
    ctx.fillStyle = style.nameColor;
    ctx.fillText(name, width / 2, 300);

    // Footer text
    ctx.font = `${style.footerFontSize}px Arial`;
    ctx.fillStyle = style.footerColor;
    ctx.fillText(style.footerText, width / 2, 400);

    // Date
    ctx.font = '18px Arial';
    ctx.fillStyle = '#95a5a6';
    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    ctx.fillText(`Date: ${date}`, width / 2, 500);

    return canvas.toBuffer('image/png');
}
