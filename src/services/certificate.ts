import { createCanvas, loadImage, registerFont } from 'canvas';
import path from 'path';
import fs from 'fs';

const TEMPLATE_PATH = path.join(__dirname, '../../template.png');

export async function generateCertificate(name: string): Promise<Buffer> {
    if (!fs.existsSync(TEMPLATE_PATH)) {
        throw new Error('Template file not found');
    }

    const image = await loadImage(TEMPLATE_PATH);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0);

    // Configure font for Name
    ctx.font = 'bold 50px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';

    // Draw Name (Adjust coordinates based on your template)
    // Assuming the line is around y=290 based on my create_template script
    ctx.fillText(name, image.width / 2, 290);

    return canvas.toBuffer('image/png');
}
