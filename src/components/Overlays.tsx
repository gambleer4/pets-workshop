import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        "radial-gradient(ellipse 85% 70% at 50% 48%, transparent 45%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.95) 100%)",
    }}
  />
);

export const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#fff",
        opacity: interpolate(frame, [0, 1, durationInFrames], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    />
  );
};

// Fondu au noir sur les `duree` dernières images de la séquence.
export const FonduAuNoir: React.FC<{ duree: number }> = ({ duree }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        opacity: interpolate(frame, [durationInFrames - duree, durationInFrames - 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    />
  );
};

// Poussière et taches de photocopieuse, renouvelées toutes les 3 images.
export const Poussiere: React.FC<{ quantite?: number }> = ({ quantite = 70 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tirage = Math.floor(frame / 3);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={width} height={height}>
        {new Array(quantite).fill(true).map((_, i) => {
          const g = `${tirage}-${i}`;
          const taille = 1 + random(`t${g}`) ** 4 * 5;
          return (
            <circle
              key={i}
              cx={random(`x${g}`) * width}
              cy={random(`y${g}`) * height}
              r={taille}
              fill="#fff"
              opacity={0.25 + random(`o${g}`) * 0.5}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
