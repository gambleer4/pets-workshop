import { createContext, useContext } from "react";
import { staticFile } from "remotion";
import { PERSONNES, type PersonneId } from "../config";

export type ImagesDisponibles = Record<PersonneId, boolean>;

export const AUCUNE_IMAGE = Object.fromEntries(
  Object.keys(PERSONNES).map((id) => [id, false]),
) as ImagesDisponibles;

export const cheminImage = (id: PersonneId) =>
  staticFile(`images/${PERSONNES[id].fichier}`);

// Vérifie une fois, avant le rendu, quelles photos existent dans public/images/.
export const verifierImages = async (): Promise<ImagesDisponibles> => {
  const ids = Object.keys(PERSONNES) as PersonneId[];
  const resultats = await Promise.all(
    ids.map(async (id) => {
      try {
        const res = await fetch(cheminImage(id));
        const type = res.headers.get("content-type") ?? "";
        return [id, res.ok && type.startsWith("image/")] as const;
      } catch {
        return [id, false] as const;
      }
    }),
  );
  return Object.fromEntries(resultats) as ImagesDisponibles;
};

const ImagesContext = createContext<ImagesDisponibles>(AUCUNE_IMAGE);

export const ImagesProvider = ImagesContext.Provider;

export const useImageDisponible = (id: PersonneId) =>
  useContext(ImagesContext)[id];
