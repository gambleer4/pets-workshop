import { AbsoluteFill, getRemotionEnvironment } from "remotion";
import type { ArtisteId, MarqueurExtrait } from "../config";
import { inter } from "../components/fonts";
import { PortraitArtiste } from "../components/PortraitArtiste";

// Scène PAUSE : la photo de l'artiste en zoom lent pendant l'extrait.
// La zone du bas reste vide pour la phrase ajoutée au montage.
// Le cadre pointillé n'apparaît que dans le Studio, jamais dans le rendu.
export const ExtraitPause: React.FC<{
  artiste: ArtisteId;
  marqueur?: MarqueurExtrait;
}> = ({ artiste, marqueur }) => (
  <AbsoluteFill>
    <PortraitArtiste artiste={artiste} luminosite={0.85} entree={false} />

    <AbsoluteFill
      style={{ background: "linear-gradient(to bottom, transparent 62%, rgba(0,0,0,0.9) 82%)" }}
    />

    {getRemotionEnvironment().isStudio ? (
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 140,
          height: 340,
          border: "3px dashed rgba(255,255,255,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: inter,
          fontSize: 40,
          color: "rgba(255,255,255,0.45)",
        }}
      >
        ZONE TEXTE{marqueur ? ` · ${marqueur}` : ""}
      </div>
    ) : null}
  </AbsoluteFill>
);
