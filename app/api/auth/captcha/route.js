import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Initialize a global store for captchas
if (!global.captchaStore) {
  global.captchaStore = new Map();
}

function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let text = '';
  for (let i = 0; i < 6; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
}

function createCaptchaSVG(text) {
  const width = 150;
  const height = 50;
  
  // Add some random lines for noise
  let noise = '';
  for (let i = 0; i < 5; i++) {
    const x1 = Math.random() * width;
    const y1 = Math.random() * height;
    const x2 = Math.random() * width;
    const y2 = Math.random() * height;
    noise += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ccc" stroke-width="2" />`;
  }

  // Add random dots
  for (let i = 0; i < 30; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    noise += `<circle cx="${cx}" cy="${cy}" r="1" fill="#888" />`;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#f3f4f6" />
      ${noise}
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="24" font-weight="bold" font-family="monospace, sans-serif" fill="#1f2937" transform="rotate(${Math.random() * 8 - 4}, 75, 25)" letter-spacing="4">
        ${text}
      </text>
    </svg>
  `.trim();
}

export async function GET() {
  const text = generateCaptcha();
  const id = crypto.randomUUID();
  
  // Store for 5 minutes
  global.captchaStore.set(id, text);
  setTimeout(() => global.captchaStore.delete(id), 5 * 60 * 1000);

  const svg = createCaptchaSVG(text);
  const base64Svg = Buffer.from(svg).toString('base64');

  return NextResponse.json({
    id,
    image: `data:image/svg+xml;base64,${base64Svg}`
  });
}
