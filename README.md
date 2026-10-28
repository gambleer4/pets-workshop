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

Raccourci : `npm run render`. Pour un rendu plus rapide sur une machine puissante, ajoute `--concurrency=8`.

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
Le visage est cadré vers le haut de l'image (`objectPosition: 50% 30%` dans `src/components/Photo.tsx`) : préfère des portraits où le visage est dans le tiers supérieur.

## Voix off

1. Dépose ton fichier dans `public/audio/`, par exemple `public/audio/voix-off.mp3`.
2. Dans `src/config.ts`, remplace `VOIX_OFF = null` par `VOIX_OFF = "audio/voix-off.mp3"`.

La piste démarre au début de la vidéo. Le volume se règle avec `VOIX_OFF_VOLUME`.

## Extraits du morceau

Chaque extrait est précédé d'une annonce (« KERY JAMES : ») puis d'une scène PAUSE : la photo de l'artiste en zoom lent, avec une zone vide en bas pour la phrase que tu ajoutes au montage.
Dans le Studio, cette zone est entourée de pointillés avec le nom du marqueur. Les pointillés n'apparaissent pas dans le MP4.

Chaque pause est une séquence nommée (`EXTRAIT_KERY_1`, etc.) visible dans la timeline du Studio.

### Timecodes des extraits

<!-- TIMECODES:DEBUT -->

| Marqueur | Début | Fin | Durée | Images |
| --- | --- | --- | --- | --- |
| `EXTRAIT_KERY_1` | 00:00:13:24 | 00:00:18:24 | 5.00 s | 414 → 563 |
| `EXTRAIT_KERY_2` | 00:00:29:18 | 00:00:34:18 | 5.00 s | 888 → 1037 |
| `EXTRAIT_KERY_3` | 00:00:40:12 | 00:00:45:12 | 5.00 s | 1212 → 1361 |
| `EXTRAIT_YOUSS_1` | 00:00:46:21 | 00:00:51:21 | 5.00 s | 1401 → 1550 |
| `EXTRAIT_YOUSS_2` | 00:00:57:15 | 00:01:02:15 | 5.00 s | 1725 → 1874 |
| `EXTRAIT_YOUSS_3` | 00:01:08:09 | 00:01:13:09 | 5.00 s | 2049 → 2198 |
| `EXTRAIT_LINO_1` | 00:01:19:03 | 00:01:24:03 | 5.00 s | 2373 → 2522 |
| `EXTRAIT_LINO_2` | 00:01:30:12 | 00:01:35:12 | 5.00 s | 2712 → 2861 |
| `EXTRAIT_REFRAIN` | 00:01:43:21 | 00:01:48:21 | 5.00 s | 3111 → 3260 |

Durée totale : 00:01:59:21 (119.7 s, 3591 images à 30 fps). Timecodes au format HH:MM:SS:images.

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
  config.ts              toutes les durées, les photos, la voix off
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
scripts/timecodes.ts     génère les timecodes du README et les marqueurs
```

Aucune parole du morceau n'est écrite dans la vidéo : seulement des textes explicatifs.
