import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { NOMS_ANNONCE, type ArtisteId } from "../config";
import { GRIS, inter } from "../components/fonts";
import { Etiquette, MasqueGlissant } from "../components/Texte";

// Étiquette « KERY JAMES : » posée sur la photo, puis qui remonte et
// s'efface à l'image `sortie`, quand l'extrait commence.
export const Annonce: React.FC<{ artiste: ArtisteId; sortie: number }> = ({ artiste, sortie }) => {
  const frame = useCurrentFrame();
  const nom = NOMS_ANNONCE[artiste];
  const options = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  } as const;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        paddingTop: 300,
        opacity: interpolate(frame, [sortie - 2, sortie + 8], [1, 0], options),
        translate: `0px ${interpolate(frame, [sortie - 2, sortie + 8], [0, -90], options)}px`,
      }}
    >
      <MasqueGlissant duree={8}>
        <div style={{ fontFamily: inter, fontSize: 40, letterSpacing: "0.3em", color: GRIS }}>EXTRAIT</div>
      </MasqueGlissant>
      <div style={{ whiteSpace: "nowrap" }}>
        <Etiquette taille={nom.length > 12 ? 104 : 140} inclinaison={-2} arrivee={2} graine={`annonce-${artiste}`}>
          {nom}&nbsp;:
        </Etiquette>
      </div>
    </AbsoluteFill>
  );
};
