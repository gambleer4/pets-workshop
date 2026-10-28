import { Sequence, useVideoConfig } from "remotion";
import type { PersonneId } from "../config";
import { CartePhoto } from "./Photo";
import { Etiquette } from "./Texte";

type Carte = {
  personne: PersonneId;
  nom: string;
  x: number;
  y: number;
  largeur: number;
  hauteur: number;
  inclinaison: number;
};

const CARTES: Record<"trio" | "duo", Carte[]> = {
  trio: [
    { personne: "kery", nom: "Kery James", x: 40, y: 40, largeur: 380, hauteur: 600, inclinaison: -5 },
    { personne: "lino", nom: "Lino", x: 350, y: 0, largeur: 380, hauteur: 600, inclinaison: 2.5 },
    { personne: "youssoupha", nom: "Youssoupha", x: 660, y: 60, largeur: 380, hauteur: 600, inclinaison: -3 },
  ],
  duo: [
    { personne: "kery", nom: "Kery James", x: 70, y: 40, largeur: 480, hauteur: 680, inclinaison: -4 },
    { personne: "lino", nom: "Lino", x: 530, y: 0, largeur: 480, hauteur: 680, inclinaison: 3 },
  ],
};

// Les artistes collés côte à côte, avec leur nom sur un bandeau :
// les trois (« trio ») ou Kery James et Lino (« duo »).
// `entree` à false : les cartes sont déjà en place, sans coup de tampon.
export const CollageTrio: React.FC<{
  artistes?: "trio" | "duo";
  arrivee?: number;
  ecart?: number;
  noms?: boolean;
  entree?: boolean;
}> = ({ artistes = "trio", arrivee = 0, ecart = 6, noms = true, entree = true }) => {
  const { durationInFrames } = useVideoConfig();

  return (
    <div style={{ position: "relative", width: 1080, height: 760 }}>
      {CARTES[artistes].map((c, i) => (
        // Chaque carte a sa propre séquence pour que le Ken Burns démarre à son arrivée.
        <Sequence
          key={c.personne}
          name={c.nom}
          from={entree ? arrivee + i * ecart : 0}
          durationInFrames={Math.max(1, durationInFrames - (entree ? arrivee + i * ecart : 0))}
          layout="none"
        >
          <CartePhoto
            personne={c.personne}
            x={c.x}
            y={c.y}
            largeur={c.largeur}
            hauteur={c.hauteur}
            inclinaison={c.inclinaison}
            mouvement={i === 1 ? "zoom-arriere" : "zoom-avant"}
            arrivee={entree ? 0 : -10}
          />
          {noms ? (
            <div
              style={{ position: "absolute", left: c.x + 20, top: c.y + c.hauteur - 40 }}
            >
              <Etiquette
                variante="negatif"
                taille={52}
                inclinaison={-c.inclinaison}
                arrivee={5}
                graine={c.nom}
              >
                {c.nom}
              </Etiquette>
            </div>
          ) : null}
        </Sequence>
      ))}
    </div>
  );
};
