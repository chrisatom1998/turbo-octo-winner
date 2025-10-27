#!/usr/bin/env node

/**
 * Simple icon generator for the Gemini Release Tracker extension
 * Creates basic placeholder icons that can be replaced with better designs later
 */

const fs = require('fs');
const path = require('path');

// SVG template for the icon
function generateSVG(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.15}"/>

  <!-- Gemini-inspired symbol -->
  <g transform="translate(${size/2}, ${size/2})">
    <!-- Top triangle -->
    <path d="M 0,-${size*0.25} L -${size*0.2},-${size*0.05} L ${size*0.2},-${size*0.05} Z" fill="#4285F4"/>

    <!-- Bottom triangle -->
    <path d="M 0,${size*0.25} L -${size*0.2},${size*0.05} L ${size*0.2},${size*0.05} Z" fill="#34A853"/>

    <!-- Middle line -->
    <line x1="-${size*0.2}" y1="0" x2="${size*0.2}" y2="0" stroke="#FBBC04" stroke-width="${Math.max(1, size*0.03)}" stroke-linecap="round"/>

    <!-- Sparkle dots -->
    <circle cx="-${size*0.3}" cy="-${size*0.25}" r="${Math.max(1, size*0.02)}" fill="white" opacity="0.8"/>
    <circle cx="${size*0.3}" cy="-${size*0.25}" r="${Math.max(1, size*0.02)}" fill="white" opacity="0.8"/>
    <circle cx="-${size*0.3}" cy="${size*0.25}" r="${Math.max(1, size*0.02)}" fill="white" opacity="0.8"/>
    <circle cx="${size*0.3}" cy="${size*0.25}" r="${Math.max(1, size*0.02)}" fill="white" opacity="0.8"/>
  </g>
</svg>`;
}

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons
const sizes = [16, 48, 128];
sizes.forEach(size => {
  const svg = generateSVG(size);
  const filename = path.join(iconsDir, `icon${size}.svg`);
  fs.writeFileSync(filename, svg);
  console.log(`✓ Generated ${filename}`);
});

console.log('\n✓ SVG icons generated successfully!');
console.log('\nNOTE: Chrome extensions work best with PNG icons.');
console.log('To convert SVG to PNG, you can:');
console.log('1. Open icon-generator.html in your browser and download the PNGs');
console.log('2. Use an online converter like https://cloudconvert.com/svg-to-png');
console.log('3. Use ImageMagick: convert icon.svg icon.png');
console.log('\nFor now, the extension will work with SVG icons in modern Chrome.');
