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
  opacity,
  children,
}: LayerProps) {
  const sx = flip ? -scale : scale;
  return (
    <g transform={`translate(${x} ${y}) scale(${sx} ${scale})`}>
      <g className={className}>
        <image href={src} x={-w / 2} y={-h} width={w} height={h} opacity={opacity} />
        {children}
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
