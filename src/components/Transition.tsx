import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";

// Bord déchiré, fixe pour une même graine : décalages en pixels tous les 4 %.
const bord = (graine: string) =>
  new Array(26).fill(true).map((_, i) => ({
    x: i * 4,
    y: (random(`${graine}-${i}`) - 0.5) * 70,
  }));

// La scène entre en recouvrant la précédente, comme une feuille déchirée qui
// glisse de bas en haut. `duree` = durée du chevauchement entre les deux scènes.
export const EntreeDechiree: React.FC<{
  duree: number;
  graine: string;
  children: React.ReactNode;
}> = ({ duree, graine, children }) => {
  const frame = useCurrentFrame();
  if (frame >= duree) return <AbsoluteFill style={{ backgroundColor: "#000" }}>{children}</AbsoluteFill>;

  const progression = interpolate(frame, [0, duree], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  // Le bord part sous l'image et finit au-dessus, marge comprise.
  const haut = interpolate(progression, [0, 1], [108, -8]);
  const decoupe = (decalage: number) =>
    `polygon(${[
      ...bord(graine).map((p) => `${p.x}% calc(${haut}% + ${p.y + decalage}px)`),
      "100% 100%",
      "0% 100%",
    ].join(", ")})`;

  return (
    <AbsoluteFill>
      {/* Liseré de papier clair qui dépasse au-dessus du bord déchiré. */}
      <AbsoluteFill style={{ backgroundColor: "#d6d6d6", clipPath: decoupe(-16), filter: "url(#encre)" }} />
      <AbsoluteFill style={{ backgroundColor: "#000", clipPath: decoupe(0) }}>
        <AbsoluteFill
          style={{
            translate: `0px ${interpolate(progression, [0, 1], [60, 0])}px`,
            scale: interpolate(progression, [0, 1], [1.05, 1]),
          }}
        >
          {children}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
