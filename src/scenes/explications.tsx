import { Explication } from "./Explication";

// Une scène par explication. Aucun texte ici ne cite les paroles du morceau.
// Les espaces insécables autour des guillemets gardent « et » collés à leur mot.

export const Contexte: React.FC = () => (
  <Explication
    temps={[
      {
        photo: { personne: "lesquen", mouvement: "zoom-avant" },
        surtitre: "Henry de Lesquen · 2016",
        titre: "Bannir la « musique nègre »",
        texte: "Candidat déclaré à la présidentielle, il veut chasser le rap des médias publics.",
      },
      {
        surtitre: "La réponse",
        titre: "Retourner l'insulte",
        texte: "Kery James, Lino et Youssoupha en font le titre de leur morceau.",
      },
    ]}
  />
);

export const AngleMort: React.FC = () => (
  <Explication
    temps={[
      {
        photo: { personne: "kery", mouvement: "gauche" },
        surtitre: "Kery James",
        titre: "L'angle mort",
        texte: "Invisible dans le récit national. Et éliminé s'il ose défier le système.",
      },
    ]}
  />
);

export const BruitOdeur: React.FC = () => (
  <Explication
    temps={[
      {
        photo: { personne: "chirac", mouvement: "zoom-avant" },
        surtitre: "Jacques Chirac · Orléans, 1991",
        titre: "« Le bruit et l'odeur »",
        texte: "Des mots sur les familles immigrées, prononcés par un futur président de la République.",
      },
    ]}
  />
);

export const TamTam: React.FC = () => (
  <Explication
    temps={[
      {
        photo: { personne: "kery", mouvement: "zoom-arriere" },
        surtitre: "Kery James",
        titre: "Le tam-tam contre le rossignol",
        texte: "On méprise le rap comme un bruit primitif. Pourtant, c'est lui qui prend le prime time.",
      },
    ]}
  />
);

export const Negrier: React.FC = () => (
  <Explication
    temps={[
      {
        photo: { personne: "youssoupha", mouvement: "droite" },
        surtitre: "Youssoupha",
        titre: "Nègre / négrier",
        texte: "Deux mots presque identiques. Le vrai sauvage, c'est celui qui faisait commerce des hommes.",
      },
    ]}
  />
);

export const Haiti: React.FC = () => (
  <Explication
    temps={[
      {
        photo: { personne: "youssoupha", mouvement: "zoom-avant" },
        surtitre: "Youssoupha",
        titre: "Haïti, 1804",
        texte: "La première république noire de l'histoire, née d'une révolte d'esclaves.",
      },
    ]}
  />
);

export const CranLicra: React.FC = () => (
  <Explication
    temps={[
      {
        photo: { personne: "youssoupha", mouvement: "gauche" },
        surtitre: "Youssoupha",
        titre: "Ni le CRAN, ni la LICRA",
        texte: "Pas besoin d'institution pour parler à sa place : il répond en son propre nom.",
      },
    ]}
  />
);

export const RosaParks: React.FC = () => (
  <Explication
    temps={[
      {
        photo: { personne: "rosaParks", mouvement: "zoom-avant" },
        surtitre: "Rosa Parks · Montgomery, 1955",
        titre: "Prendre la place qu'on vous refuse",
        texte: "Elle reste assise. Lino fait pareil : le rap s'installe là où on ne veut pas de lui.",
      },
    ]}
  />
);

export const Louverture: React.FC = () => (
  <Explication
    temps={[
      {
        photo: { personne: "toussaint", mouvement: "zoom-avant" },
        surtitre: "Toussaint Louverture",
        titre: "La révolution haïtienne",
        texte: "Un ancien esclave devenu général mène la révolte de Saint-Domingue.",
      },
      {
        photo: { personne: "bonaparte", mouvement: "zoom-arriere" },
        surtitre: "Napoléon Bonaparte",
        titre: "Napoléon battu",
        texte: "En 1803, ses troupes perdent à Vertières. L'ancienne colonie fait plier la France.",
      },
    ]}
  />
);

export const YesWeCan: React.FC = () => (
  <Explication
    temps={[
      {
        photo: { personne: "obama", mouvement: "zoom-avant" },
        surtitre: "Le refrain",
        titre: "Pas de « Yes we can »",
        texte: "Ils refusent le slogan d'Obama et assument une musique « pas calibrée pour la FM ».",
      },
    ]}
  />
);
