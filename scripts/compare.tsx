/**
 * Side-by-side for reference-driven art work: renders one registered scene at
 * full 1000x625 (animations frozen, the still Calm mode shows) and stacks it
 * above a reference image scaled to the same width. Judge art from this
 * image, never from the 500px contact sheet.
 *
 *   npm run compare -- daniel/den design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { createElement } from 'react'
import sharp from 'sharp'
import { SCENE_ART } from '../src/scenes/index'
import { inlinePng } from './lib/inline-png'

process.env.NODE_ENV = 'production'
const { renderToStaticMarkup } = await import('react-dom/server')

const [key, ref] = process.argv.slice(2)
if (!key || !ref) {
  console.error('usage: compare <sceneKey> <referencePath>')
  process.exit(1)
}
const Art = SCENE_ART[key]
if (!Art) {
  console.error(`unknown scene key: ${key}`)
  process.exit(1)
}

const W = 1000
const H = 625
const OUT = 'scratch/compare'
mkdirSync(OUT, { recursive: true })
const name = key.replace('/', '-')

const inner = await inlinePng(
  renderToStaticMarkup(createElement(Art, { active: true, animate: false, found: [] })),
)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${inner}</svg>`
const render = await sharp(Buffer.from(svg)).png().toBuffer()
writeFileSync(`${OUT}/${name}.png`, render)

const reference = await sharp(ref).resize({ width: W }).png().toBuffer()
const refH = (await sharp(reference).metadata()).height ?? H
const gap = 12
const sheet = await sharp({
  create: { width: W, height: H + gap + refH, channels: 3, background: '#111111' },
})
  .composite([
    { input: render, left: 0, top: 0 },
    { input: reference, left: 0, top: H + gap },
  ])
  .png()
  .toBuffer()
writeFileSync(`${OUT}/${name}_vs_ref.png`, sheet)
console.log(`wrote ${OUT}/${name}.png and ${OUT}/${name}_vs_ref.png`)
