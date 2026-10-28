import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import type { PersonneId } from "../config";
import { GRIS, inter } from "../components/fonts";
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
  surtitre: string;
  titre: string;
  texte: string;
};

// Emplacements successifs des cartes : chaque nouvelle photo chevauche la précédente.
const EMPLACEMENTS = [
  { x: 90, y: 130, largeur: 900, hauteur: 980, inclinaison: -2.5 },
  { x: 200, y: 250, largeur: 790, hauteur: 860, inclinaison: 3 },
];

// Scène d'explication : photo(s) collée(s) en haut, texte en bas.
// Les « temps » se partagent la durée de la scène, avec une coupe nette entre eux.
export const Explication: React.FC<{ temps: Temps[] }> = ({ temps }) => {
  const { durationInFrames } = useVideoConfig();
  const duree = Math.floor(durationInFrames / temps.length);
  let carte = 0;

  return (
    <AbsoluteFill>
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

const BlocTexte: React.FC<Temps> = ({ surtitre, titre, texte }) => {
  const debutTexte = 8 + titre.split(" ").length * 4 + 4;

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
      <TitreZine texte={titre} debut={8} taille={100} />
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
