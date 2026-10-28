import { useWindowedAudioData, visualizeAudio } from "@remotion/media-utils";
import { staticFile, useVideoConfig } from "remotion";

// Spectre de `fichier` à l'image `frameMorceau` (en images depuis le début du
// morceau), mis à l'échelle en décibels pour un rendu équilibré :
// -55 dB (presque rien) donne 0, -5 dB (le plus fort mesuré) donne 1.
// Le spectre vaut null tant que l'audio n'est pas chargé.
export const AvecSpectre: React.FC<{
  fichier: string;
  frameMorceau: number;
  children: (spectre: number[] | null) => React.ReactNode;
}> = ({ fichier, frameMorceau, children }) => {
  const { fps } = useVideoConfig();
  const frame = Math.max(0, frameMorceau);
  const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
    src: staticFile(fichier),
    frame,
    fps,
    windowInSeconds: 10,
  });
  if (!audioData) return children(null);

  const brut = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: 64,
    optimizeFor: "speed",
    dataOffsetInSeconds,
  });
  return children(brut.map((v) => Math.min(1, Math.max(0, (20 * Math.log10(v + 1e-9) + 55) / 50))));
};

// Intensité des basses (0 à 1) d'un spectre.
export const basses = (spectre: number[] | null) =>
  spectre ? spectre.slice(0, 6).reduce((a, v) => a + v, 0) / 6 : 0;

// Égaliseur façon photocopie : barres blanches symétriques autour d'une ligne.
export const Egaliseur: React.FC<{ spectre: number[] | null; opacite: number }> = ({ spectre, opacite }) => {
  const barres = 32;
  const valeurs = spectre ? spectre.slice(2, 2 + barres) : new Array<number>(barres).fill(0);

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: 1250,
        height: 150,
        display: "flex",
        alignItems: "center",
        gap: 8,
        opacity: opacite,
        filter: "url(#encre)",
      }}
    >
      {valeurs.map((v, i) => (
        <div
          key={i}
          style={{ flex: 1, height: `${Math.max(4, v ** 1.3 * 100)}%`, backgroundColor: "#ececec" }}
        />
      ))}
    </div>
  );
};
