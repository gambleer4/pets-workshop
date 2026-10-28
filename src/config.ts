// Toutes les durées de la vidéo sont ici, en secondes.
// Après modification, relance `npm run timecodes` pour mettre à jour le README.

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// --- Personnes et photos (fichiers dans public/images/) -------------------

export const PERSONNES = {
  kery: { nom: "Kery James", fichier: "kery.jpg" },
  lino: { nom: "Lino", fichier: "lino.jpg" },
  youssoupha: { nom: "Youssoupha", fichier: "youssoupha.jpg" },
  lesquen: { nom: "Henry de Lesquen", fichier: "lesquen.jpg" },
  chirac: { nom: "Jacques Chirac", fichier: "chirac.jpg" },
  rosaParks: { nom: "Rosa Parks", fichier: "rosa-parks.jpg" },
  toussaint: { nom: "Toussaint Louverture", fichier: "toussaint-louverture.jpg" },
  bonaparte: { nom: "Napoléon Bonaparte", fichier: "bonaparte.jpg" },
  obama: { nom: "Barack Obama", fichier: "obama.jpg" },
} as const;

export type PersonneId = keyof typeof PERSONNES;

// "trio" = les trois artistes côte à côte (utilisé pour le refrain).
export type ArtisteId = "kery" | "lino" | "youssoupha" | "trio";

export const NOMS_ANNONCE: Record<ArtisteId, string> = {
  kery: "KERY JAMES",
  lino: "LINO",
  youssoupha: "YOUSSOUPHA",
  trio: "REFRAIN",
};

// --- Extraits du morceau (scènes PAUSE) ------------------------------------
// `duree` = durée de la pause en secondes : cale-la sur la longueur réelle
// de l'extrait que tu monteras.

export const EXTRAITS = {
  EXTRAIT_KERY_1: { artiste: "kery", duree: 5 },
  EXTRAIT_KERY_2: { artiste: "kery", duree: 5 },
  EXTRAIT_KERY_3: { artiste: "kery", duree: 5 },
  EXTRAIT_YOUSS_1: { artiste: "youssoupha", duree: 5 },
  EXTRAIT_YOUSS_2: { artiste: "youssoupha", duree: 5 },
  EXTRAIT_YOUSS_3: { artiste: "youssoupha", duree: 5 },
  EXTRAIT_LINO_1: { artiste: "lino", duree: 5 },
  EXTRAIT_LINO_2: { artiste: "lino", duree: 5 },
  EXTRAIT_REFRAIN: { artiste: "trio", duree: 5 },
} satisfies Record<string, { artiste: ArtisteId; duree: number }>;

export type MarqueurExtrait = keyof typeof EXTRAITS;

// Annonce « KERY JAMES : » affichée juste avant chaque extrait.
export const DUREE_ANNONCE = 1.3;

// --- Scènes ----------------------------------------------------------------

export const DUREES_SCENES = {
  intro: 5.5,
  contexte: 7,
  keryAngleMort: 4.5,
  keryChirac: 5,
  keryTamTam: 4.5,
  youssNegrier: 4.5,
  youssHaiti: 4.5,
  youssCranLicra: 4.5,
  linoRosaParks: 5,
  linoLouverture: 7,
  refrainObama: 5,
  outro: 6,
};

export type SceneId = keyof typeof DUREES_SCENES;

// Flash blanc entre deux sections (se superpose à la coupe, n'allonge pas la vidéo).
export const DUREE_FLASH = 0.25;

// --- Voix off --------------------------------------------------------------
// Dépose ton fichier dans public/audio/ puis renseigne son chemin,
// par exemple "audio/voix-off.mp3". Laisse null tant qu'il n'existe pas.

export const VOIX_OFF: string | null = null;
export const VOIX_OFF_VOLUME = 1;
