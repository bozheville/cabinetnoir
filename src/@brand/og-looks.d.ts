// Types for the plain CommonJS module og-looks.js, which must stay
// requirable by plain Node scripts (see the comment in that file).

export declare const TONES: Record<string, { base: string; seam: string }>;
export declare const ORNAMENTS: Record<string, (ink: string) => string>;
export declare const FRAMES: Record<string, (w: number, h: number, c: string) => string>;
export interface OgLook {
  tone: string;
  ornament: string;
  frame: string;
}
export declare const LOOKS: Record<string, OgLook>;
export declare function cardGround(width: number, height: number, look: OgLook): Buffer;
export declare function textContrast(toneName: string): { title: number; body: number };
