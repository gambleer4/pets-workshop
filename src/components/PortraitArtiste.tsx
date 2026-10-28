import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { ArtisteId } from "../config";
import { CollageTrio } from "./CollageTrio";
import { Photo } from "./Photo";

// Photo de l'artiste pour les annonces et les pauses : en haut de l'écran,
// fondue dans le noir, pour laisser le bas libre pour le texte.
// Pour le refrain et la passe-passe, les artistes en cartes collées avec un zoom lent.
export const PortraitArtiste: React.FC<{
  artiste: ArtisteId;
  luminosite: number;
  entree: boolean;
}> = ({ artiste, luminosite, entree }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  if (artiste === "trio" || artiste === "duo") {
    return (
      <AbsoluteFill
        style={{
          filter: `brightness(${luminosite})`,
          scale: interpolate(frame, [0, durationInFrames - 1], [1, 1.08], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div style={{ position: "absolute", top: 260, left: 0 }}>
          <CollageTrio artistes={artiste} noms={false} entree={entree} />
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1400 }}>
      <Photo personne={artiste} luminosite={luminosite} mouvement="zoom-avant" />
    </div>
  );
};
