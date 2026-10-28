import { Composition, type CalculateMetadataFunction } from "remotion";
import { FPS, HEIGHT, WIDTH } from "./config";
import { AUCUNE_IMAGE, verifierImages } from "./components/images";
import { construireTimeline } from "./timeline";
import { MusiqueNegre, type VideoProps } from "./Video";

// Avant le rendu : vérifie quelles photos sont présentes dans public/images/.
const calculateMetadata: CalculateMetadataFunction<VideoProps> = async ({ props }) => ({
  durationInFrames: construireTimeline().durationInFrames,
  props: { ...props, imagesDisponibles: await verifierImages() },
});

export const RemotionRoot: React.FC = () => (
  <Composition
    id="MusiqueNegre"
    component={MusiqueNegre}
    durationInFrames={construireTimeline().durationInFrames}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{ imagesDisponibles: AUCUNE_IMAGE }}
    calculateMetadata={calculateMetadata}
  />
);
