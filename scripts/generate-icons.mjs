/**
 * Renders the app icon to the PNG sizes the manifest and iOS need.
 * Run with `npm run icons` after changing the artwork below.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const BANDS = ['#e8453c', '#f5871f', '#f6c63c', '#4caf50', '#3f7fd6', '#7a4fc4']

function icon({ inset = 0 } = {}) {
  const s = 512
  const pad = inset * s
  const scale = (s - pad * 2) / s
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2b1b56"/>
      <stop offset="100%" stop-color="#4aa8e0"/>
    </linearGradient>
  </defs>
  <rect width="${s}" height="${s}" fill="url(#sky)"/>
  <g transform="translate(${pad} ${pad}) scale(${scale})">
    ${BANDS.map(
      (c, i) =>
        `<path d="M${76 + i * 26},400 A${180 - i * 26},${180 - i * 26} 0 0 1 ${436 - i * 26},400" fill="none" stroke="${c}" stroke-width="26" stroke-linecap="round"/>`,
    ).join('\n    ')}
    <path d="M0,404 q64,-22 128,0 q64,22 128,0 q64,-22 128,0 q64,22 128,0 L512,512 L0,512 Z" fill="#1f7fb8"/>
    <path d="M150,404 q-12,44 44,62 q112,20 224,0 q56,-18 44,-62 Z" fill="#a9763f"/>
    <path d="M150,404 L462,404 L462,390 L150,390 Z" fill="#8a5a3b"/>
    <path d="M196,390 L196,312 L416,312 L416,390 Z" fill="#c99a68"/>
    <path d="M180,312 L306,268 L432,312 Z" fill="#b5533f"/>
    <rect x="278" y="330" width="56" height="60" rx="8" fill="#8a5a3b"/>
    <circle cx="112" cy="128" r="40" fill="#ffd34d"/>
  </g>
</svg>`
}

await mkdir('public/icons', { recursive: true })

const plain = Buffer.from(icon())
// Maskable icons are cropped to a circle by Android, so keep the art well inside.
const maskable = Buffer.from(icon({ inset: 0.12 }))

await writeFile('public/icons/icon.svg', plain)
await sharp(plain).resize(192, 192).png().toFile('public/icons/icon-192.png')
await sharp(plain).resize(512, 512).png().toFile('public/icons/icon-512.png')
await sharp(maskable).resize(512, 512).png().toFile('public/icons/maskable-512.png')

console.log('Wrote public/icons/{icon.svg,icon-192.png,icon-512.png,maskable-512.png}')
