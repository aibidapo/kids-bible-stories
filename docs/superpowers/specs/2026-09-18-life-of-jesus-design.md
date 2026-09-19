# Life of Jesus collection: design

Roadmap phase 4. Owner instruction 2026-09-18: "Start phase 4, ensure the
graphics are very rich and detailed."

## Stories, in build order

1. **Christmas** (Luke 1–2, Matthew 2): Mary and the angel; the road to
   Bethlehem and no room at the inn; the stable; shepherds and the angels;
   the shepherds' visit; the wise men and the star. Six pages.
2. **Jesus calms the storm** (Mark 4:35–41): the miracle. Five pages.
3. **The Good Samaritan** (Luke 10:25–37): Jesus telling the story, then
   the story itself. Six pages.
4. **Easter** (Luke 22–24, John 20): Palm Sunday, the last supper, the
   garden, the cross told gently, the empty tomb, Jesus meets his friends.
   Six pages.
5. **Pentecost** (Acts 2): waiting, wind and fire, everyone hears, the
   first church. Five pages.

Twenty-eight pages. Same data shape as the existing stories: prose at both
levels, hotspots, find-games, quizzes, memory verse (NIV), devotional.

## Depiction of Jesus

Default: Jesus is drawn, face on, warm, in the book's style, as the other
people are. Christmas shows him as a baby, so story 1 does not force the
adult question. **Before story 2 the owner confirms or changes this**;
several traditions prefer not to show his face, and the choice is cheaper
to make before the character sheet exists. The angel sheet from Daniel is
reused for Gabriel and the heavenly host so angels look the same across
the book.

## Rich and detailed: the recipe

Same style reference and pipeline, three changes, all recorded per asset
in the sidecars:

1. **Backgrounds generated at 2K** (`"size": "2K"` in the manifest, new
   pipeline support) and downscaled to the 1600×1000 pack size, so fine
   detail survives at phone density.
2. **Detail lines in every prompt**: named materials and ornament (carved
   wood, woven wool, brocade, hammered brass, straw, stone), foreground,
   midground and background layers with small incidental details (a cat on
   a wall, tools, jars, lanterns), atmospheric light (lamp glow, starlight,
   dawn), and for cutouts, textured fabric with embroidered hems and
   visible stitching.
3. **More layers per scene** (six to nine instead of three to five): props
   and animals as their own cutouts so they can breathe, blink or sway.

Budgets hold: 450 KB per scene; the background line rises from 200 KB to
250 KB inside that budget because 2K sources compress larger. Total
precache after story 2 crosses the 12 MB line, so **download-a-story
ships before story 3** (roadmap phase 4 scope, moved after two stories on
purpose: the first two stories make the richness reviewable early).

## What the owner reviews

Each story: the story sheet and phone stills as before, plus a
before/after crop of one page against Daniel's page 1 to judge the detail
gain. Christmas first.
