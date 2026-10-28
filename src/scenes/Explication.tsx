import { Underline } from "@remotion/rough-notation";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import type { PersonneId } from "../config";
import { anton, GRIS, inter } from "../components/fonts";
import { secousse } from "../components/Mouvement";
import { CartePhoto, type Mouvement } from "../components/Photo";
import {
  MasqueGlissant,
  MotParMot,
  TitreZine,
  Trait,
} from "../components/Texte";

export type Temps = {
  // Nouvelle photo collée par-dessus les précédentes (facultatif).
  photo?: { personne: PersonneId; mouvement?: Mouvement };
  // Mot ou date géante qui défile lentement derrière la photo (facultatif).
  fond?: string;
  surtitre: string;
  titre: string;
  texte: string;
};

// Emplacements successifs des cartes : chaque nouvelle photo chevauche la précédente.
const EMPLACEMENTS = [
  { x: 90, y: 130, largeur: 900, hauteur: 980, inclinaison: -2.5 },
  { x: 200, y: 250, largeur: 790, hauteur: 860, inclinaison: 3 },
];

// Image où le titre est collé, puis où il est souligné, dans un temps.
const ARRIVEE_TITRE = 8;
const finTitre = (titre: string) => ARRIVEE_TITRE + titre.split(" ").length * 4;

// Scène d'explication : photo(s) collée(s) en haut, texte en bas.
// Les « temps » se partagent la durée de la scène, avec une coupe nette entre eux.
// L'image tremble quand une carte ou un titre se colle.
export const Explication: React.FC<{ temps: Temps[] }> = ({ temps }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const duree = Math.floor(durationInFrames / temps.length);
  const impacts = temps.flatMap((t, i) => [
    ...(t.photo ? [i * duree] : []),
    i * duree + ARRIVEE_TITRE,
  ]);
  let carte = 0;

  return (
    <AbsoluteFill style={secousse(frame, impacts, 12)}>
      {temps.map((t, i) =>
        t.fond ? (
          <Sequence
            key={`fond-${i}`}
            name={`Fond ${t.fond}`}
            from={i * duree}
            durationInFrames={i === temps.length - 1 ? durationInFrames - i * duree : duree}
          >
            <TypoFond texte={t.fond} />
          </Sequence>
        ) : null,
      )}

      {temps.map((t, i) => {
        if (!t.photo) return null;
        const place = EMPLACEMENTS[Math.min(carte++, EMPLACEMENTS.length - 1)];
        return (
          <Sequence
            key={`photo-${i}`}
            name={`Photo ${t.photo.personne}`}
            from={i * duree}
            durationInFrames={durationInFrames - i * duree}
            layout="none"
          >
            <CartePhoto
              personne={t.photo.personne}
              mouvement={t.photo.mouvement}
              {...place}
            />
          </Sequence>
        );
      })}

      {temps.map((t, i) => (
        <Sequence
          key={`texte-${i}`}
          name={t.titre}
          from={i * duree}
          durationInFrames={
            i === temps.length - 1 ? durationInFrames - i * duree : duree
          }
        >
          <BlocTexte {...t} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Mot géant en contour, qui défile lentement de droite à gauche, entre la
// photo et le texte (il passe derrière le bas de la carte).
const TypoFond: React.FC<{ texte: string }> = ({ texte }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          fontFamily: anton,
          fontSize: 300,
          lineHeight: 1,
          whiteSpace: "nowrap",
          color: "transparent",
          WebkitTextStroke: "4px rgba(240,240,240,0.4)",
          filter: "url(#encre)",
          position: "absolute",
          top: 975,
          left: 0,
          translate: `${interpolate(frame, [0, durationInFrames], [140, -520])}px 0px`,
          opacity: interpolate(frame, [0, 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {texte}
      </div>
    </AbsoluteFill>
  );
};

const BlocTexte: React.FC<Temps> = ({ surtitre, titre, texte }) => {
  const frame = useCurrentFrame();
  const fin = finTitre(titre);
  const debutTexte = fin + 4;

  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-end", padding: "0 80px 120px", gap: 26 }}
    >
      <Trait />
      <MasqueGlissant debut={2}>
        <div
          style={{
            fontFamily: inter,
            fontWeight: 400,
            fontSize: 40,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: GRIS,
          }}
        >
          {surtitre}
        </div>
      </MasqueGlissant>
      {/* Soulignement au marqueur, tracé une fois le titre collé. */}
      <Underline
        color="#f0f0f0"
        strokeWidth={6}
        iterations={2}
        padding={{ top: 4 }}
        style={{ display: "block" }}
        progress={interpolate(frame, [fin, fin + 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      >
        <TitreZine texte={titre} debut={ARRIVEE_TITRE} taille={100} />
      </Underline>
      <MotParMot
        texte={texte}
        debut={debutTexte}
        ecart={2}
        style={{
          fontFamily: inter,
          fontWeight: 300,
          fontSize: 46,
          lineHeight: 1.3,
          color: GRIS,
        }}
      />
    </AbsoluteFill>
  );
};
