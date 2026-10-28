import { AbsoluteFill, getRemotionEnvironment, interpolate, useCurrentFrame } from "remotion";
import type { ArtisteId, MarqueurExtrait } from "../config";
import { inter } from "../components/fonts";
import { PortraitArtiste } from "../components/PortraitArtiste";
import { Annonce } from "./Annonce";

// Scène PAUSE, en un seul plan : l'annonce « KERY JAMES : » sur la photo
// assombrie, puis la photo s'éclaire et zoome lentement pendant l'extrait.
// La zone du bas reste vide pour la phrase ajoutée au montage.
// Le cadre pointillé n'apparaît que dans le Studio, jamais dans le rendu.
export const ExtraitPause: React.FC<{
  artiste: ArtisteId;
  marqueur?: MarqueurExtrait;
  annonce?: number;
}> = ({ artiste, marqueur, annonce = 0 }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <PortraitArtiste
        artiste={artiste}
        luminosite={interpolate(frame, [annonce - 4, annonce + 10], [0.45, 0.85], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
        entree
      />

      <AbsoluteFill
        style={{ background: "linear-gradient(to bottom, transparent 62%, rgba(0,0,0,0.9) 82%)" }}
      />

      {annonce > 0 && frame < annonce + 10 ? <Annonce artiste={artiste} sortie={annonce} /> : null}

      {getRemotionEnvironment().isStudio && frame >= annonce ? (
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
};
