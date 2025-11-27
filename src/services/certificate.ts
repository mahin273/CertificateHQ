import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import path from 'path';
import fs from 'fs';

const TEMPLATE_PATH = path.join(__dirname, '../../template.png');

export async function generateCertificate(name: string): Promise<Buffer> {
    // Create a simple certificate without loading the template image
    // This avoids issues with file loading on Vercel

    const width = 800;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 20;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Inner border
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // Title
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF COMPLETION', width / 2, 120);

    // Subtitle
    ctx.font = '24px Arial';
    ctx.fillStyle = '#7f8c8d';
    ctx.fillText('This certificate is proudly presented to', width / 2, 200);

    // Name (the main personalization)
    ctx.font = 'bold 56px Arial';
    ctx.fillStyle = '#e74c3c';
    ctx.fillText(name, width / 2, 300);

    // Bottom text
    ctx.font = '20px Arial';
    ctx.fillStyle = '#2c3e50';
    ctx.fillText('For successfully completing the course', width / 2, 400);

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
