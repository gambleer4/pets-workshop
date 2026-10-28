# Musique nègre — décryptage en motion design

Vidéo verticale (1080×1920, 30 fps) réalisée avec [Remotion](https://www.remotion.dev) (React + TypeScript), qui décrypte le morceau « Musique nègre » de Kery James, Lino et Youssoupha (2016, album *Mouhammad Alix*).

Direction artistique : noir et blanc strict, façon collage photocopié / fanzine punk.
Photos seuillées et granuleuses, cartes de papier déchiré inclinées, titres sur étiquettes déchirées révélés mot par mot, poussière, vignettage permanent, flashs blancs entre les sections.

## Démarrer

```bash
npm i
npm run dev        # ouvre Remotion Studio pour prévisualiser
```

## Rendu MP4

```bash
npx remotion render MusiqueNegre out/musique-negre.mp4
```

Raccourci : `npm run render`. Le rendu a besoin d'internet pour charger les polices Anton et Inter. Pour un rendu plus rapide sur une machine puissante, ajoute `--concurrency=8`.

## Photos

Dépose les photos dans `public/images/` avec exactement ces noms :

| Fichier | Personne |
| --- | --- |
| `kery.jpg` | Kery James |
| `lino.jpg` | Lino |
| `youssoupha.jpg` | Youssoupha |
| `lesquen.jpg` | Henry de Lesquen |
| `chirac.jpg` | Jacques Chirac |
| `rosa-parks.jpg` | Rosa Parks |
| `toussaint-louverture.jpg` | Toussaint Louverture |
| `bonaparte.jpg` | Napoléon Bonaparte |
| `obama.jpg` | Barack Obama |

Le traitement (noir et blanc, contraste, grain photocopie, Ken Burns) est appliqué automatiquement.
Si un fichier manque, un cadre gris avec le nom de la personne le remplace. Après avoir ajouté des photos, recharge le Studio.
Le visage est cadré vers le haut de l'image : préfère des portraits où le visage est dans le tiers supérieur. Pour une photo où la personne est décentrée, règle son `cadrage` dans `PERSONNES` (`src/config.ts`), comme pour Rosa Parks.

## Voix off

Le texte à lire est dans [`TEXTE_VOIX_OFF.md`](TEXTE_VOIX_OFF.md), découpé en 12 scènes.

1. Enregistre un fichier par scène.
2. Dépose-les dans `public/audio/voix/` avec le nom de la scène : `intro.mp3`, `contexte.mp3`, `keryAngleMort.mp3`… (formats acceptés : `.mp3`, `.m4a`, `.wav`).
3. Recharge le Studio, puis lance `npm run timecodes` pour mettre à jour les timecodes ci-dessous.

Chaque voix démarre 0,2 s après le début de sa scène. Si un enregistrement est plus long que la durée prévue dans `config.ts`, la scène s'allonge toute seule et tout ce qui suit se décale.
Une scène sans enregistrement reste muette, avec seulement la musique.

## Musique

**Fond musical** : `public/audio/instrumental.mp3`, le remake instrumental de Kyziz (6 min, sans voix).
Il joue sous toute la vidéo : bas sous la voix off, plus fort sur les annonces, fort pendant les pauses.
Il est calé pour que le beat (46,3 s dans le fichier) tombe pile au début du premier extrait, même si les durées changent.
Les volumes et le calage se règlent dans `FOND_MUSICAL` (`src/config.ts`).

**Extraits rappés** : l'instrumentale ne contient pas les voix de Kery James, Lino et Youssoupha. Pour entendre les vrais extraits pendant les pauses :

1. Dépose le morceau original dans `public/audio/`, par exemple `public/audio/musique-negre.mp3`.
2. Dans `src/config.ts`, mets `MORCEAU_ORIGINAL = "audio/musique-negre.mp3"`.
3. Pour chaque extrait de `EXTRAITS`, remplace `debut: null` par la seconde où commence le passage dans le morceau (par exemple `debut: 83.5` pour 1:23,5). Ajuste `duree` à la longueur du passage.

Pendant un extrait du morceau original, l'instrumentale se coupe. Les extraits laissés à `null` gardent l'instrumentale.

## Extraits du morceau

Chaque extrait est précédé d'une annonce (« KERY JAMES : ») puis d'une scène PAUSE : la photo de l'artiste en zoom lent, avec une zone vide en bas pour la phrase que tu ajoutes au montage.
Dans le Studio, cette zone est entourée de pointillés avec le nom du marqueur. Les pointillés n'apparaissent pas dans le MP4.

Chaque pause est une séquence nommée (`EXTRAIT_KERY_1`, etc.) visible dans la timeline du Studio.

### Timecodes des extraits

<!-- TIMECODES:DEBUT -->

| Marqueur | Début | Fin | Durée | Images |
| --- | --- | --- | --- | --- |
| `EXTRAIT_KERY_1` | 00:00:16:24 | 00:00:21:24 | 5.00 s | 504 → 653 |
| `EXTRAIT_KERY_2` | 00:00:37:18 | 00:00:42:18 | 5.00 s | 1128 → 1277 |
| `EXTRAIT_KERY_3` | 00:00:52:12 | 00:00:57:12 | 5.00 s | 1572 → 1721 |
| `EXTRAIT_YOUSS_1` | 00:00:58:21 | 00:01:03:21 | 5.00 s | 1761 → 1910 |
| `EXTRAIT_YOUSS_2` | 00:01:12:15 | 00:01:17:15 | 5.00 s | 2175 → 2324 |
| `EXTRAIT_YOUSS_3` | 00:01:25:09 | 00:01:30:09 | 5.00 s | 2559 → 2708 |
| `EXTRAIT_LINO_1` | 00:01:38:18 | 00:01:43:18 | 5.00 s | 2958 → 3107 |
| `EXTRAIT_LINO_2` | 00:01:52:27 | 00:01:57:27 | 5.00 s | 3387 → 3536 |
| `EXTRAIT_REFRAIN` | 00:02:07:06 | 00:02:12:06 | 5.00 s | 3816 → 3965 |

Durée totale : 00:02:27:21 (147.7 s, 4431 images à 30 fps). Timecodes au format HH:MM:SS:images.

<!-- TIMECODES:FIN -->

Les mêmes marqueurs sont exportés dans `marqueurs/extraits.csv` et `marqueurs/extraits.srt`.
Le `.srt` s'importe comme piste de sous-titres dans Premiere, DaVinci Resolve ou CapCut : chaque bloc montre exactement où caler un extrait.

### Changer les durées

Toutes les durées sont dans `src/config.ts`, en secondes :

- `EXTRAITS` : durée de chaque pause. Cale-la sur la longueur réelle de l'extrait.
- `DUREE_ANNONCE` : durée des annonces « ARTISTE : ».
- `DUREES_SCENES` : durée de chaque scène d'explication, de l'intro et de l'outro.
- `DUREE_FLASH` : durée des flashs blancs entre sections.

Après chaque modification, régénère le tableau ci-dessus et les fichiers de marqueurs :

```bash
npm run timecodes
```

## Organisation du code

```
src/
  config.ts              toutes les durées, les photos, la voix off, la musique
  timeline.ts            ordre des scènes et calcul des positions
  Video.tsx              composition principale (scènes, flashs, grain, vignettage)
  Root.tsx               déclaration de la composition et vérification des photos
  scenes/
    Intro.tsx            titre lettre par lettre puis les trois artistes
    explications.tsx     une scène par explication (contexte, angle mort, Chirac…)
    Explication.tsx      mise en page commune : photo(s) collée(s) + texte
    Annonce.tsx          « KERY JAMES : » avant chaque extrait
    ExtraitPause.tsx     <ExtraitPause artiste="..." /> pendant chaque extrait
    Outro.tsx            les trois artistes et « Retourner l'insulte en étendard »
  components/
    Photo.tsx            photo traitée, cadre de remplacement, carte de collage
    Filtres.tsx          filtres SVG « photocopie » et « encre »
    Texte.tsx            mot par mot, lettre par lettre, masques, étiquettes déchirées
    Overlays.tsx         vignettage, flash, poussière, fondu au noir
    Sons.tsx             fond musical, voix off, extraits du morceau original
    voix.ts              détection et durée des enregistrements de voix off
scripts/timecodes.mts    génère les timecodes du README et les marqueurs
```

Aucune parole du morceau n'est écrite dans la vidéo : seulement des textes explicatifs.
