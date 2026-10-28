import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { VOIX_OFF, VOIX_OFF_VOLUME, type SceneId } from "./config";
import { Filtres } from "./components/Filtres";
import { Grain } from "./components/Grain";
import { ImagesProvider, type ImagesDisponibles } from "./components/images";
import { Flash, FonduAuNoir, Poussiere, Vignette } from "./components/Overlays";
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

const Segment: React.FC<{ segment: Segment }> = ({ segment }) => {
  if (segment.type === "annonce") return <Annonce artiste={segment.artiste} />;
  if (segment.type === "pause") return <ExtraitPause artiste={segment.artiste} marqueur={segment.marqueur} />;
  const Scene = SCENES[segment.scene];
  return <Scene />;
};

export const MusiqueNegre: React.FC<VideoProps> = ({ imagesDisponibles }) => {
  const { segments, flashes, dureeFlash, durationInFrames } = construireTimeline();
  const outro = segments[segments.length - 1];

  return (
    <ImagesProvider value={imagesDisponibles}>
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <Filtres />

        {segments.map((s) => (
          <Sequence key={s.id} name={s.name} from={s.from} durationInFrames={s.durationInFrames} premountFor={30}>
            <Segment segment={s} />
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

        {VOIX_OFF ? <Audio src={staticFile(VOIX_OFF)} volume={VOIX_OFF_VOLUME} /> : null}
      </AbsoluteFill>
    </ImagesProvider>
  );
};
