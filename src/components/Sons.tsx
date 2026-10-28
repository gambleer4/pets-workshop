import { Audio } from "@remotion/media";
import { useMemo } from "react";
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
// Largeur (en images) du lissage des changements de volume de l'instrumentale.
const LISSAGE = 16;

// Vrai si cet extrait est joué depuis le morceau original.
export const extraitOriginal = (marqueur: MarqueurExtrait) =>
  MORCEAU_ORIGINAL !== null && EXTRAITS[marqueur].debut !== null;

// Volume de l'instrumentale pour chaque image de la vidéo : bas sous la voix
// off, plus fort sur les annonces, coupé pendant un extrait du morceau
// original (fort sinon). Les paliers sont ensuite lissés pour éviter les à-coups.
const courbeVolume = (segments: Segment[], total: number, fond: NonNullable<typeof FOND_MUSICAL>) => {
  const cible = new Array<number>(total).fill(fond.volumeSousVoix);
  const rempli = new Array<boolean>(total).fill(false);
  for (const s of segments) {
    for (let f = s.from; f < Math.min(total, s.from + s.durationInFrames); f++) {
      if (rempli[f]) continue; // Pendant une transition, le segment qui finit garde la main.
      rempli[f] = true;
      if (s.type === "scene") continue;
      if (f < s.from + s.annonce) cible[f] = fond.volumeAnnonce;
      else cible[f] = extraitOriginal(s.marqueur) ? 0 : fond.volumePause;
    }
    // L'instrumentale doit être éteinte quand le rappeur commence : on anticipe.
    if (s.type === "extrait" && extraitOriginal(s.marqueur)) {
      const debut = s.from + s.annonce;
      for (let f = Math.max(0, debut - LISSAGE / 2); f < debut; f++) cible[f] = 0;
    }
  }
  const lisse = new Array<number>(total);
  for (let f = 0; f < total; f++) {
    let somme = 0;
    let n = 0;
    for (let k = f - LISSAGE / 2; k <= f + LISSAGE / 2; k++) {
      if (k < 0 || k >= total) continue;
      somme += cible[k];
      n++;
    }
    lisse[f] = somme / n;
  }
  return lisse;
};

// Instrumentale sous toute la vidéo, calée pour que `calage` tombe au début
// du premier extrait.
export const FondMusical: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const courbe = useMemo(
    () => (FOND_MUSICAL ? courbeVolume(segments, durationInFrames, FOND_MUSICAL) : []),
    [segments, durationInFrames],
  );
  if (!FOND_MUSICAL) return null;

  const fondus =
    interpolate(frame, [0, 15], [0, 1], clamp) *
    interpolate(frame, [durationInFrames - 45, durationInFrames - 1], [1, 0], clamp);
  const premierExtrait = segments.find((s) => s.type === "extrait");
  const debutExtrait = premierExtrait?.type === "extrait" ? premierExtrait.from + premierExtrait.annonce : 0;
  const decalage = Math.round(FOND_MUSICAL.calage * fps) - debutExtrait;

  return (
    <Sequence name="Fond musical" from={Math.max(0, -decalage)} layout="none">
      <Audio
        src={staticFile(FOND_MUSICAL.fichier)}
        trimBefore={Math.max(0, decalage)}
        volume={(courbe[frame] ?? 0) * fondus}
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

// Extrait du morceau original pendant une pause : attaque très courte pour
// ne pas manger le premier mot, sortie un peu plus douce.
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
        interpolate(frame, [0, 3, durationInFrames - 9, durationInFrames - 1], [0, 1, 1, 0], clamp)
      }
    />
  );
};
