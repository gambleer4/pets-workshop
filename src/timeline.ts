// Ordre des scènes et calcul des positions (en images).
// Fichier sans dépendance à React : il sert aussi au script des timecodes.

import {
  DUREE_ANNONCE,
  DUREE_FLASH,
  DUREES_SCENES,
  EXTRAITS,
  FPS,
  type ArtisteId,
  type MarqueurExtrait,
  type SceneId,
} from "./config";

export type Section =
  | "intro"
  | "contexte"
  | "kery"
  | "youssoupha"
  | "lino"
  | "refrain"
  | "outro";

type Etape =
  | { section: Section; scene: SceneId }
  | { section: Section; extrait: MarqueurExtrait };

const STRUCTURE: Etape[] = [
  { section: "intro", scene: "intro" },
  { section: "contexte", scene: "contexte" },

  { section: "kery", extrait: "EXTRAIT_KERY_1" },
  { section: "kery", scene: "keryAngleMort" },
  { section: "kery", scene: "keryChirac" },
  { section: "kery", extrait: "EXTRAIT_KERY_2" },
  { section: "kery", scene: "keryTamTam" },
  { section: "kery", extrait: "EXTRAIT_KERY_3" },

  { section: "youssoupha", extrait: "EXTRAIT_YOUSS_1" },
  { section: "youssoupha", scene: "youssNegrier" },
  { section: "youssoupha", extrait: "EXTRAIT_YOUSS_2" },
  { section: "youssoupha", scene: "youssHaiti" },
  { section: "youssoupha", extrait: "EXTRAIT_YOUSS_3" },
  { section: "youssoupha", scene: "youssCranLicra" },

  { section: "lino", extrait: "EXTRAIT_LINO_1" },
  { section: "lino", scene: "linoRosaParks" },
  { section: "lino", extrait: "EXTRAIT_LINO_2" },
  { section: "lino", scene: "linoLouverture" },

  { section: "refrain", extrait: "EXTRAIT_REFRAIN" },
  { section: "refrain", scene: "refrainObama" },

  { section: "outro", scene: "outro" },
];

type Base = {
  id: string;
  name: string;
  section: Section;
  from: number;
  durationInFrames: number;
};

export type Segment =
  | (Base & { type: "scene"; scene: SceneId })
  | (Base & { type: "annonce"; artiste: ArtisteId; marqueur: MarqueurExtrait })
  | (Base & { type: "pause"; artiste: ArtisteId; marqueur: MarqueurExtrait });

export const secondes = (s: number) => Math.round(s * FPS);

export const construireTimeline = () => {
  const segments: Segment[] = [];
  let from = 0;

  for (const etape of STRUCTURE) {
    if ("scene" in etape) {
      const durationInFrames = secondes(DUREES_SCENES[etape.scene]);
      segments.push({
        type: "scene",
        id: etape.scene,
        name: etape.scene,
        scene: etape.scene,
        section: etape.section,
        from,
        durationInFrames,
      });
      from += durationInFrames;
      continue;
    }

    const { artiste, duree } = EXTRAITS[etape.extrait];
    const annonce = secondes(DUREE_ANNONCE);
    segments.push({
      type: "annonce",
      id: `annonce-${etape.extrait}`,
      name: `ANNONCE ${etape.extrait}`,
      artiste,
      marqueur: etape.extrait,
      section: etape.section,
      from,
      durationInFrames: annonce,
    });
    from += annonce;

    const pause = secondes(duree);
    segments.push({
      type: "pause",
      id: etape.extrait,
      name: etape.extrait,
      artiste,
      marqueur: etape.extrait,
      section: etape.section,
      from,
      durationInFrames: pause,
    });
    from += pause;
  }

  // Un flash au début de chaque nouvelle section (sauf la première).
  const flashes = segments
    .filter((s, i) => i > 0 && s.section !== segments[i - 1].section)
    .map((s) => Math.max(0, s.from - 1));

  return {
    segments,
    flashes,
    dureeFlash: secondes(DUREE_FLASH),
    durationInFrames: from,
  };
};
