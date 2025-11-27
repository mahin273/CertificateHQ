import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

const width = 800;
const height = 600;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Background
ctx.fillStyle = '#f0f0f0';
ctx.fillRect(0, 0, width, height);

// Border
ctx.strokeStyle = '#000';
ctx.lineWidth = 20;
ctx.strokeRect(10, 10, width - 20, height - 20);

// Title
ctx.fillStyle = '#000';
ctx.font = 'bold 40px Arial';
ctx.textAlign = 'center';
ctx.fillText('CERTIFICATE OF APPRECIATION', width / 2, 100);

// Subtitle
ctx.font = '20px Arial';
ctx.fillText('This certificate is proudly presented to', width / 2, 200);

// Line for name
ctx.beginPath();
ctx.moveTo(width / 2 - 200, 300);
ctx.lineTo(width / 2 + 200, 300);
ctx.stroke();

// Date
ctx.font = '15px Arial';
ctx.fillText('Date: ' + new Date().toLocaleDateString(), width / 2, 500);

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(__dirname, '../template.png'), buffer);
console.log('Template created');
