import { AbsoluteFill, Img, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { PERSONNES, type PersonneId } from "../config";
import { anton, GRIS, inter } from "./fonts";
import { cheminImage, useImageDisponible } from "./images";

export type Mouvement = "zoom-avant" | "zoom-arriere" | "gauche" | "droite";

const KEN_BURNS: Record<Mouvement, { scale: [number, number]; x: [number, number] }> = {
  "zoom-avant": { scale: [1.04, 1.16], x: [0, 0] },
  "zoom-arriere": { scale: [1.18, 1.05], x: [0, 0] },
  gauche: { scale: [1.14, 1.14], x: [30, -30] },
  droite: { scale: [1.14, 1.14], x: [-30, 30] },
};

// Fondu radial vers le noir : la personne se détache du fond.
const MASQUE_RADIAL =
  "radial-gradient(ellipse 72% 62% at 50% 45%, #000 38%, rgba(0,0,0,0.55) 62%, transparent 88%)";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Props = {
  personne: PersonneId;
  mouvement?: Mouvement;
  luminosite?: number;
  // "fondu" : plein cadre, fondu radial dans le noir. "brut" : bords nets (cartes).
  bords?: "fondu" | "brut";
};

// Photo traitée : photocopie N&B contrastée et granuleuse, mouvement Ken Burns.
// Remplacée par un cadre gris nommé si le fichier est absent.
export const Photo: React.FC<Props> = ({
  personne,
  mouvement = "zoom-avant",
  luminosite = 1,
  bords = "fondu",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const disponible = useImageDisponible(personne);
  const kb = KEN_BURNS[mouvement];
  const t = [0, durationInFrames - 1];
  const masque = bords === "fondu" ? MASQUE_RADIAL : undefined;

  return (
    <AbsoluteFill style={{ overflow: "hidden", maskImage: masque, WebkitMaskImage: masque }}>
      <AbsoluteFill
        style={{
          scale: interpolate(frame, t, kb.scale, clamp),
          translate: `${interpolate(frame, t, kb.x, clamp)}px 0px`,
          filter: `brightness(${luminosite})`,
        }}
      >
        {disponible ? (
          <Img
            src={cheminImage(personne)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "50% 30%",
              filter: "grayscale(1) contrast(1.35) url(#xerox)",
            }}
          />
        ) : (
          <CadreManquant personne={personne} />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CadreManquant: React.FC<{ personne: PersonneId }> = ({ personne }) => (
  <AbsoluteFill
    style={{
      backgroundColor: "#3a3a3a",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: 40,
      gap: 16,
    }}
  >
    <div style={{ fontFamily: anton, fontSize: 72, color: "#d0d0d0", lineHeight: 1 }}>
      {PERSONNES[personne].nom.toUpperCase()}
    </div>
    <div style={{ fontFamily: inter, fontWeight: 300, fontSize: 40, color: GRIS }}>
      images/{PERSONNES[personne].fichier}
    </div>
  </AbsoluteFill>
);

// Contour de papier déchiré : polygone irrégulier, stable pour une même graine.
export const bordDechire = (graine: string, amplitude = 10, pas = 6) => {
  const haut: string[] = [];
  const bas: string[] = [];
  for (let x = 0; x <= 100; x += pas) {
    haut.push(`${x}% ${random(`${graine}-h${x}`) * amplitude}px`);
    bas.push(`${100 - x}% calc(100% - ${random(`${graine}-b${x}`) * amplitude}px)`);
  }
  return `polygon(${[...haut, ...bas].join(", ")})`;
};

// Photo découpée et collée : cadre papier, bords déchirés, inclinaison,
// arrivée en coup de tampon.
export const CartePhoto: React.FC<{
  personne: PersonneId;
  x: number;
  y: number;
  largeur: number;
  hauteur: number;
  inclinaison: number;
  mouvement?: Mouvement;
  arrivee?: number;
}> = ({ personne, x, y, largeur, hauteur, inclinaison, mouvement, arrivee = 0 }) => {
  const frame = useCurrentFrame();
  const visible = frame >= arrivee;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: largeur,
        height: hauteur,
        opacity: visible ? 1 : 0,
        rotate: `${interpolate(frame, [arrivee, arrivee + 5], [inclinaison * 2.2, inclinaison], clamp)}deg`,
        scale: interpolate(frame, [arrivee, arrivee + 5], [1.25, 1], clamp),
        backgroundColor: "#d8d8d8",
        padding: 12,
        clipPath: bordDechire(personne, 12),
        filter: "url(#encre)",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
        <Photo personne={personne} mouvement={mouvement} bords="brut" />
      </div>
    </div>
  );
};

// Les trois artistes en colonnes plein cadre, fondues dans le noir.
export const PhotosTrio: React.FC<{ luminosite?: number }> = ({ luminosite }) => {
  const artistes: PersonneId[] = ["kery", "lino", "youssoupha"];

  return (
    <AbsoluteFill style={{ flexDirection: "row" }}>
      {artistes.map((id, i) => (
        <div key={id} style={{ position: "relative", flex: 1 }}>
          <Photo personne={id} luminosite={luminosite} mouvement={i === 1 ? "zoom-arriere" : "zoom-avant"} />
        </div>
      ))}
    </AbsoluteFill>
  );
};
