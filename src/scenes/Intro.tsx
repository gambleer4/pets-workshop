import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CollageTrio } from "../components/CollageTrio";
import { anton, GRIS, inter } from "../components/fonts";
import { Etiquette, LettreParLettre, MotParMot } from "../components/Texte";

// Le titre s'écrit lettre par lettre, remonte, puis les trois artistes sont collés.
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 140,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          translate: `0px ${interpolate(frame, [58, 72], [560, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.7, 0, 0.2, 1),
          })}px`,
        }}
      >
        <LettreParLettre
          texte="MUSIQUE"
          ecart={3}
          style={{ fontFamily: anton, fontSize: 220, lineHeight: 1, color: "#f2f2f2", filter: "url(#encre)" }}
        />
        <Etiquette taille={190} inclinaison={-2} arrivee={22} graine="negre">
          <LettreParLettre texte="NÈGRE" debut={24} ecart={3} />
        </Etiquette>
      </div>

      <div style={{ position: "absolute", top: 820, left: 0 }}>
        <CollageTrio arrivee={74} />
      </div>

      <MotParMot
        texte="Kery James · Lino · Youssoupha — 2016"
        debut={104}
        ecart={2}
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 130,
          justifyContent: "center",
          fontFamily: inter,
          fontWeight: 300,
          fontSize: 44,
          color: GRIS,
        }}
      />
    </AbsoluteFill>
  );
};
