import { Easing, interpolate, useCurrentFrame } from "remotion";
import { anton } from "./fonts";
import { tremble } from "./Mouvement";
import { bordDechire } from "./Photo";

const SORTIE = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Texte révélé mot par mot.
export const MotParMot: React.FC<{
  texte: string;
  debut?: number;
  ecart?: number;
  style?: React.CSSProperties;
}> = ({ texte, debut = 0, ecart = 3, style }) => {
  const frame = useCurrentFrame();
  const mots = texte.split(" ");

  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: "0.25em", ...style }}>
      {mots.map((mot, i) => {
        const t = debut + i * ecart;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: interpolate(frame, [t, t + 6], [0, 1], clamp),
              translate: `0px ${interpolate(frame, [t, t + 10], [28, 0], { ...clamp, easing: SORTIE })}px`,
              filter: `blur(${interpolate(frame, [t, t + 8], [8, 0], clamp)}px)`,
            }}
          >
            {mot}
          </span>
        );
      })}
    </div>
  );
};

// Lettres qui tombent une à une, en coupe nette.
export const LettreParLettre: React.FC<{
  texte: string;
  debut?: number;
  ecart?: number;
  style?: React.CSSProperties;
}> = ({ texte, debut = 0, ecart = 3, style }) => {
  const frame = useCurrentFrame();

  return (
    <div style={style}>
      {[...texte].map((lettre, i) => {
        const t = debut + i * ecart;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: frame >= t ? 1 : 0,
              scale: interpolate(frame, [t, t + 5], [1.35, 1], { ...clamp, easing: SORTIE }),
            }}
          >
            {lettre}
          </span>
        );
      })}
    </div>
  );
};

// Masque qui glisse : le contenu monte depuis sous une ligne invisible.
export const MasqueGlissant: React.FC<{
  debut?: number;
  duree?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ debut = 0, duree = 12, children, style }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ overflow: "hidden", ...style }}>
      <div
        style={{
          translate: `0px ${interpolate(frame, [debut, debut + duree], [105, 0], { ...clamp, easing: SORTIE })}%`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Trait blanc qui se déploie de gauche à droite.
export const Trait: React.FC<{ debut?: number; largeur?: number }> = ({ debut = 0, largeur = 120 }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        width: largeur,
        height: 6,
        backgroundColor: "#fff",
        transformOrigin: "left center",
        scale: `${interpolate(frame, [debut, debut + 12], [0, 1], { ...clamp, easing: SORTIE })} 1`,
      }}
    />
  );
};

// Bandeau de papier déchiré, lettres rongées façon photocopie.
// "papier" = noir sur blanc, "negatif" = blanc sur noir avec liseré blanc.
export const Etiquette: React.FC<{
  children: React.ReactNode;
  variante?: "papier" | "negatif";
  taille?: number;
  inclinaison?: number;
  arrivee?: number;
  graine?: string;
}> = ({ children, variante = "papier", taille = 104, inclinaison = 0, arrivee = 0, graine = "etiquette" }) => {
  const frame = useCurrentFrame();
  const papier = variante === "papier";

  return (
    <div
      style={{
        display: "inline-block",
        opacity: frame >= arrivee ? 1 : 0,
        // Léger tremblement image par image, comme un collage animé à la main.
        rotate: `${inclinaison + tremble(graine, frame, 0.8)}deg`,
        // Coup de tampon : trop grand, écrasé, puis en place.
        scale: interpolate(frame, [arrivee, arrivee + 4, arrivee + 7], [1.3, 0.94, 1], clamp),
        filter: "url(#encre)",
      }}
    >
      <div
        style={{
          backgroundColor: "#e6e6e6",
          padding: papier ? 0 : 5,
          clipPath: bordDechire(graine, 9, 5),
        }}
      >
        <div
          style={{
            fontFamily: anton,
            fontSize: taille,
            lineHeight: 1.05,
            textTransform: "uppercase",
            color: papier ? "#0a0a0a" : "#f2f2f2",
            backgroundColor: papier ? "transparent" : "#0a0a0a",
            padding: `${taille * 0.12}px ${taille * 0.2}px`,
            clipPath: papier ? undefined : bordDechire(`${graine}-int`, 7, 5),
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

// Titre révélé mot par mot : chaque mot est une étiquette collée en coup de tampon.
export const TitreZine: React.FC<{
  texte: string;
  debut?: number;
  ecart?: number;
  taille?: number;
  style?: React.CSSProperties;
}> = ({ texte, debut = 0, ecart = 4, taille = 104, style }) => {
  const mots = texte.split(" ");

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "14px 18px", alignItems: "center", ...style }}>
      {mots.map((mot, i) => (
        <Etiquette
          key={i}
          variante={i % 2 === 0 ? "papier" : "negatif"}
          taille={taille}
          inclinaison={[-2.5, 1.8, -1, 2.6, -1.8][i % 5]}
          arrivee={debut + i * ecart}
          graine={`${texte}-${i}`}
        >
          {mot}
        </Etiquette>
      ))}
    </div>
  );
};
