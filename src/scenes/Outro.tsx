import { AbsoluteFill } from "remotion";
import { CollageTrio } from "../components/CollageTrio";
import { GRIS, inter } from "../components/fonts";
import { MotParMot, TitreZine } from "../components/Texte";

// Les trois artistes réunis et la phrase finale.
// Le fondu au noir est posé au-dessus de tous les calques dans Video.tsx.
export const Outro: React.FC = () => (
  <AbsoluteFill>
    <div style={{ position: "absolute", top: 150, left: 0 }}>
      <CollageTrio noms={false} ecart={4} />
    </div>
    <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 80px 150px", gap: 36 }}>
      <TitreZine texte="Retourner l'insulte en étendard" debut={16} ecart={5} taille={110} />
      <MotParMot
        texte="Musique nègre — Kery James, Lino, Youssoupha · 2016"
        debut={52}
        ecart={2}
        style={{ fontFamily: inter, fontWeight: 300, fontSize: 44, color: GRIS }}
      />
    </AbsoluteFill>
  </AbsoluteFill>
);
