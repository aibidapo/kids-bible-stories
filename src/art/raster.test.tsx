import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Backdrop, Eyelids, Flipbook, Layer, Part, Tail } from "./raster";

/** Every element that carries both a transform and a class, which motion.css forbids. */
function transformAndClass(html: string): string[] {
  return [...html.matchAll(/<[a-z]+[^>]*>/g)]
    .map((m) => m[0])
    .filter((tag) => /\btransform=/.test(tag) && /\bclass=/.test(tag));
}

describe("Layer", () => {
  it("lands the image's bottom-centre on (x, y) at the given scale", () => {
    const html = renderToStaticMarkup(
      <Layer src="a.webp" w={200} h={100} x={500} y={600} scale={0.5} />,
    );
    expect(html).toContain('transform="translate(500 600) scale(0.5 0.5)"');
    expect(html).toContain('x="-100"');
    expect(html).toContain('y="-100"');
    expect(html).toContain('width="200"');
    expect(html).toContain('height="100"');
  });

  it("mirrors by negating only the x scale", () => {
    const html = renderToStaticMarkup(
      <Layer src="a.webp" w={10} h={10} x={0} y={0} scale={2} flip />,
    );
    expect(html).toContain("scale(-2 2)");
  });

  it("puts the motion class and delay on the inner group, never with the transform", () => {
    const html = renderToStaticMarkup(
      <Layer src="a.webp" w={10} h={10} x={1} y={2} className="a-sway" delay={1.5} />,
    );
    expect(html).toContain('class="a-sway"');
    expect(html).toContain("animation-delay:1.5s");
    expect(transformAndClass(html)).toEqual([]);
  });

  it("omits the delay style when delay is 0 or unset", () => {
    const html = renderToStaticMarkup(
      <Layer src="a.webp" w={10} h={10} x={1} y={2} className="a-sway" />,
    );
    expect(html).not.toContain("animation-delay");
  });
});

describe("Part and Tail", () => {
  it("draws the part at its offset inside the body's local space", () => {
    const html = renderToStaticMarkup(
      <Part
        src="t.webp"
        tw={40}
        th={30}
        ox={10}
        oy={20}
        w={200}
        h={100}
        x={0}
        y={0}
        className="a-x"
      />,
    );
    // ox - w/2 = 10 - 100 = -90; oy - h = 20 - 100 = -80
    expect(html).toContain('x="-90"');
    expect(html).toContain('y="-80"');
    expect(html).toContain('width="40"');
    expect(html).toContain('height="30"');
    expect(transformAndClass(html)).toEqual([]);
  });

  it("Tail picks the flick class from its root corner", () => {
    const base = { src: "t.webp", tw: 1, th: 1, ox: 0, oy: 0, w: 2, h: 2, x: 0, y: 0 };
    expect(renderToStaticMarkup(<Tail {...base} root="tr" />)).toContain("a-tail-flick-tr");
    expect(renderToStaticMarkup(<Tail {...base} root="tl" />)).toContain("a-tail-flick-tl");
  });
});

describe("Flipbook", () => {
  const a = { src: "up.webp", w: 100, h: 50, ax: 20, ay: 10, s: 0.5 };
  const b = { src: "down.webp", w: 100, h: 80, ax: 20, ay: 40, s: 0.5 };

  it("aligns both frames on the shared anchor", () => {
    const html = renderToStaticMarkup(<Flipbook a={a} b={b} x={300} y={200} />);
    const imgs = [...html.matchAll(/<image[^>]*>/g)].map((m) => m[0]);
    expect(imgs).toHaveLength(2);
    expect(imgs[0]).toContain('x="-10"');
    expect(imgs[0]).toContain('y="-5"');
    expect(imgs[1]).toContain('x="-10"');
    expect(imgs[1]).toContain('y="-20"');
  });

  it("rests on frame A so Calm mode shows one clean pose", () => {
    const html = renderToStaticMarkup(<Flipbook a={a} b={b} x={0} y={0} />);
    expect(html).toMatch(/class="a-frame-a"[^>]*opacity="1"|opacity="1"[^>]*class="a-frame-a"/);
    expect(html).toMatch(/class="a-frame-b"[^>]*opacity="0"|opacity="0"[^>]*class="a-frame-b"/);
  });

  it("never combines transform and class on one element", () => {
    const html = renderToStaticMarkup(<Flipbook a={a} b={b} x={0} y={0} motion="a-glide" flip />);
    expect(html).toContain("scale(-1 1)");
    expect(transformAndClass(html)).toEqual([]);
  });
});

describe("Eyelids", () => {
  it("converts cutout pixels to the Layer's bottom-centre space and rests hidden", () => {
    const html = renderToStaticMarkup(
      <Eyelids
        points={[
          [60, 30],
          [80, 30],
        ]}
        w={200}
        h={100}
        rx={4}
        ry={3}
        tone="#123"
        delay={2}
      />,
    );
    const lids = [...html.matchAll(/<ellipse[^>]*>/g)].map((m) => m[0]);
    expect(lids).toHaveLength(2);
    expect(lids[0]).toContain('cx="-40"');
    expect(lids[0]).toContain('cy="-70"');
    expect(lids[1]).toContain('cx="-20"');
    for (const lid of lids) {
      expect(lid).toContain('opacity="0"');
      expect(lid).toContain('class="a-blink"');
      expect(lid).toContain("animation-delay:2s");
    }
  });
});

describe("Backdrop", () => {
  it("fills the whole stage viewBox", () => {
    const html = renderToStaticMarkup(<Backdrop src="bg.webp" />);
    expect(html).toContain('width="1000"');
    expect(html).toContain('height="625"');
    expect(html).toContain('preserveAspectRatio="xMidYMid slice"');
  });
});
