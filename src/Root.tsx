import { Composition, type CalculateMetadataFunction } from "remotion";
import { FPS, HEIGHT, WIDTH } from "./config";
import { AUCUNE_IMAGE, verifierImages } from "./components/images";
import { dureesVoix, trouverVoix } from "./components/voix";
import { construireTimeline } from "./timeline";
import { MusiqueNegre, type VideoProps } from "./Video";

// Avant le rendu : vérifie quelles photos et quelles voix off sont présentes
// dans public/, et allonge les scènes dont la voix off dépasse.
const calculateMetadata: CalculateMetadataFunction<VideoProps> = async ({ props }) => {
  const [imagesDisponibles, voix] = await Promise.all([verifierImages(), trouverVoix()]);
  return {
    durationInFrames: construireTimeline(dureesVoix(voix)).durationInFrames,
    props: { ...props, imagesDisponibles, voix },
  };
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="MusiqueNegre"
    component={MusiqueNegre}
    durationInFrames={construireTimeline().durationInFrames}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{ imagesDisponibles: AUCUNE_IMAGE, voix: {} }}
    calculateMetadata={calculateMetadata}
  />
);
