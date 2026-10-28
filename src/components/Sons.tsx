import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import {
  EXTRAITS,
  FOND_MUSICAL,
  MORCEAU_ORIGINAL,
  MORCEAU_ORIGINAL_VOLUME,
  VOIX_OFF,
  type MarqueurExtrait,
} from "../config";
import type { Segment } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const RAMPE = 8;

// Vrai si cet extrait est joué depuis le morceau original.
export const extraitOriginal = (marqueur: MarqueurExtrait) =>
  MORCEAU_ORIGINAL !== null && EXTRAITS[marqueur].debut !== null;

// Instrumentale sous toute la vidéo. Le volume suit les scènes :
// bas sous la voix off, plus fort sur les annonces et les pauses,
// coupé pendant un extrait du morceau original.
export const FondMusical: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  if (!FOND_MUSICAL) return null;
  const fond = FOND_MUSICAL;

  const cible = (s: Segment) => {
    if (s.type === "pause") return extraitOriginal(s.marqueur) ? 0 : fond.volumePause;
    if (s.type === "annonce") return fond.volumeAnnonce;
    return fond.volumeSousVoix;
  };

  // Le volume rejoint celui du segment suivant pendant les dernières images du segment.
  const i = Math.max(0, segments.findIndex((s) => frame < s.from + s.durationInFrames));
  const actuel = segments[i];
  const suivant = segments[i + 1];
  const fin = actuel.from + actuel.durationInFrames;
  const volume = suivant
    ? interpolate(frame, [fin - RAMPE, fin], [cible(actuel), cible(suivant)], clamp)
    : cible(actuel);
  const fondus =
    interpolate(frame, [0, 15], [0, 1], clamp) *
    interpolate(frame, [durationInFrames - 45, durationInFrames - 1], [1, 0], clamp);

  // Décalage pour que `calage` tombe au début du premier extrait.
  const premierExtrait = segments.find((s) => s.type === "pause");
  const decalage = Math.round(fond.calage * fps) - (premierExtrait?.from ?? 0);

  return (
    <Sequence name="Fond musical" from={Math.max(0, -decalage)} layout="none">
      <Audio
        src={staticFile(fond.fichier)}
        trimBefore={Math.max(0, decalage)}
        volume={volume * fondus}
      />
    </Sequence>
  );
};

// Voix off d'une scène, légèrement décalée après la coupe.
export const VoixOff: React.FC<{ fichier: string }> = ({ fichier }) => {
  const { fps } = useVideoConfig();

  return (
    <Sequence name="Voix off" from={Math.round(VOIX_OFF.delai * fps)} layout="none">
      <Audio src={staticFile(fichier)} volume={VOIX_OFF.volume} />
    </Sequence>
  );
};

// Extrait du morceau original pendant une pause, avec fondus courts.
export const ExtraitAudio: React.FC<{ marqueur: MarqueurExtrait }> = ({ marqueur }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const debut = EXTRAITS[marqueur].debut;
  if (!MORCEAU_ORIGINAL || debut === null) return null;

  return (
    <Audio
      name={marqueur}
      src={staticFile(MORCEAU_ORIGINAL)}
      trimBefore={Math.round(debut * fps)}
      volume={
        MORCEAU_ORIGINAL_VOLUME *
        interpolate(frame, [0, 4, durationInFrames - 6, durationInFrames - 1], [0, 1, 1, 0], clamp)
      }
    />
  );
};
