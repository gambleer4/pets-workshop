import { useCurrentFrame } from "remotion";

// Filtres SVG partagés, à monter une seule fois dans la composition.
// - "xerox" : photo seuillée et granuleuse, façon photocopie.
// - "encre" : bords rongés et petits trous, façon tampon / lettres photocopiées.
// La texture change toutes les 2 à 4 images pour un effet stop-motion.
export const Filtres: React.FC = () => {
  const frame = useCurrentFrame();
  const graineXerox = Math.floor(frame / 2) % 60;
  const graineEncre = Math.floor(frame / 4) % 60;

  return (
    <svg width={0} height={0} style={{ position: "absolute" }}>
      <defs>
        <filter id="xerox" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="saturate" values="0" result="niveaux" />
          {/* Éclaircit les ombres avant le seuil, pour garder le détail des peaux foncées. */}
          <feComponentTransfer in="niveaux" result="gris">
            <feFuncR type="gamma" amplitude={1} exponent={0.55} offset={0} />
            <feFuncG type="gamma" amplitude={1} exponent={0.55} offset={0} />
            <feFuncB type="gamma" amplitude={1} exponent={0.55} offset={0} />
          </feComponentTransfer>
          <feTurbulence type="fractalNoise" baseFrequency="0.48" numOctaves={2} seed={graineXerox} result="bruit" />
          <feColorMatrix in="bruit" type="saturate" values="0" result="bruitGris" />
          <feComposite in="gris" in2="bruitGris" operator="arithmetic" k1={0} k2={1} k3={0.85} k4={-0.42} result="melange" />
          <feComponentTransfer in="melange">
            <feFuncR type="linear" slope={3.6} intercept={-1.3} />
            <feFuncG type="linear" slope={3.6} intercept={-1.3} />
            <feFuncB type="linear" slope={3.6} intercept={-1.3} />
            <feFuncA type="linear" slope={0} intercept={1} />
          </feComponentTransfer>
        </filter>

        <filter id="encre" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={3} seed={graineEncre} result="ondes" />
          <feDisplacementMap in="SourceGraphic" in2="ondes" scale={5} xChannelSelector="R" yChannelSelector="G" result="bords" />
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={2} seed={graineEncre + 7} result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -6 0 0 0 4.2" result="trous" />
          <feComposite in="bords" in2="trous" operator="in" />
        </filter>
      </defs>
    </svg>
  );
};
