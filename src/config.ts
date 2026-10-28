// Toutes les durées et tous les réglages audio de la vidéo sont ici, en secondes.
// Après modification, ou après avoir ajouté des fichiers de voix off,
// relance `npm run timecodes` pour mettre à jour le README.

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// --- Personnes et photos (fichiers dans public/images/) -------------------

// `cadrage` (facultatif) : point de l'image gardé au centre quand elle est
// recadrée, en % horizontal puis vertical. Par défaut "50% 30%".
// `exposition` (facultatif) : éclaircit (> 1) ou assombrit (< 1) la photo
// avant le traitement photocopie, si un visage sort trop sombre. Par défaut 1.
export const PERSONNES: Record<
  "kery" | "lino" | "youssoupha" | "lesquen" | "chirac" | "rosaParks" | "toussaint" | "bonaparte" | "obama",
  { nom: string; fichier: string; cadrage?: string; exposition?: number }
> = {
  kery: { nom: "Kery James", fichier: "kery.jpg", cadrage: "50% 40%", exposition: 1.3 },
  lino: { nom: "Lino", fichier: "lino.jpg", cadrage: "49% 35%", exposition: 1.35 },
  youssoupha: { nom: "Youssoupha", fichier: "youssoupha.jpg" },
  lesquen: { nom: "Henry de Lesquen", fichier: "lesquen.jpg", cadrage: "58% 30%" },
  chirac: { nom: "Jacques Chirac", fichier: "chirac.jpg" },
  // Rosa Parks est assise à droite dans la photo du bus.
  rosaParks: { nom: "Rosa Parks", fichier: "rosa-parks.jpg", cadrage: "90% 40%" },
  toussaint: { nom: "Toussaint Louverture", fichier: "toussaint-louverture.jpg", exposition: 1.4 },
  bonaparte: { nom: "Napoléon Bonaparte", fichier: "bonaparte.jpg" },
  obama: { nom: "Barack Obama", fichier: "obama.jpg", cadrage: "80% 30%" },
};

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
// `duree` : durée de la pause en secondes.
// `debut` : seconde du morceau original (MORCEAU_ORIGINAL, plus bas) où
// commence l'extrait. Laisse null tant que tu n'as pas le morceau original :
// pendant la pause, c'est alors l'instrumentale qui monte.

type Extrait = { artiste: ArtisteId; duree: number; debut: number | null };

const extraits = {
  EXTRAIT_KERY_1: { artiste: "kery", duree: 5, debut: null },
  EXTRAIT_KERY_2: { artiste: "kery", duree: 5, debut: null },
  EXTRAIT_KERY_3: { artiste: "kery", duree: 5, debut: null },
  EXTRAIT_YOUSS_1: { artiste: "youssoupha", duree: 5, debut: null },
  EXTRAIT_YOUSS_2: { artiste: "youssoupha", duree: 5, debut: null },
  EXTRAIT_YOUSS_3: { artiste: "youssoupha", duree: 5, debut: null },
  EXTRAIT_LINO_1: { artiste: "lino", duree: 5, debut: null },
  EXTRAIT_LINO_2: { artiste: "lino", duree: 5, debut: null },
  EXTRAIT_REFRAIN: { artiste: "trio", duree: 5, debut: null },
} satisfies Record<string, Extrait>;

export type MarqueurExtrait = keyof typeof extraits;
export const EXTRAITS: Record<MarqueurExtrait, Extrait> = extraits;

// Annonce « KERY JAMES : » affichée juste avant chaque extrait.
export const DUREE_ANNONCE = 1.3;

// --- Scènes ----------------------------------------------------------------

// Durée minimale de chaque scène. Elles sont calées sur le texte de
// TEXTE_VOIX_OFF.md lu à un rythme normal. Si ton enregistrement est plus
// long, la scène s'allonge toute seule.
export const DUREES_SCENES = {
  intro: 6,
  contexte: 9.5,
  keryAngleMort: 7,
  keryChirac: 7.5,
  keryTamTam: 8.5,
  youssNegrier: 7.5,
  youssHaiti: 6.5,
  youssCranLicra: 7,
  linoRosaParks: 8,
  linoLouverture: 8,
  refrainObama: 8.5,
  outro: 7,
};

export type SceneId = keyof typeof DUREES_SCENES;

// Flash blanc entre deux sections (se superpose à la coupe, n'allonge pas la vidéo).
export const DUREE_FLASH = 0.25;

// --- Voix off --------------------------------------------------------------
// Un fichier par scène dans public/audio/voix/, nommé comme la scène :
// intro.mp3, contexte.mp3, keryAngleMort.mp3… (liste dans TEXTE_VOIX_OFF.md).
// Formats acceptés : .mp3, .m4a, .wav. Une scène sans fichier reste muette.

export const VOIX_OFF = {
  dossier: "audio/voix",
  formats: ["mp3", "m4a", "wav"],
  volume: 1,
  // Silence avant la voix au début de la scène, et après elle avant la coupe.
  delai: 0.2,
  marge: 0.6,
};

// --- Musique ---------------------------------------------------------------

// Instrumentale jouée sous toute la vidéo : basse sous la voix off,
// plus forte pendant les annonces et les pauses.
// `calage` : seconde de l'instrumentale qui tombe pile au début du premier
// extrait (le beat démarre à 46,3 s dans le remake de Kyziz).
export const FOND_MUSICAL: {
  fichier: string;
  calage: number;
  volumeSousVoix: number;
  volumeAnnonce: number;
  volumePause: number;
} | null = {
  fichier: "audio/instrumental.mp3",
  calage: 46.3,
  volumeSousVoix: 0.18,
  volumeAnnonce: 0.5,
  volumePause: 0.9,
};

// Morceau original, avec les voix, d'où sont tirés les extraits.
// Exemple : "audio/musique-negre.mp3". Renseigne ensuite `debut` dans EXTRAITS.
// Pendant un extrait du morceau original, l'instrumentale se coupe.
export const MORCEAU_ORIGINAL: string | null = null;
export const MORCEAU_ORIGINAL_VOLUME = 1;
