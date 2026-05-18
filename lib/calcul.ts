import { BTS, Epreuve, getTypeMatiere } from "@/data/bts";

export interface NoteEpreuve {
  epreuveId: string;
  note: number | null;
}

export interface ResultatSimulation {
  // Verdict principal
  statut: "admis" | "ajourné" | "ajourné-eliminatoire" | "incomplet";
  mention: "passable" | "assez-bien" | "bien" | "très-bien" | null;

  // Moyennes
  moyenneGenerale: number | null;
  moyennePro: number | null;        // moyenne des épreuves professionnelles uniquement
  moyenneGen: number | null;        // moyenne des épreuves générales uniquement

  // Points
  totalPoints: number | null;
  totalCoefficients: number;
  totalCoeffPro: number;            // somme des coefficients professionnels

  // Détail
  epreuvesEliminatoires: Epreuve[];
  epreuvesManquantes: Epreuve[];
  epreuvesRisque: EpreuveAnalyse[];
  epreuvesProSousMoyenne: EpreuveAnalyse[]; // pro avec note < 10

  // Objectifs
  noteManquantePourPasser: number | null;

  // Accès rattrapage (épreuves de contrôle)
  // Règle officielle (note ESRS2216299N du 15/06/2022) :
  //   moyenne générale ≥ 8 ET moyenne épreuves pro ≥ 10
  accesCourante: boolean;
}

export interface EpreuveAnalyse {
  epreuve: Epreuve;
  note: number;
  contribution: number;
  impact: "fort" | "moyen" | "faible";
}

const SEUIL_ADMISSION  = 10;
const SEUIL_ASSEZ_BIEN = 12;
const SEUIL_BIEN       = 14;
const SEUIL_TRES_BIEN  = 16;
const SEUIL_RATTRAPAGE = 8;   // moyenne générale minimale pour le rattrapage
const SEUIL_PRO_RATTRAPAGE = 10; // moyenne pro minimale pour le rattrapage

export function calculerResultat(bts: BTS, notes: NoteEpreuve[]): ResultatSimulation {
  const totalCoefficients = bts.epreuves.reduce((sum, e) => sum + e.coefficient, 0);
  const totalCoeffPro     = bts.epreuves
    .filter((e) => getTypeMatiere(e) === "professionnelle")
    .reduce((sum, e) => sum + e.coefficient, 0);

  // Épreuves manquantes
  const epreuvesManquantes = bts.epreuves.filter((e) => {
    const n = notes.find((n) => n.epreuveId === e.id);
    return !n || n.note === null || n.note === undefined;
  });

  const notesSaisies = notes.filter((n) => n.note !== null && n.note !== undefined);
  if (notesSaisies.length === 0) {
    return {
      statut: "incomplet", mention: null,
      moyenneGenerale: null, moyennePro: null, moyenneGen: null,
      totalPoints: null, totalCoefficients, totalCoeffPro,
      epreuvesEliminatoires: [], epreuvesManquantes: bts.epreuves,
      epreuvesRisque: [], epreuvesProSousMoyenne: [],
      noteManquantePourPasser: null, accesCourante: false,
    };
  }

  let totalPoints     = 0;
  let totalCoeffSaisis = 0;
  let pointsPro       = 0;
  let coeffProSaisis  = 0;
  let pointsGen       = 0;
  let coeffGenSaisis  = 0;

  const epreuvesEliminatoires: Epreuve[]      = [];
  const epreuvesRisque: EpreuveAnalyse[]      = [];
  const epreuvesProSousMoyenne: EpreuveAnalyse[] = [];

  bts.epreuves.forEach((epreuve) => {
    const noteData = notes.find((n) => n.epreuveId === epreuve.id);
    if (noteData?.note !== null && noteData?.note !== undefined) {
      const note = noteData.note;
      const contribution = note * epreuve.coefficient;
      const type = getTypeMatiere(epreuve);

      totalPoints     += contribution;
      totalCoeffSaisis += epreuve.coefficient;

      if (type === "professionnelle") {
        pointsPro      += contribution;
        coeffProSaisis += epreuve.coefficient;
      } else {
        pointsGen      += contribution;
        coeffGenSaisis += epreuve.coefficient;
      }

      // Note éliminatoire (seuil défini par arrêté, défaut 6/20)
      const seuilElim = epreuve.noteEliminatoire ?? 6;
      if (note < seuilElim) epreuvesEliminatoires.push(epreuve);

      // Risque général (< 8)
      if (note < 8) {
        const impact = epreuve.coefficient >= 4 ? "fort" : epreuve.coefficient >= 3 ? "moyen" : "faible";
        epreuvesRisque.push({ epreuve, note, contribution, impact });
      }

      // Matière pro sous la moyenne (< 10) — bloque l'accès au rattrapage
      if (type === "professionnelle" && note < SEUIL_ADMISSION) {
        const impact = epreuve.coefficient >= 4 ? "fort" : epreuve.coefficient >= 3 ? "moyen" : "faible";
        epreuvesProSousMoyenne.push({ epreuve, note, contribution, impact });
      }
    }
  });

  const isComplet       = epreuvesManquantes.length === 0;
  const moyenneGenerale = isComplet
    ? totalPoints / totalCoefficients
    : totalPoints / totalCoeffSaisis;
  const moyennePro = coeffProSaisis > 0 ? pointsPro / coeffProSaisis : null;
  const moyenneGen = coeffGenSaisis > 0 ? pointsGen / coeffGenSaisis : null;

  // Statut
  let statut: ResultatSimulation["statut"] = "incomplet";
  if (isComplet) {
    if (epreuvesEliminatoires.length > 0) {
      statut = "ajourné-eliminatoire";
    } else if (moyenneGenerale >= SEUIL_ADMISSION) {
      statut = "admis";
    } else {
      statut = "ajourné";
    }
  }

  // Mention
  let mention: ResultatSimulation["mention"] = null;
  if (statut === "admis" && moyenneGenerale !== null) {
    if      (moyenneGenerale >= SEUIL_TRES_BIEN) mention = "très-bien";
    else if (moyenneGenerale >= SEUIL_BIEN)       mention = "bien";
    else if (moyenneGenerale >= SEUIL_ASSEZ_BIEN) mention = "assez-bien";
    else                                          mention = "passable";
  }

  // Note manquante pour passer
  let noteManquantePourPasser: number | null = null;
  if (statut === "ajourné" && isComplet) {
    noteManquantePourPasser = SEUIL_ADMISSION * totalCoefficients - totalPoints;
  }

  // Accès épreuves de contrôle (rattrapage)
  // Règle : moyenne générale ≥ 8 ET moyenne épreuves pro ≥ 10 (note ESRS2216299N)
  const accesCourante = isComplet
    && statut === "ajourné"
    && moyenneGenerale >= SEUIL_RATTRAPAGE
    && moyennePro !== null
    && moyennePro >= SEUIL_PRO_RATTRAPAGE;

  return {
    statut, mention,
    moyenneGenerale: Math.round(moyenneGenerale * 100) / 100,
    moyennePro:      moyennePro !== null ? Math.round(moyennePro * 100) / 100 : null,
    moyenneGen:      moyenneGen !== null ? Math.round(moyenneGen * 100) / 100 : null,
    totalPoints:     Math.round(totalPoints * 100) / 100,
    totalCoefficients, totalCoeffPro,
    epreuvesEliminatoires, epreuvesManquantes,
    epreuvesRisque, epreuvesProSousMoyenne,
    noteManquantePourPasser, accesCourante,
  };
}
