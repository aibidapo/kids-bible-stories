/**
 * Raster layers inside the SVG stage. A scene is a background image plus
 * character cutouts with alpha, each positioned by an outer <g transform>
 * and animated, if at all, by an inner <g className>. The <image> itself
 * never carries either, so hard constraint 1 cannot be broken from here.
 */
import type { ReactNode } from "react";
import { VB } from "./base";

export interface LayerProps {
  src: string;
  /** Natural pixel size of the asset. */
  w: number;
  h: number;
  /** Ground point in viewBox units: the image's bottom-centre lands here. */
  x: number;
  y: number;
  /** viewBox units per asset pixel. */
  scale?: number;
  /** Mirror horizontally so the figure faces the other way. */
  flip?: boolean;
  className?: string;
  /** Seconds to offset the motion class's cycle. */
  delay?: number;
  opacity?: number;
  children?: ReactNode;
}

export function Layer({
  src,
  w,
  h,
  x,
  y,
  scale = 1,
  flip = false,
  className,
  delay,
  opacity,
  children,
}: LayerProps) {
  const sx = flip ? -scale : scale;
  return (
    <g transform={`translate(${x} ${y}) scale(${sx} ${scale})`}>
      <g className={className} style={delay ? { animationDelay: `${delay}s` } : undefined}>
        <image href={src} x={-w / 2} y={-h} width={w} height={h} opacity={opacity} />
        {children}
      </g>
    </g>
  );
}

export interface PartProps {
  src: string;
  /** Part image size and its offset inside the original cutout. */
  tw: number;
  th: number;
  ox: number;
  oy: number;
  /** Original cutout size, so the anchor matches the body Layer. */
  w: number;
  h: number;
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  /** Motion class; its pivot must be declared in motion.css. */
  className: string;
  /** Seconds to offset the cycle so parts don't move in unison. */
  delay?: number;
}

/**
 * A part split off a cutout (see design/pipeline/split_tail.py) drawn in the
 * same local space as its body's Layer, so the two line up pixel for pixel at
 * rest, with its own motion class. Render it before or after the body
 * depending on which should cover the join.
 */
export function Part({ src, tw, th, ox, oy, w, h, x, y, scale = 1, flip = false, className, delay = 0 }: PartProps) {
  const sx = flip ? -scale : scale;
  return (
    <g transform={`translate(${x} ${y}) scale(${sx} ${scale})`}>
      <g className={className} style={{ animationDelay: `${delay}s` }}>
        <image href={src} x={ox - w / 2} y={oy - h} width={tw} height={th} />
      </g>
    </g>
  );
}

/** A tail: a Part that flicks about its root corner. Render before the body. */
export function Tail({ root, ...rest }: Omit<PartProps, "className"> & { root: "tl" | "tr" }) {
  return <Part {...rest} className={root === "tr" ? "a-tail-flick-tr" : "a-tail-flick-tl"} />;
}

export interface Frame {
  src: string;
  w: number;
  h: number;
  /** Anchor point in the frame's own pixels; frames are aligned on it. */
  ax: number;
  ay: number;
  /** viewBox units per frame pixel. */
  s: number;
}

/**
 * Two-frame flipbook (wings up / wings down) aligned on a shared anchor such
 * as the eye, so the swap reads as a flap, not a jump. Frame A rests visible
 * so Calm mode shows one clean pose. The outer group positions; `motion` is
 * the class on the group the frames sit in (a glide or drift path).
 */
export function Flipbook({
  a,
  b,
  x,
  y,
  flip = false,
  motion,
  delay = 0,
}: {
  a: Frame;
  b: Frame;
  x: number;
  y: number;
  flip?: boolean;
  motion?: string;
  delay?: number;
}) {
  const sx = flip ? -1 : 1;
  const style = { animationDelay: `${delay}s` };
  return (
    <g transform={`translate(${x} ${y}) scale(${sx} 1)`}>
      <g className={motion} style={style}>
        <image
          href={a.src}
          x={-a.ax * a.s}
          y={-a.ay * a.s}
          width={a.w * a.s}
          height={a.h * a.s}
          opacity="1"
          className="a-frame-a"
          style={style}
        />
        <image
          href={b.src}
          x={-b.ax * b.s}
          y={-b.ay * b.s}
          width={b.w * b.s}
          height={b.h * b.s}
          opacity="0"
          className="a-frame-b"
          style={style}
        />
      </g>
    </g>
  );
}

/** Full-frame background image. */
export function Backdrop({ src }: { src: string }) {
  return (
    <image
      href={src}
      x="0"
      y="0"
      width={VB.w}
      height={VB.h}
      preserveAspectRatio="xMidYMid slice"
    />
  );
}

/**
 * Blink lids over a cutout's eyes. Points are in the cutout's own pixel
 * space measured from its top-left; they are converted to the Layer's local
 * space (bottom-centre origin) here. Lids rest at opacity 0, so Calm mode
 * leaves the eyes open.
 */
export function Eyelids({
  points,
  w,
  h,
  rx,
  ry,
  tone,
  delay = 0,
}: {
  points: [number, number][];
  w: number;
  h: number;
  rx: number;
  ry: number;
  tone: string;
  /** Seconds to offset this character's blink cycle, so a cast never blinks in unison. */
  delay?: number;
}) {
  return (
    <g>
      {points.map(([px, py], i) => (
        <ellipse
          key={i}
          cx={px - w / 2}
          cy={py - h}
          rx={rx}
          ry={ry}
          fill={tone}
          opacity="0"
          className="a-blink"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </g>
  );
}
