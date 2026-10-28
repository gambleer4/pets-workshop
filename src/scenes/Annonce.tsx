import { AbsoluteFill } from "remotion";
import { NOMS_ANNONCE, type ArtisteId } from "../config";
import { GRIS, inter } from "../components/fonts";
import { Photo, PhotosTrio } from "../components/Photo";
import { Etiquette, MasqueGlissant } from "../components/Texte";

// « KERY JAMES : » en gros sur la photo de l'artiste, juste avant un extrait.
export const Annonce: React.FC<{ artiste: ArtisteId }> = ({ artiste }) => (
  <AbsoluteFill>
    {artiste === "trio" ? (
      <PhotosTrio luminosite={0.45} />
    ) : (
      <Photo personne={artiste} luminosite={0.45} mouvement="zoom-avant" />
    )}
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 24, paddingTop: 300 }}>
      <MasqueGlissant duree={8}>
        <div style={{ fontFamily: inter, fontSize: 40, letterSpacing: "0.3em", color: GRIS }}>EXTRAIT</div>
      </MasqueGlissant>
      <div style={{ whiteSpace: "nowrap" }}>
        <Etiquette taille={140} inclinaison={-2} arrivee={2} graine={`annonce-${artiste}`}>
          {NOMS_ANNONCE[artiste]}&nbsp;:
        </Etiquette>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
