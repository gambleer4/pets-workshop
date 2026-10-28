import { AbsoluteFill, Img, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { PERSONNES, type PersonneId } from "../config";
import { anton, GRIS, inter } from "./fonts";
import { cheminImage, useImageDisponible } from "./images";
import { tremble } from "./Mouvement";

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
              objectPosition: PERSONNES[personne].cadrage ?? "50% 30%",
              filter: `brightness(${PERSONNES[personne].exposition ?? 1}) grayscale(1) contrast(1.15) url(#xerox)`,
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

// Bout de scotch translucide, aux extrémités dentelées.
const Scotch: React.FC<{ graine: string; style: React.CSSProperties }> = ({ graine, style }) => (
  <div
    style={{
      position: "absolute",
      width: 170,
      height: 46,
      backgroundColor: "rgba(228,228,228,0.62)",
      clipPath: `polygon(${[0, 1, 2, 3, 4]
        .map((i) => `${random(`${graine}-g${i}`) * 6}% ${i * 25}%`)
        .concat([4, 3, 2, 1, 0].map((i) => `${94 + random(`${graine}-d${i}`) * 6}% ${i * 25}%`))
        .join(", ")})`,
      filter: "url(#encre)",
      ...style,
    }}
  />
);

// Photo découpée et collée : cadre papier, bords déchirés, scotch, inclinaison,
// arrivée en coup de tampon, puis léger flottement et tremblement.
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
  const { fps } = useVideoConfig();
  const visible = frame >= arrivee;
  const flottement = Math.sin(((frame - arrivee) / fps) * 1.3 + x) * 7;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: largeur,
        height: hauteur,
        opacity: visible ? 1 : 0,
        translate: `0px ${flottement}px`,
        rotate: `${
          interpolate(frame, [arrivee, arrivee + 5], [inclinaison * 2.2, inclinaison], clamp) +
          tremble(personne, frame, 0.35)
        }deg`,
        scale: interpolate(frame, [arrivee, arrivee + 4, arrivee + 7], [1.25, 0.97, 1], clamp),
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
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
      <Scotch graine={`${personne}-g`} style={{ left: -40, top: 6, rotate: "-34deg" }} />
      <Scotch graine={`${personne}-d`} style={{ right: -40, top: 6, rotate: "31deg" }} />
    </div>
  );
};
