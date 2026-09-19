# Style bible

The one look every picture in the book shares. Approved by the owner on
2026-09-19 after an outside review found the pages drifting from the
paper-cutout reference toward smooth, generic 3D storybook art. Richness and
detail stay; "realistic" goes. Detail and paper can coexist; realism and paper
cannot.

The reference is `design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg`
(Daniel praying among the lions). Every Gemini call sends it, and
`design/pipeline/gen.py` prepends the style line below and refuses prompts
that ask for realism.

## The look in one sentence

Soft-shaded paper cutouts, stacked in layers, lit by one warm light, with
visible cut edges, fine paper grain and a small contact shadow under every
piece, in a warm palette that sits on the app's deep purple.

## Rules

1. **Paper, not paint, not render.** Every figure, prop and background plane
   reads as a cut piece of card: a crisp silhouette edge with a hairline of
   lighter paper thickness, and a soft shadow where it rests on the layer
   below. Backgrounds are three to five stacked planes, not one continuous
   painting. Textures are printed on the paper (wood grain, stone, cloth
   weave) and stay flat within the piece.
2. **Soft shading inside each piece.** Rounded forms with gentle airbrushed
   shading, no black outlines, no hard specular highlights, no photographic
   texture, no lens effects.
3. **One warm light.** A single warm key light from above and slightly
   behind the viewer's left, a cool violet fill in the shadows, a warm rim on
   edges facing the light. Night scenes keep the same rule with a lamp,
   fire, moon or the light of God as the key.
4. **Palette.** Warm ochres, terracotta, cream and sand for skin, cloth and
   wood; the app's purples (`#2b1b56`, `#3a2470`) for shadow and night; gold
   (`#ffc94d`) for light, halos and rewards; sky blues and sea greens kept
   soft. No neon, no pure black, no pure white, never green props (the
   chroma key).
5. **Faces.** Big round friendly eyes, about one eye-width apart, a small
   nose, a soft mouth; brows expressive but thin. Heads about one fifth of
   standing height for adults, one quarter for children. The same face on
   every page of a story: character sheets are the source, and a new sheet
   needs a note in `docs/decisions/` if it changes a character.
6. **Hands and bodies.** Simple mitten-like hands with four fingers and a
   thumb, no knuckle detail; rounded shoulders; feet in simple sandals.
   Proportions gentle, never lanky, never chibi.
7. **Clothing.** Period tunics and mantles in flat colour with one woven
   stripe or hem pattern; folds as soft shading, not photographic cloth.
8. **Props and animals** are their own cut pieces on their own layer, so
   they can move. Objects are inanimate: no faces, no eyes.
9. **Richness** means more pieces and more printed detail, not more
   realism: another plane of hills, a jar and a basket, moss on the stones,
   lamplight in windows, birds in the sky. Backgrounds at 2K.
10. **Motion is paper motion.** Pieces heave, rock, sway from a pivot on
    their own box, flip between two cut frames, or hinge in perspective like
    the angel wings. Nothing morphs, nothing blurs.

## Words for prompts

Use: paper cutout, layered card, cut edge, paper thickness, contact shadow,
paper grain, soft shaded, rounded, warm rim light, storybook, printed
texture.

Never: realistic, photorealistic, painterly, 3D render, CGI, cinematic,
depth of field, no cartoon outlines. `gen.py` rejects a prompt that uses
them.

## Existing pages

Pages generated before this bible stay as they are until they come up for
another reason. When a scene is regenerated for any reason, it is generated
under this bible. Creation is closest to the reference; Christmas and the
storm are the furthest and are the first candidates for a style pass if
the owner wants one.
