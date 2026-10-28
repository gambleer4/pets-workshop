import { AbsoluteFill, Sequence } from "remotion";
import type { SceneId } from "./config";
import { Filtres } from "./components/Filtres";
import { Grain } from "./components/Grain";
import { ImagesProvider, type ImagesDisponibles } from "./components/images";
import { Flash, FonduAuNoir, Poussiere, Vignette } from "./components/Overlays";
import { ExtraitAudio, extraitOriginal, FondMusical, VoixOff } from "./components/Sons";
import { dureesVoix, type VoixTrouvees } from "./components/voix";
import { Annonce } from "./scenes/Annonce";
import { ExtraitPause } from "./scenes/ExtraitPause";
import {
  AngleMort,
  BruitOdeur,
  Contexte,
  CranLicra,
  Haiti,
  Louverture,
  Negrier,
  RosaParks,
  TamTam,
  YesWeCan,
} from "./scenes/explications";
import { Intro } from "./scenes/Intro";
import { Outro } from "./scenes/Outro";
import { construireTimeline, type Segment } from "./timeline";

export type VideoProps = {
  imagesDisponibles: ImagesDisponibles;
  voix: VoixTrouvees;
};

const SCENES: Record<SceneId, React.FC> = {
  intro: Intro,
  contexte: Contexte,
  keryAngleMort: AngleMort,
  keryChirac: BruitOdeur,
  keryTamTam: TamTam,
  youssNegrier: Negrier,
  youssHaiti: Haiti,
  youssCranLicra: CranLicra,
  linoRosaParks: RosaParks,
  linoLouverture: Louverture,
  refrainObama: YesWeCan,
  outro: Outro,
};

const Segment: React.FC<{ segment: Segment; voix: VoixTrouvees }> = ({ segment, voix }) => {
  if (segment.type === "annonce") return <Annonce artiste={segment.artiste} />;
  if (segment.type === "pause") {
    return (
      <>
        <ExtraitPause artiste={segment.artiste} marqueur={segment.marqueur} />
        {extraitOriginal(segment.marqueur) ? <ExtraitAudio marqueur={segment.marqueur} /> : null}
      </>
    );
  }
  const Scene = SCENES[segment.scene];
  const voixScene = voix[segment.scene];
  return (
    <>
      <Scene />
      {voixScene ? <VoixOff fichier={voixScene.fichier} /> : null}
    </>
  );
};

export const MusiqueNegre: React.FC<VideoProps> = ({ imagesDisponibles, voix }) => {
  const { segments, flashes, dureeFlash, durationInFrames } = construireTimeline(dureesVoix(voix));
  const outro = segments[segments.length - 1];

  return (
    <ImagesProvider value={imagesDisponibles}>
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <Filtres />

        {segments.map((s) => (
          <Sequence key={s.id} name={s.name} from={s.from} durationInFrames={s.durationInFrames} premountFor={30}>
            <Segment segment={s} voix={voix} />
          </Sequence>
        ))}

        <Grain opacity={0.12} />
        <Poussiere />
        <Vignette />

        {flashes.map((from) => (
          <Sequence key={`flash-${from}`} name="Flash" from={from} durationInFrames={dureeFlash}>
            <Flash />
          </Sequence>
        ))}

        <Sequence name="Fondu au noir" from={outro.from} durationInFrames={durationInFrames - outro.from}>
          <FonduAuNoir duree={45} />
        </Sequence>

        <FondMusical segments={segments} />
      </AbsoluteFill>
    </ImagesProvider>
  );
};
