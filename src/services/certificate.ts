import { createCanvas } from '@napi-rs/canvas';
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
// Background
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
