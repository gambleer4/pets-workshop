import {
  AbsoluteFill,
  getRemotionEnvironment,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ANALYSE_AUDIO, EXTRAITS, type ArtisteId, type MarqueurExtrait } from "../config";
import { inter } from "../components/fonts";
import { secousse } from "../components/Mouvement";
import { PortraitArtiste } from "../components/PortraitArtiste";
import { AvecSpectre, basses, Egaliseur } from "../components/Reactif";
import { Annonce } from "./Annonce";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Scène PAUSE, en un seul plan : l'annonce « KERY JAMES : » sur la photo
// assombrie, puis la photo s'éclaire quand le rappeur commence. Pendant
// l'extrait, la photo pulse sur les basses et un égaliseur suit le morceau.
// La zone du bas reste vide pour la phrase ajoutée au montage.
// Le cadre pointillé n'apparaît que dans le Studio, jamais dans le rendu.
export const ExtraitPause: React.FC<{
  artiste: ArtisteId;
  marqueur?: MarqueurExtrait;
  annonce?: number;
}> = ({ artiste, marqueur, annonce = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const debut = marqueur ? EXTRAITS[marqueur].debut : null;
  const pendantExtrait = frame >= annonce;

  const contenu = (spectre: number[] | null) => {
    const pulsation = pendantExtrait ? Math.min(1, Math.max(0, (basses(spectre) - 0.7) / 0.25)) : 0;
    const coupDeZoom = interpolate(frame, [annonce, annonce + 10], [0.07, 0], clamp);
    const { translate, rotate } = secousse(frame, [annonce], 18);

    return (
      <>
        <AbsoluteFill style={{ scale: 1 + pulsation * 0.05 + coupDeZoom, translate, rotate }}>
          <PortraitArtiste
            artiste={artiste}
            luminosite={interpolate(frame, [annonce - 4, annonce + 10], [0.45, 0.85], clamp) + pulsation * 0.12}
            entree
          />
        </AbsoluteFill>

        <AbsoluteFill
          style={{ background: "linear-gradient(to bottom, transparent 62%, rgba(0,0,0,0.9) 82%)" }}
        />

        <Egaliseur
          spectre={pendantExtrait ? spectre : null}
          opacite={interpolate(
            frame,
            [annonce, annonce + 8, durationInFrames - 8, durationInFrames - 1],
            [0, 0.9, 0.9, 0],
            clamp,
          )}
        />
      </>
    );
  };

  return (
    <AbsoluteFill>
      {ANALYSE_AUDIO && debut !== null ? (
        <AvecSpectre fichier={ANALYSE_AUDIO} frameMorceau={Math.round(debut * fps) + frame - annonce}>
          {contenu}
        </AvecSpectre>
      ) : (
        contenu(null)
      )}

      {annonce > 0 && frame < annonce + 10 ? <Annonce artiste={artiste} sortie={annonce} /> : null}

      {getRemotionEnvironment().isStudio && pendantExtrait ? (
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
