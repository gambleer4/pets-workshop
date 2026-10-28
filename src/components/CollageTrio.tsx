import { Sequence, useVideoConfig } from "remotion";
import type { PersonneId } from "../config";
import { CartePhoto } from "./Photo";
import { Etiquette } from "./Texte";

const CARTES: {
  personne: PersonneId;
  nom: string;
  x: number;
  y: number;
  inclinaison: number;
}[] = [
  { personne: "kery", nom: "Kery James", x: 40, y: 40, inclinaison: -5 },
  { personne: "lino", nom: "Lino", x: 350, y: 0, inclinaison: 2.5 },
  { personne: "youssoupha", nom: "Youssoupha", x: 660, y: 60, inclinaison: -3 },
];

// Les trois artistes collés côte à côte, avec leur nom sur un bandeau.
export const CollageTrio: React.FC<{
  arrivee?: number;
  ecart?: number;
  noms?: boolean;
}> = ({ arrivee = 0, ecart = 6, noms = true }) => {
  const { durationInFrames } = useVideoConfig();

  return (
    <div style={{ position: "relative", width: 1080, height: 760 }}>
      {CARTES.map((c, i) => (
        // Chaque carte a sa propre séquence pour que le Ken Burns démarre à son arrivée.
        <Sequence
          key={c.personne}
          name={c.nom}
          from={arrivee + i * ecart}
          durationInFrames={Math.max(1, durationInFrames - arrivee - i * ecart)}
          layout="none"
        >
          <CartePhoto
            personne={c.personne}
            x={c.x}
            y={c.y}
            largeur={380}
            hauteur={600}
            inclinaison={c.inclinaison}
            mouvement={i === 1 ? "zoom-arriere" : "zoom-avant"}
          />
          {noms ? (
            <div
              style={{ position: "absolute", left: c.x + 20, top: c.y + 560 }}
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
