# Musique nègre — décryptage en motion design

Vidéo verticale (1080×1920, 30 fps) réalisée avec [Remotion](https://www.remotion.dev) (React + TypeScript), qui décrypte le morceau « Musique nègre » de Kery James, Lino et Youssoupha (2016, album *Mouhammad Alix*).

Direction artistique : noir et blanc strict, façon collage photocopié / fanzine punk.
Photos seuillées et granuleuses, cartes de papier déchiré inclinées, titres sur étiquettes déchirées révélés mot par mot, poussière, vignettage permanent.
Les scènes s'enchaînent par une transition « papier déchiré » (la suivante recouvre la précédente), avec un flash blanc aux changements de section.

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

**Extraits rappés** : tirés du morceau original, `public/audio/musique-negre.m4a` (piste audio du clip, 5 min 21).
Chaque pause joue le passage correspondant, repéré par transcription automatique et coupé au mot près, avec un fondu très court aux deux bouts. Pendant un extrait, l'instrumentale se coupe.

La vidéo suit l'ordre du morceau. Qui rappe quoi a été vérifié à l'écoute.

| Extrait | Rappeur | Passage | Dans le morceau original |
| --- | --- | --- | --- |
| `EXTRAIT_KERY_1` | Kery James | Rosa Parks | 1:06,9 → 1:10,5 |
| `EXTRAIT_KERY_2` | Kery James | Toussaint Louverture | 1:10,5 → 1:14,3 |
| `EXTRAIT_YOUSS_1` | Youssoupha | l'angle mort | 1:42,9 → 1:48,2 |
| `EXTRAIT_YOUSS_2` | Youssoupha | le bruit et l'odeur | 1:48,6 → 1:55,5 |
| `EXTRAIT_KERY_LINO` | Kery James et Lino (passe-passe) | tam-tam, rossignol, prime time | 3:18,5 → 3:23,4 |
| `EXTRAIT_REFRAIN` | les trois | « pas calibré pour la FM », « Yes we can » | 3:25,8 → 3:35,8 |
| `EXTRAIT_LINO_1` | Lino | nègre / négrier | 3:54,9 → 3:58,3 |
| `EXTRAIT_LINO_2` | Lino | Haïti | 4:30,3 → 4:33,9 |
| `EXTRAIT_LINO_3` | Lino | ni le CRAN ni la LICRA | 4:33,8 → 4:37,8 |

Pour décaler un extrait, modifie son `debut` (en secondes dans le morceau) et sa `duree` dans `EXTRAITS` (`src/config.ts`). Le volume se règle avec `MORCEAU_ORIGINAL_VOLUME`.
Un extrait remis à `debut: null` laisse l'instrumentale à sa place.

## Extraits du morceau

Chaque extrait est un seul plan : l'annonce (« KERY JAMES : ») sur la photo assombrie, puis la photo s'éclaire et zoome lentement pendant que le rappeur parle. La zone du bas reste vide pour la phrase que tu ajoutes au montage.
Dans le Studio, cette zone est entourée de pointillés avec le nom du marqueur. Les pointillés n'apparaissent pas dans le MP4.

Chaque pause est une séquence nommée (`EXTRAIT_KERY_1`, etc.) visible dans la timeline du Studio.

### Timecodes des extraits

<!-- TIMECODES:DEBUT -->

| Marqueur | Début | Fin | Durée | Images |
| --- | --- | --- | --- | --- |
| `EXTRAIT_KERY_1` | 00:00:16:02 | 00:00:19:20 | 3.60 s | 482 → 589 |
| `EXTRAIT_KERY_2` | 00:00:30:07 | 00:00:34:01 | 3.80 s | 907 → 1020 |
| `EXTRAIT_YOUSS_1` | 00:00:42:18 | 00:00:47:27 | 5.30 s | 1278 → 1436 |
| `EXTRAIT_YOUSS_2` | 00:01:03:03 | 00:01:10:00 | 6.90 s | 1893 → 2099 |
| `EXTRAIT_KERY_LINO` | 00:01:21:17 | 00:01:26:14 | 4.90 s | 2447 → 2593 |
| `EXTRAIT_REFRAIN` | 00:01:27:12 | 00:01:37:12 | 10.00 s | 2622 → 2921 |
| `EXTRAIT_LINO_1` | 00:01:46:14 | 00:01:49:28 | 3.47 s | 3194 → 3297 |
| `EXTRAIT_LINO_2` | 00:01:58:00 | 00:02:01:18 | 3.60 s | 3540 → 3647 |
| `EXTRAIT_LINO_3` | 00:02:08:20 | 00:02:12:20 | 4.00 s | 3860 → 3979 |

Durée totale : 00:02:25:28 (145.9 s, 4378 images à 30 fps). Timecodes au format HH:MM:SS:images.

<!-- TIMECODES:FIN -->

Les mêmes marqueurs sont exportés dans `marqueurs/extraits.csv` et `marqueurs/extraits.srt`.
Le `.srt` s'importe comme piste de sous-titres dans Premiere, DaVinci Resolve ou CapCut : chaque bloc montre exactement où caler un extrait.

### Changer les durées

Toutes les durées sont dans `src/config.ts`, en secondes :

- `EXTRAITS` : durée de chaque pause. Cale-la sur la longueur réelle de l'extrait.
- `DUREE_ANNONCE` : durée des annonces « ARTISTE : ».
- `DUREE_TRANSITION` : durée de la transition « papier déchiré » entre deux scènes.
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
    Annonce.tsx          étiquette « KERY JAMES : » au début de chaque extrait
    ExtraitPause.tsx     <ExtraitPause artiste="..." /> : annonce puis extrait, en un plan
    Outro.tsx            les trois artistes et « Retourner l'insulte en étendard »
  components/
    Photo.tsx            photo traitée, cadre de remplacement, carte de collage
    Filtres.tsx          filtres SVG « photocopie » et « encre »
    Texte.tsx            mot par mot, lettre par lettre, masques, étiquettes déchirées
    Overlays.tsx         vignettage, flash, poussière, fondu au noir
    Transition.tsx       transition « papier déchiré » entre deux scènes
    PortraitArtiste.tsx  photo de l'artiste (ou collage duo / trio) des extraits
    Sons.tsx             fond musical, voix off, extraits du morceau original
    voix.ts              détection et durée des enregistrements de voix off
scripts/timecodes.mts    génère les timecodes du README et les marqueurs
```

Aucune parole du morceau n'est écrite dans la vidéo : seulement des textes explicatifs.
