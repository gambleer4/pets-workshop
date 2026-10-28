import { ALL_FORMATS, Input, UrlSource } from "mediabunny";
import { staticFile } from "remotion";
import { DUREES_SCENES, VOIX_OFF, type SceneId } from "../config";
import type { DureesVoix } from "../timeline";

export type VoixTrouvees = Partial<Record<SceneId, { fichier: string; duree: number }>>;

const mesurer = async (url: string) => {
  const input = new Input({ formats: ALL_FORMATS, source: new UrlSource(url) });
  try {
    return await input.computeDuration();
  } finally {
    input.dispose();
  }
};

// Cherche public/audio/voix/<scène>.mp3 (ou .m4a, .wav) et mesure sa durée.
export const trouverVoix = async (): Promise<VoixTrouvees> => {
  const scenes = Object.keys(DUREES_SCENES) as SceneId[];
  const trouvees = await Promise.all(
    scenes.map(async (scene) => {
      for (const format of VOIX_OFF.formats) {
        const fichier = `${VOIX_OFF.dossier}/${scene}.${format}`;
        try {
          const res = await fetch(staticFile(fichier), { method: "HEAD" });
          if (!res.ok) continue;
          return [scene, { fichier, duree: await mesurer(staticFile(fichier)) }] as const;
        } catch {
          // Fichier absent ou illisible : on essaie le format suivant.
        }
      }
      return null;
    }),
  );
  return Object.fromEntries(trouvees.filter((t) => t !== null));
};

export const dureesVoix = (voix: VoixTrouvees): DureesVoix =>
  Object.fromEntries(Object.entries(voix).map(([scene, v]) => [scene, v.duree]));
