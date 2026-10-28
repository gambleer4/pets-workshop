// Ordre des scènes et calcul des positions (en images).
// Fichier sans dépendance à React : il sert aussi au script des timecodes.

import {
  DUREE_ANNONCE,
  DUREE_FLASH,
  DUREE_TRANSITION,
  DUREES_SCENES,
  EXTRAITS,
  FPS,
  VOIX_OFF,
  type ArtisteId,
  type MarqueurExtrait,
  type SceneId,
} from "./config";

export type Section =
  | "intro"
  | "contexte"
  | "kery"
  | "youssoupha"
  | "passePasse"
  | "refrain"
  | "lino"
  | "outro";

type Etape =
  | { section: Section; scene: SceneId }
  | { section: Section; extrait: MarqueurExtrait };

// La vidéo suit l'ordre du morceau : couplet de Kery James, couplet de
// Youssoupha, passe-passe Kery James / Lino, refrain, couplet de Lino.
const STRUCTURE: Etape[] = [
  { section: "intro", scene: "intro" },
  { section: "contexte", scene: "contexte" },

  { section: "kery", extrait: "EXTRAIT_KERY_1" },
  { section: "kery", scene: "keryRosaParks" },
  { section: "kery", extrait: "EXTRAIT_KERY_2" },
  { section: "kery", scene: "keryLouverture" },

  { section: "youssoupha", extrait: "EXTRAIT_YOUSS_1" },
  { section: "youssoupha", scene: "youssAngleMort" },
  { section: "youssoupha", scene: "youssChirac" },
  { section: "youssoupha", extrait: "EXTRAIT_YOUSS_2" },

  { section: "passePasse", scene: "duoTamTam" },
  { section: "passePasse", extrait: "EXTRAIT_KERY_LINO" },

  { section: "refrain", extrait: "EXTRAIT_REFRAIN" },
  { section: "refrain", scene: "refrainObama" },

  { section: "lino", extrait: "EXTRAIT_LINO_1" },
  { section: "lino", scene: "linoNegrier" },
  { section: "lino", extrait: "EXTRAIT_LINO_2" },
  { section: "lino", scene: "linoHaiti" },
  { section: "lino", extrait: "EXTRAIT_LINO_3" },
  { section: "lino", scene: "linoCranLicra" },

  { section: "outro", scene: "outro" },
];

type Base = {
  id: string;
  name: string;
  section: Section;
  from: number;
  durationInFrames: number;
};

// Un segment « extrait » contient l'annonce puis l'extrait, dans le même plan.
// L'extrait commence à `from + annonce`.
export type Segment =
  | (Base & { type: "scene"; scene: SceneId })
  | (Base & { type: "extrait"; artiste: ArtisteId; marqueur: MarqueurExtrait; annonce: number });

export const secondes = (s: number) => Math.round(s * FPS);

// Durée (en secondes) des enregistrements de voix off trouvés, par scène.
export type DureesVoix = Partial<Record<SceneId, number>>;

// Une scène dure au moins sa durée de config.ts, et assez pour contenir sa voix off.
const dureeScene = (scene: SceneId, dureesVoix: DureesVoix) => {
  const voix = dureesVoix[scene];
  const avecVoix = voix === undefined ? 0 : VOIX_OFF.delai + voix + VOIX_OFF.marge;
  return secondes(Math.max(DUREES_SCENES[scene], avecVoix));
};

export const construireTimeline = (dureesVoix: DureesVoix = {}) => {
  const chevauchement = secondes(DUREE_TRANSITION);
  const segments: Segment[] = [];
  let from = 0;

  for (const etape of STRUCTURE) {
    // Chaque segment commence pendant la fin du précédent : c'est la transition.
    const debut = segments.length === 0 ? 0 : from - chevauchement;

    if ("scene" in etape) {
      const durationInFrames = dureeScene(etape.scene, dureesVoix);
      segments.push({
        type: "scene",
        id: etape.scene,
        name: etape.scene,
        scene: etape.scene,
        section: etape.section,
        from: debut,
        durationInFrames,
      });
      from = debut + durationInFrames;
      continue;
    }

    const { artiste, duree } = EXTRAITS[etape.extrait];
    const annonce = secondes(DUREE_ANNONCE);
    const durationInFrames = annonce + secondes(duree);
    segments.push({
      type: "extrait",
      id: etape.extrait,
      name: etape.extrait,
      artiste,
      marqueur: etape.extrait,
      annonce,
      section: etape.section,
      from: debut,
      durationInFrames,
    });
    from = debut + durationInFrames;
  }

  // Un flash au début de chaque nouvelle section (sauf la première).
  const flashes = segments
    .filter((s, i) => i > 0 && s.section !== segments[i - 1].section)
    .map((s) => s.from + Math.floor(chevauchement / 2));

  return {
    segments,
    flashes,
    chevauchement,
    dureeFlash: secondes(DUREE_FLASH),
    durationInFrames: from,
  };
};
