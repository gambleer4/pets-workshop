import { interpolate, random } from "remotion";

// Tremblement « stop-motion » : une petite valeur aléatoire qui change toutes
// les `cadence` images, comme un collage animé image par image.
export const tremble = (graine: string, frame: number, amplitude: number, cadence = 4) =>
  (random(`${graine}-${Math.floor(frame / cadence)}`) - 0.5) * 2 * amplitude;

// Secousse de caméra qui s'amortit après chaque impact (en images).
export const secousse = (frame: number, impacts: number[], force = 14) => {
  let x = 0;
  let y = 0;
  let r = 0;
  for (const impact of impacts) {
    const t = frame - impact;
    if (t < 0 || t > 9) continue;
    const amorti = interpolate(t, [0, 9], [1, 0]) ** 2;
    x += tremble(`sx${impact}`, t, force * amorti, 1);
    y += tremble(`sy${impact}`, t, force * amorti, 1);
    r += tremble(`sr${impact}`, t, 0.6 * amorti, 1);
  }
  return { translate: `${x}px ${y}px`, rotate: `${r}deg` };
};
