// Calcule les timecodes des extraits à partir de config.ts, puis :
// - met à jour le tableau du README (entre les balises TIMECODES),
// - écrit marqueurs/extraits.csv et marqueurs/extraits.srt pour le logiciel de montage.
// Usage : npm run timecodes

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { FPS } from "../src/config";
import { construireTimeline } from "../src/timeline";

const { segments, durationInFrames } = construireTimeline();

const timecode = (frame: number) => {
  const s = Math.floor(frame / FPS);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(frame % FPS)}`;
};

const srt = (frame: number) => {
  const ms = Math.round((frame / FPS) * 1000);
  const pad = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor(ms / 60000) % 60)}:${pad(Math.floor(ms / 1000) % 60)},${pad(ms % 1000, 3)}`;
};

const pauses = segments.filter((s) => s.type === "pause");

const tableau = [
  "| Marqueur | Début | Fin | Durée | Images |",
  "| --- | --- | --- | --- | --- |",
  ...pauses.map(
    (p) =>
      `| \`${p.name}\` | ${timecode(p.from)} | ${timecode(p.from + p.durationInFrames)} | ${(p.durationInFrames / FPS).toFixed(2)} s | ${p.from} → ${p.from + p.durationInFrames - 1} |`,
  ),
  "",
  `Durée totale : ${timecode(durationInFrames)} (${(durationInFrames / FPS).toFixed(1)} s, ${durationInFrames} images à ${FPS} fps). Timecodes au format HH:MM:SS:images.`,
].join("\n");

const readme = readFileSync("README.md", "utf8");
const debut = "<!-- TIMECODES:DEBUT -->";
const fin = "<!-- TIMECODES:FIN -->";
writeFileSync(
  "README.md",
  readme.replace(new RegExp(`${debut}[\\s\\S]*${fin}`), `${debut}\n\n${tableau}\n\n${fin}`),
);

mkdirSync("marqueurs", { recursive: true });
writeFileSync(
  "marqueurs/extraits.csv",
  [
    "marqueur,debut_timecode,fin_timecode,debut_secondes,fin_secondes",
    ...pauses.map(
      (p) =>
        `${p.name},${timecode(p.from)},${timecode(p.from + p.durationInFrames)},${(p.from / FPS).toFixed(3)},${((p.from + p.durationInFrames) / FPS).toFixed(3)}`,
    ),
  ].join("\n") + "\n",
);
writeFileSync(
  "marqueurs/extraits.srt",
  pauses
    .map((p, i) => `${i + 1}\n${srt(p.from)} --> ${srt(p.from + p.durationInFrames)}\n${p.name}\n`)
    .join("\n"),
);

console.log(tableau);
console.log("\nSegments :");
for (const s of segments) console.log(`${timecode(s.from)}  ${String(s.from).padStart(5)}  ${s.name}`);
