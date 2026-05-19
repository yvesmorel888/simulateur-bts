// ─── Types ────────────────────────────────────────────────────────────────────

export type NatureEpreuve = "ecrit" | "oral" | "ccf" | "pratique";
export type TypeMatiere = "générale" | "professionnelle";

export type SecteurBTS =
  | "Commerce & Gestion"
  | "Informatique & Numérique"
  | "Bâtiment & Travaux"
  | "Électrotechnique & Énergie"
  | "Industrie & Mécanique"
  | "Transport & Logistique"
  | "Hôtellerie & Tourisme"
  | "Sanitaire & Social"
  | "Communication & Design"
  | "Agriculture & Environnement";

// "vérifié"    = coefficients confirmés sur source officielle (Légifrance / académie)
// "partiel"    = structure globale confirmée, quelques détails à affiner
// "à-vérifier" = données indicatives, non vérifiées — à corriger dans l'espace Audit
export type StatutDonnees = "vérifié" | "partiel" | "à-vérifier";

export interface Epreuve {
  id: string;
  code: string;
  libelle: string;
  coefficient: number;          // peut être décimal (ex. 1.5)
  nature: NatureEpreuve;        // modalité en formation initiale
  natureAlternance?: NatureEpreuve; // modalité en alternance (si différente du cas ccf→ponctuelle générique)
  noteEliminatoire?: number;
  description?: string;         // libellé modalité en formation initiale
  descriptionAlternance?: string; // libellé modalité en alternance (si différent)
}

export interface BTS {
  id: string;
  code: string;
  libelle: string;
  libelleComplet: string;
  secteur: SecteurBTS;
  couleur: string;
  epreuves: Epreuve[];
  disponibleSully: boolean;
  lienOfficiel: string;
  lienSully?: string;           // URL landing page Sully (si disponibleSully)
  statut: StatutDonnees;
  sessionReference?: string;    // ex. "Session 2026 — arrêté du 8 juillet 2024"
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const e = (
  id: string, code: string, libelle: string,
  coefficient: number, nature: NatureEpreuve,
  description?: string, noteElim?: number
): Epreuve => ({ id, code, libelle, coefficient, nature, description, noteEliminatoire: noteElim });

const lf = (q: string) =>
  `https://www.legifrance.gouv.fr/search/all?tab_selection=loda&searchField=ALL&query=${encodeURIComponent("brevet technicien supérieur " + q)}`;

/**
 * Détecte automatiquement si une épreuve est de nature générale ou professionnelle.
 *
 * Règle officielle (arrêté cadre BTS) :
 *   - Matières générales : Culture générale & expression, Langue(s) vivante(s),
 *     Mathématiques (quand présentes), CEJM (Culture économique, juridique et managériale)
 *   - Matières professionnelles : toutes les autres (spécifiques à la spécialité)
 *
 * Source : Note de service ESRS2216299N du 15 juin 2022 (épreuves de contrôle BTS)
 */
export function getTypeMatiere(epreuve: Epreuve): TypeMatiere {
  const lib = epreuve.libelle.toLowerCase();
  const isGenerale =
    lib.includes("culture générale") ||
    lib.includes("langue vivante") ||
    lib.includes("expression et communication en langue") ||
    lib.includes("expression et culture en lve") ||
    lib.includes("lve1") || lib.includes("lve2") ||
    lib.includes("mathématiques") ||
    lib.includes("culture économique, juridique et managériale") ||
    lib.includes("sciences physiques et mathématiques") ||
    lib.includes("expression en anglais");
  return isGenerale ? "générale" : "professionnelle";
}


// ════════════════════════════════════════════════════════════════════════════════
// COMMERCE & GESTION
// ════════════════════════════════════════════════════════════════════════════════

// ─── BTS MCO ──────────────────────────────────────────────────────────────────
// Source : arrêté du 15 oct. 2018, modifié par arrêté du 8 juil. 2024
// Applicable à compter de la session 2025 — total coefficients : 21
const btsMCO: BTS = {
  id: "mco", code: "MCO", secteur: "Commerce & Gestion",
  libelle: "Management Commercial Opérationnel",
  libelleComplet: "BTS Management Commercial Opérationnel",
  couleur: "#6366f1", disponibleSully: true,
  lienOfficiel: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037562608",
  lienSully: "https://www.ltpsully.com/formations/bts-mco/",
  statut: "vérifié", sessionReference: "Session 2026 — arrêté 8 juil. 2024",
  epreuves: [
    e("mco-e1","E1","Culture générale et expression",                    3,  "ecrit", "Écrit national — 3h"),
    e("mco-e2","E2","LVE1 – Compréhension écrite et expression écrite", 1.5,"ecrit", "Écrit — 2h"),
    e("mco-e3","E3","LVE1 – Compréhension orale et production orale",   1.5,"oral",  "Oral — 20 min (+20 min prépa)"),
    e("mco-e4","E4","Culture économique, juridique et managériale",      3,  "ecrit", "CEJM — 4h"),
    { ...e("mco-e5","E5","Développement de la relation client et vente-conseil", 3, "ccf", "CCF — oral 30 min"), natureAlternance: "oral" as NatureEpreuve, descriptionAlternance: "Ponctuel oral — 30 min" },
    { ...e("mco-e6","E6","Animation et dynamisation de l'offre commerciale",  3, "ccf", "CCF — oral 30 min"), natureAlternance: "oral" as NatureEpreuve, descriptionAlternance: "Ponctuel oral — 30 min" },
    e("mco-e7","E7","Gestion opérationnelle",                            3,  "ecrit", "Écrit — 3h"),
    { ...e("mco-e8","E8","Management de l'équipe commerciale",           3, "ccf",   "CCF — 2h30"), natureAlternance: "ecrit" as NatureEpreuve, descriptionAlternance: "Écrit ponctuel — 2h30" },
  ],
};

// ─── BTS NDRC ─────────────────────────────────────────────────────────────────
// Source : arrêté du 19 fév. 2018, modifiés 2023 et 2024 — total : 21
const btsNDRC: BTS = {
  id: "ndrc", code: "NDRC", secteur: "Commerce & Gestion",
  libelle: "Négociation et Digitalisation de la Relation Client",
  libelleComplet: "BTS Négociation et Digitalisation de la Relation Client",
  couleur: "#8b5cf6", disponibleSully: true,
  lienOfficiel: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000036672140",
  lienSully: "https://www.ltpsully.com/formations/bts-alternance-ndrc/",
  statut: "vérifié", sessionReference: "Session 2026",
  epreuves: [
    e("ndrc-e1","E1","Culture générale et expression",                          3,"ecrit","Écrit national — 4h"),
    e("ndrc-e2","E2","Langue vivante étrangère A",                             3,"ecrit","Écrit + oral"),
    e("ndrc-e3","E3","Culture économique, juridique et managériale",            3,"ecrit","CEJM — 4h"),
    { ...e("ndrc-e4","E4","Relation Client et Négociation-Vente (RCNV)",        5,"ccf",  "CCF"), natureAlternance: "oral" as NatureEpreuve, descriptionAlternance: "Ponctuel oral" },
    e("ndrc-e5","E5","Relation Client à Distance et Digitalisation (RCDD)",     4,"ccf",  "CCF"),
    e("ndrc-e6","E6","Relation Client et Animation de Réseaux (RCAR)",          3,"ccf",  "CCF"),
  ],
};

// ─── BTS CG ───────────────────────────────────────────────────────────────────
// Source : arrêté du 3 nov. 2014, modifié 8 juil. 2024 — total : 39
const btsCG: BTS = {
  id: "cg", code: "CG", secteur: "Commerce & Gestion",
  libelle: "Comptabilité et Gestion",
  libelleComplet: "BTS Comptabilité et Gestion",
  couleur: "#0ea5e9", disponibleSully: true,
  lienOfficiel: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000032576111",
  lienSully: "https://www.ltpsully.com/formations/bts-comptabilite-gestion/",
  statut: "vérifié", sessionReference: "Session 2026 — arrêté 8 juil. 2024",
  epreuves: [
    e("cg-e11","E1.1","Culture générale et expression",                                          4,"ecrit","Écrit — 4h"),
    e("cg-e12","E1.2","Expression et communication en anglais",                                  3,"ecrit","Écrit + oral"),
    e("cg-e2", "E2", "Mathématiques appliquées",                                                 3,"ecrit","Écrit — 3h"),
    e("cg-e3", "E3", "Culture économique, juridique et managériale",                             6,"ecrit","CEJM — 4h"),
    e("cg-e41","E4.1","Traitement des opérations comptables, fiscales et sociales – Étude de cas",9,"ecrit","Écrit — 4h"),
    e("cg-e42","E4.2","Traitement des opérations comptables, fiscales et sociales – Pratiques",   4,"pratique","Épreuve pratique sur poste"),
    e("cg-e5", "E5", "Situations de contrôle de gestion et d'analyse financière",                5,"ecrit","Écrit — 3h"),
    { ...e("cg-e6","E6","Parcours de professionnalisation",                                       5,"ccf", "CCF + soutenance"), descriptionAlternance: "Ponctuel + soutenance" },
  ],
};

// ─── BTS GPME ─────────────────────────────────────────────────────────────────
// Source : arrêté du 19 fév. 2018 — total : 33
const btsGPME: BTS = {
  id: "gpme", code: "GPME", secteur: "Commerce & Gestion",
  libelle: "Gestion de la PME",
  libelleComplet: "BTS Gestion de la PME",
  couleur: "#10b981", disponibleSully: true,
  lienOfficiel: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000036672142",
  lienSully: "https://www.ltpsully.com/formations/bts-alternance-gpme/",
  statut: "vérifié", sessionReference: "Session 2026",
  epreuves: [
    e("gpme-e1","E1","Culture générale et expression",                           4,"ecrit","Écrit — 4h"),
    e("gpme-e2","E2","Langue vivante étrangère A",                               3,"ecrit","Écrit + oral"),
    e("gpme-e3","E3","Culture économique, juridique et managériale",              6,"ecrit","CEJM — 4h"),
    e("gpme-e4","E4","Gérer la relation avec les clients et les fournisseurs",    6,"ecrit","Étude de cas écrite"),
    e("gpme-e5","E5","Gestion des risques, du personnel et contribution à la GRH",8,"ccf", "CCF — 3 situations"),
    e("gpme-e6","E6","Soutenir le fonctionnement et le développement de la PME",  6,"oral","Oral — dossier + soutenance"),
  ],
};

// ─── BTS SAM ──────────────────────────────────────────────────────────────────
// Source : arrêté du 16 fév. 2018 — total : 21
const btsSAM: BTS = {
  id: "sam", code: "SAM", secteur: "Commerce & Gestion",
  libelle: "Support à l'Action Managériale",
  libelleComplet: "BTS Support à l'Action Managériale",
  couleur: "#64748b", disponibleSully: false,
  lienOfficiel: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000036672123",
  statut: "vérifié", sessionReference: "Session 2026",
  epreuves: [
    e("sam-e1","E1","Culture générale et expression",                 3,"ecrit","Écrit — 4h"),
    e("sam-e2","E2","Expression et culture en LVE – Langue A",        2,"oral", "Écrit + oral (20 min)"),
    e("sam-e3","E3","Expression et culture en LVE – Langue B",        1,"oral", "Écrit + oral (20 min)"),
    e("sam-e4","E4","Culture économique, juridique et managériale",    3,"ecrit","CEJM — 4h"),
    e("sam-e5","E5","Optimisation des processus administratifs",       4,"oral", "Ponctuel oral — 55 min"),
    e("sam-e6","E6","Gestion de projet",                              4,"ccf",  "CCF — 2 situations (15 min + 1h15)"),
    e("sam-e7","E7","Collaboration à la gestion des ressources humaines",4,"ecrit","Écrit — 4h"),
  ],
};

// ─── BTS Banque ───────────────────────────────────────────────────────────────
const btsBanque: BTS = {
  id: "banque", code: "Banque", secteur: "Commerce & Gestion",
  libelle: "Banque (option A – Marché des Particuliers)",
  libelleComplet: "BTS Banque – option A Marché des Particuliers",
  couleur: "#06b6d4", disponibleSully: false,
  lienOfficiel: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000031906472",
  statut: "à-vérifier",
  epreuves: [
    e("banque-e1","E1","Culture générale et expression",                           3,"ecrit"),
    e("banque-e2","E2","Langue vivante étrangère",                                 2,"ecrit"),
    e("banque-e3","E3","Environnement économique, juridique et organisationnel",    4,"ecrit"),
    e("banque-e4","E4","Techniques bancaires",                                     5,"ecrit"),
    e("banque-e5","E5","Communication et relation client",                         4,"oral"),
    e("banque-e6","E6","Développement de clientèle",                              4,"ccf"),
  ],
};

// ─── BTS Assurance ────────────────────────────────────────────────────────────
// Source : arrêté du 13 fév. 2017 — total : 22 (structure partielle à affiner)
const btsAssurance: BTS = {
  id: "assurance", code: "Assurance", secteur: "Commerce & Gestion",
  libelle: "Assurance",
  libelleComplet: "BTS Assurance",
  couleur: "#f59e0b", disponibleSully: true,
  lienOfficiel: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000034133475",
  lienSully: "https://www.ltpsully.com/formations/bts-assurance/",
  statut: "partiel", sessionReference: "Session 2026",
  epreuves: [
    e("ass-u1","U1","Culture générale et expression",                     3,"ecrit","Dissertation — 4h"),
    e("ass-u2","U2","Langue vivante étrangère",                           2,"ecrit","Écrit + oral"),
    e("ass-u31","U3.1","Environnement et activité commerciale – Écrit",   4,"ecrit","Ponctuel écrit — 4h"),
    e("ass-u32","U3.2","Environnement et activité commerciale – Oral",    4,"oral", "Entretien commercial — 40 min"),
    e("ass-u41","U4.1","Activités d'assurance – Gestion des sinistres – Écrit", 4,"ecrit","Ponctuel écrit — 4h"),
    e("ass-u42","U4.2","Activités d'assurance – Gestion des sinistres – Oral",  3,"oral","Oral — 20 min"),
    e("ass-u5","U5","Parcours professionnel (portfolio numérique)",        2,"ccf","CCF continu"),
  ],
};

// ─── BTS PI ───────────────────────────────────────────────────────────────────
// Source : arrêté du 22 nov. 2023 — structure partielle (coeff U4 et U5 = 6 chacun)
const btsPI: BTS = {
  id: "pi", code: "PI", secteur: "Commerce & Gestion",
  libelle: "Professions Immobilières",
  libelleComplet: "BTS Professions Immobilières",
  couleur: "#ec4899", disponibleSully: true,
  lienOfficiel: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000048530487",
  lienSully: "https://www.ltpsully.com/formations/bts-profession-immobilieres/",
  statut: "partiel", sessionReference: "Session 2026",
  epreuves: [
    e("pi-e1",  "E1",  "Culture générale et expression",                               4,"ecrit","Écrit — 3h"),
    e("pi-e21", "E2.1","Langue vivante anglaise – Compréhension et expression écrites", 2,"ecrit","Écrit — 2h"),
    e("pi-e22", "E2.2","Langue vivante anglaise – Production orale",                   2,"oral", "Oral — 20 min"),
    e("pi-e3",  "E3",  "Environnement juridique et économique des activités immobilières",4,"ecrit","Écrit — 3h"),
    e("pi-e4",  "E4",  "Conduite du projet immobilier du client",                      6,"ecrit","Écrit — 3h"),
    e("pi-e5",  "E5",  "Administration des copropriétés et de l'habitat social",       6,"ccf", "CCF"),
  ],
};

// ─── BTS Commerce International ───────────────────────────────────────────────
const btsCI: BTS = {
  id: "ci", code: "CI", secteur: "Commerce & Gestion",
  libelle: "Commerce International",
  libelleComplet: "BTS Commerce International",
  couleur: "#3b82f6", disponibleSully: false,
  lienOfficiel: lf("commerce international"),
  statut: "à-vérifier",
  epreuves: [
    e("ci-e1","E1","Culture générale et expression",          3,"ecrit"),
    e("ci-e2","E2","Langue vivante étrangère A",              4,"ecrit","LVE A renforcée"),
    e("ci-e3","E3","Langue vivante étrangère B",              3,"ecrit","LVE B obligatoire"),
    e("ci-e4","E4","Environnement du commerce international", 4,"ecrit"),
    e("ci-e5","E5","Développement de l'activité internationale",5,"ecrit"),
    e("ci-e6","E6","Pratique du commerce international",      4,"oral"),
  ],
};


// ════════════════════════════════════════════════════════════════════════════════
// HÔTELLERIE & TOURISME
// ════════════════════════════════════════════════════════════════════════════════

const btsTourisme: BTS = {
  id: "tourisme", code: "Tourisme", secteur: "Hôtellerie & Tourisme",
  libelle: "Tourisme",
  libelleComplet: "BTS Tourisme",
  couleur: "#14b8a6", disponibleSully: false,
  lienOfficiel: lf("tourisme"),
  statut: "à-vérifier",
  epreuves: [
    e("tour-e1","E1","Culture générale et expression",                             3,"ecrit"),
    e("tour-e2","E2","Langue vivante étrangère A",                                 3,"ecrit"),
    e("tour-e3","E3","Langue vivante étrangère B",                                 2,"ecrit","LVE B obligatoire"),
    e("tour-e4","E4","Géographie et économie du tourisme",                         4,"ecrit"),
    e("tour-e5","E5","Conception et commercialisation de produits touristiques",   5,"ecrit"),
    e("tour-e6","E6","Accueil et communication professionnelle en tourisme",        4,"oral"),
  ],
};

const btsMHR: BTS = {
  id: "mhr", code: "MHR", secteur: "Hôtellerie & Tourisme",
  libelle: "Management en Hôtellerie-Restauration",
  libelleComplet: "BTS Management en Hôtellerie-Restauration",
  couleur: "#a78bfa", disponibleSully: false,
  lienOfficiel: lf("management hôtellerie restauration"),
  statut: "à-vérifier",
  epreuves: [
    e("mhr-e1","E1","Culture générale et expression",                        3,"ecrit"),
    e("mhr-e2","E2","Langue vivante étrangère A",                            3,"ecrit"),
    e("mhr-e3","E3","Environnement économique, juridique et social",          3,"ecrit"),
    e("mhr-e4","E4","Gestion des unités d'hébergement et de restauration",   5,"ecrit"),
    e("mhr-e5","E5","Management des organisations hôtelières",               4,"ecrit"),
    e("mhr-e6","E6","Communication et animation",                            4,"oral"),
  ],
};


// ════════════════════════════════════════════════════════════════════════════════
// TRANSPORT & LOGISTIQUE
// ════════════════════════════════════════════════════════════════════════════════

// ─── BTS GTLA ─────────────────────────────────────────────────────────────────
// Source : arrêté du 11 oct. 2018, modifié 8 juil. 2024 — total : 30
const btsGTLA: BTS = {
  id: "gtla", code: "GTLA", secteur: "Transport & Logistique",
  libelle: "Gestion des Transports et Logistique Associée",
  libelleComplet: "BTS Gestion des Transports et Logistique Associée",
  couleur: "#f97316", disponibleSully: true,
  lienOfficiel: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037581901",
  lienSully: "https://www.ltpsully.com/formations/bts-gtla/",
  statut: "vérifié", sessionReference: "Session 2026 — arrêté 8 juil. 2024",
  epreuves: [
    e("gtla-u1","U1","Culture générale et expression",                                            3,"ecrit","Écrit national — 3h"),
    e("gtla-u2","U2","Langue vivante étrangère – Compréhension écrite et expression écrite",      2,"ecrit","Écrit — 2h"),
    { ...e("gtla-u3","U3","Langue vivante étrangère – Production orale en continu et interaction", 1,"ccf",  "CCF — oral"), natureAlternance: "oral" as NatureEpreuve, descriptionAlternance: "Ponctuel oral" },
    e("gtla-u4","U4","Culture économique, juridique et managériale",                              4,"ecrit","CEJM — 4h"),
    e("gtla-u5","U5","Mise en œuvre d'opérations de transport et de prestations logistiques",    6,"ccf",  "CCF — situations professionnelles"),
    e("gtla-u6","U6","Conception des opérations de transport et de prestations logistiques",      6,"ecrit","Étude de cas — 4h"),
    e("gtla-u7","U7","Analyse de la performance d'une activité de transport et logistique",       4,"ccf",  "Étude de cas — 3h"),
    e("gtla-u8","U8","Pérennisation et développement de l'activité de transport et logistique",  4,"oral", "Projet + soutenance"),
  ],
};


// ════════════════════════════════════════════════════════════════════════════════
// INFORMATIQUE & NUMÉRIQUE
// ════════════════════════════════════════════════════════════════════════════════

// ─── BTS SIO ──────────────────────────────────────────────────────────────────
// Source : arrêté du 29 avril 2019, modifié 8 juil. 2024 — total : 18
// Note : certaines sources indiquent 20, à confirmer en Audit
const btsSIOslam: BTS = {
  id: "sio-slam", code: "SIO SLAM", secteur: "Informatique & Numérique",
  libelle: "Services Informatiques aux Organisations – option SLAM",
  libelleComplet: "BTS SIO – option B Solutions Logicielles et Applications Métiers",
  couleur: "#22d3ee", disponibleSully: false,
  lienOfficiel: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000038529532",
  statut: "partiel", sessionReference: "Session 2026 — arrêté 8 juil. 2024",
  epreuves: [
    e("sio-e1","E1","Culture générale et expression",                            2,"ecrit","Écrit — 4h"),
    e("sio-e2","E2","Expression et communication en langue anglaise",            2,"ecrit","Écrit + oral — 20 min"),
    e("sio-e3","E3","Mathématiques pour l'informatique",                         3,"ecrit","Écrit — 2h"),
    e("sio-e4","E4","Culture économique, juridique et managériale",              3,"ecrit","CEJM — 4h"),
    e("sio-e5","E5","Support et mise à disposition de services informatiques",   4,"oral", "Oral — 40 min"),
    e("sio-e6","E6","Conception et développement d'applications (SLAM)",         4,"ccf",  "CCF — 40 min + 1h30 prépa"),
  ],
};

const btsSIOsisr: BTS = {
  id: "sio-sisr", code: "SIO SISR", secteur: "Informatique & Numérique",
  libelle: "Services Informatiques aux Organisations – option SISR",
  libelleComplet: "BTS SIO – option A Solutions d'Infrastructure, Systèmes et Réseaux",
  couleur: "#06b6d4", disponibleSully: false,
  lienOfficiel: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000038529532",
  statut: "partiel", sessionReference: "Session 2026 — arrêté 8 juil. 2024",
  epreuves: [
    e("sisr-e1","E1","Culture générale et expression",                           2,"ecrit","Écrit — 4h"),
    e("sisr-e2","E2","Expression et communication en langue anglaise",           2,"ecrit","Écrit + oral — 20 min"),
    e("sisr-e3","E3","Mathématiques pour l'informatique",                        3,"ecrit","Écrit — 2h"),
    e("sisr-e4","E4","Culture économique, juridique et managériale",             3,"ecrit","CEJM — 4h"),
    e("sisr-e5","E5","Support et mise à disposition de services informatiques",  4,"oral", "Oral — 40 min"),
    e("sisr-e6","E6","Administration des systèmes et des réseaux (SISR)",        4,"ccf",  "CCF — 40 min + 1h30 prépa"),
  ],
};

const btsCIEL: BTS = {
  id: "ciel", code: "CIEL", secteur: "Informatique & Numérique",
  libelle: "Cybersécurité, Informatique et réseaux, ÉLectronique",
  libelleComplet: "BTS CIEL",
  couleur: "#7c3aed", disponibleSully: false,
  lienOfficiel: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000047226070",
  statut: "à-vérifier",
  epreuves: [
    e("ciel-e1","E1","Culture générale et expression",                                3,"ecrit"),
    e("ciel-e2","E2","Mathématiques et physique-chimie",                              4,"ecrit"),
    e("ciel-e3","E3","Culture économique, juridique et managériale",                  3,"ecrit"),
    e("ciel-e4","E4","Conception et maintenance de solutions informatiques et électroniques",5,"pratique"),
    e("ciel-e5","E5","Intégration et sécurisation des systèmes",                     4,"pratique"),
    e("ciel-e6","E6","Projet technique",                                              3,"oral"),
  ],
};

const btsSNir: BTS = {
  id: "sn-ir", code: "SN IR", secteur: "Informatique & Numérique",
  libelle: "Systèmes Numériques – option Informatique et Réseaux",
  libelleComplet: "BTS Systèmes Numériques – option IR",
  couleur: "#818cf8", disponibleSully: false,
  lienOfficiel: lf("systèmes numériques"),
  statut: "à-vérifier",
  epreuves: [
    e("snir-e1","E1","Culture générale et expression",      3,"ecrit"),
    e("snir-e2","E2","Mathématiques et physique",            4,"ecrit"),
    e("snir-e3","E3","Culture économique, juridique et managériale",3,"ecrit"),
    e("snir-e4","E4","Étude d'un système numérique",         5,"pratique"),
    e("snir-e5","E5","Développement d'un système numérique", 4,"pratique"),
    e("snir-e6","E6","Épreuve professionnelle de synthèse",  3,"oral"),
  ],
};


// ════════════════════════════════════════════════════════════════════════════════
// ÉLECTROTECHNIQUE & ÉNERGIE
// ════════════════════════════════════════════════════════════════════════════════

const btsElectrotech: BTS = {
  id: "electrotechnique", code: "Électrotech.", secteur: "Électrotechnique & Énergie",
  libelle: "Électrotechnique",
  libelleComplet: "BTS Électrotechnique",
  couleur: "#facc15", disponibleSully: false,
  lienOfficiel: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000021283528",
  statut: "à-vérifier",
  epreuves: [
    e("elec-e1","E1","Culture générale et expression",              3,"ecrit"),
    e("elec-e2","E2","Langue vivante étrangère",                    2,"ecrit"),
    e("elec-e3","E3","Mathématiques et physique appliquée",          4,"ecrit"),
    e("elec-e4","E4","Étude des systèmes électrotechniques",         5,"ecrit"),
    e("elec-e5","E5","Réalisation et maintenance",                   4,"pratique"),
    e("elec-e6","E6","Projet technique",                             4,"oral"),
  ],
};

const btsFEDa: BTS = {
  id: "fed-a", code: "FED GC", secteur: "Électrotechnique & Énergie",
  libelle: "Fluides Énergie Domotique – option Génie Climatique",
  libelleComplet: "BTS FED – option A Génie Climatique",
  couleur: "#f97316", disponibleSully: false,
  lienOfficiel: lf("fluides energie domotique genie climatique"),
  statut: "à-vérifier",
  epreuves: [
    e("feda-e1","E1","Culture générale et expression",              3,"ecrit"),
    e("feda-e2","E2","Mathématiques et physique",                    3,"ecrit"),
    e("feda-e3","E3","Culture économique, juridique et managériale", 3,"ecrit"),
    e("feda-e4","E4","Étude des systèmes fluidiques et énergétiques",5,"ecrit"),
    e("feda-e5","E5","Conception et réalisation d'installations",    5,"pratique"),
    e("feda-e6","E6","Épreuve professionnelle",                      3,"oral"),
  ],
};

const btsFEDb: BTS = {
  id: "fed-b", code: "FED Froid", secteur: "Électrotechnique & Énergie",
  libelle: "Fluides Énergie Domotique – option Froid et Conditionnement d'Air",
  libelleComplet: "BTS FED – option B Froid et Conditionnement d'Air",
  couleur: "#38bdf8", disponibleSully: false,
  lienOfficiel: lf("fluides energie domotique froid"),
  statut: "à-vérifier",
  epreuves: [
    e("fedb-e1","E1","Culture générale et expression",              3,"ecrit"),
    e("fedb-e2","E2","Mathématiques et physique",                   3,"ecrit"),
    e("fedb-e3","E3","Culture économique, juridique et managériale",3,"ecrit"),
    e("fedb-e4","E4","Étude des systèmes frigorifiques",            5,"ecrit"),
    e("fedb-e5","E5","Conception et réalisation d'installations frigorifiques",5,"pratique"),
    e("fedb-e6","E6","Épreuve professionnelle",                     3,"oral"),
  ],
};

const btsFEDd: BTS = {
  id: "fed-d", code: "FED EnR", secteur: "Électrotechnique & Énergie",
  libelle: "Fluides Énergie Domotique – option Énergies Renouvelables",
  libelleComplet: "BTS FED – option D Énergies Renouvelables",
  couleur: "#4ade80", disponibleSully: false,
  lienOfficiel: lf("fluides energie domotique energies renouvelables"),
  statut: "à-vérifier",
  epreuves: [
    e("fedd-e1","E1","Culture générale et expression",              3,"ecrit"),
    e("fedd-e2","E2","Mathématiques et physique",                   3,"ecrit"),
    e("fedd-e3","E3","Culture économique, juridique et managériale",3,"ecrit"),
    e("fedd-e4","E4","Étude des systèmes d'énergies renouvelables", 5,"ecrit"),
    e("fedd-e5","E5","Conception et réalisation d'installations EnR",5,"pratique"),
    e("fedd-e6","E6","Épreuve professionnelle",                     3,"oral"),
  ],
};


// ════════════════════════════════════════════════════════════════════════════════
// BÂTIMENT & TRAVAUX
// ════════════════════════════════════════════════════════════════════════════════

const btsBatiment: BTS = {
  id: "batiment", code: "Bâtiment", secteur: "Bâtiment & Travaux",
  libelle: "Bâtiment",
  libelleComplet: "BTS Bâtiment",
  couleur: "#a16207", disponibleSully: false,
  lienOfficiel: lf("batiment"),
  statut: "à-vérifier",
  epreuves: [
    e("bat-e1","E1","Culture générale et expression",        3,"ecrit"),
    e("bat-e2","E2","Langue vivante étrangère",              2,"ecrit"),
    e("bat-e3","E3","Mathématiques et sciences physiques",   3,"ecrit"),
    e("bat-e4","E4","Étude technique",                       6,"ecrit"),
    e("bat-e5","E5","Organisation et gestion de chantier",   4,"ecrit"),
    e("bat-e6","E6","Projet",                                4,"oral"),
  ],
};

const btsTP: BTS = {
  id: "tp", code: "TP", secteur: "Bâtiment & Travaux",
  libelle: "Travaux Publics",
  libelleComplet: "BTS Travaux Publics",
  couleur: "#92400e", disponibleSully: false,
  lienOfficiel: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000046891678",
  statut: "à-vérifier",
  epreuves: [
    e("tp-e1","E1","Culture générale et expression",               3,"ecrit"),
    e("tp-e2","E2","Langue vivante étrangère",                     2,"ecrit"),
    e("tp-e3","E3","Mathématiques et sciences physiques",           3,"ecrit"),
    e("tp-e4","E4","Étude technique des travaux publics",           6,"ecrit"),
    e("tp-e5","E5","Organisation et gestion de chantier",           4,"ecrit"),
    e("tp-e6","E6","Projet",                                        4,"oral"),
  ],
};

const btsEBFE: BTS = {
  id: "ebfe", code: "EBFE", secteur: "Bâtiment & Travaux",
  libelle: "Enveloppe des Bâtiments – Façades Étanchéité",
  libelleComplet: "BTS Enveloppe des Bâtiments : Façades-Étanchéité",
  couleur: "#78716c", disponibleSully: false,
  lienOfficiel: lf("enveloppe batiments facades"),
  statut: "à-vérifier",
  epreuves: [
    e("ebfe-e1","E1","Culture générale et expression",              3,"ecrit"),
    e("ebfe-e2","E2","Langue vivante étrangère",                    2,"ecrit"),
    e("ebfe-e3","E3","Mathématiques et physique",                   3,"ecrit"),
    e("ebfe-e4","E4","Étude et conception des ouvrages d'enveloppe",5,"ecrit"),
    e("ebfe-e5","E5","Réalisation et contrôle",                     4,"pratique"),
    e("ebfe-e6","E6","Projet",                                      4,"oral"),
  ],
};

const btsAmenagement: BTS = {
  id: "amenagement", code: "Amén. Finition", secteur: "Bâtiment & Travaux",
  libelle: "Aménagement Finition",
  libelleComplet: "BTS Aménagement Finition",
  couleur: "#b45309", disponibleSully: false,
  lienOfficiel: lf("amenagement finition"),
  statut: "à-vérifier",
  epreuves: [
    e("amen-e1","E1","Culture générale et expression",  3,"ecrit"),
    e("amen-e2","E2","Langue vivante étrangère",        2,"ecrit"),
    e("amen-e3","E3","Mathématiques et sciences physiques",3,"ecrit"),
    e("amen-e4","E4","Étude technique",                 5,"ecrit"),
    e("amen-e5","E5","Réalisation",                     4,"pratique"),
    e("amen-e6","E6","Projet",                          4,"oral"),
  ],
};


// ════════════════════════════════════════════════════════════════════════════════
// INDUSTRIE & MÉCANIQUE
// ════════════════════════════════════════════════════════════════════════════════

const btsMS: BTS = {
  id: "ms", code: "MS", secteur: "Industrie & Mécanique",
  libelle: "Maintenance des Systèmes – option A (Systèmes de Production)",
  libelleComplet: "BTS Maintenance des Systèmes – option A",
  couleur: "#64748b", disponibleSully: false,
  lienOfficiel: lf("maintenance systemes"),
  statut: "à-vérifier",
  epreuves: [
    e("ms-e1","E1","Culture générale et expression",             3,"ecrit"),
    e("ms-e2","E2","Langue vivante étrangère",                   2,"ecrit"),
    e("ms-e3","E3","Mathématiques et sciences physiques",         3,"ecrit"),
    e("ms-e4","E4","Analyse et conception d'une solution de maintenance",5,"ecrit"),
    e("ms-e5","E5","Mise en œuvre d'une solution de maintenance", 5,"pratique"),
    e("ms-e6","E6","Épreuve professionnelle de synthèse",         3,"oral"),
  ],
};

const btsATI: BTS = {
  id: "ati", code: "ATI", secteur: "Industrie & Mécanique",
  libelle: "Assistance Technique d'Ingénieur",
  libelleComplet: "BTS Assistance Technique d'Ingénieur",
  couleur: "#475569", disponibleSully: false,
  lienOfficiel: lf("assistance technique ingenieur"),
  statut: "à-vérifier",
  epreuves: [
    e("ati-e1","E1","Culture générale et expression",            3,"ecrit"),
    e("ati-e2","E2","Langue vivante étrangère",                  2,"ecrit"),
    e("ati-e3","E3","Mathématiques et physique appliquée",        4,"ecrit"),
    e("ati-e4","E4","Étude de la solution technique",             5,"ecrit"),
    e("ati-e5","E5","Suivi et validation de la solution technique",4,"pratique"),
    e("ati-e6","E6","Épreuve professionnelle de synthèse",        3,"oral"),
  ],
};

const btsCPI: BTS = {
  id: "cpi", code: "CPI", secteur: "Industrie & Mécanique",
  libelle: "Conception de Produits Industriels",
  libelleComplet: "BTS Conception de Produits Industriels",
  couleur: "#94a3b8", disponibleSully: false,
  lienOfficiel: lf("conception produits industriels"),
  statut: "à-vérifier",
  epreuves: [
    e("cpi-e1","E1","Culture générale et expression",     3,"ecrit"),
    e("cpi-e2","E2","Langue vivante étrangère",           2,"ecrit"),
    e("cpi-e3","E3","Mathématiques et sciences physiques",3,"ecrit"),
    e("cpi-e4","E4","Conception et définition du produit",5,"ecrit"),
    e("cpi-e5","E5","Industrialisation du produit",        4,"pratique"),
    e("cpi-e6","E6","Projet de conception",                4,"oral"),
  ],
};

const btsPlasturgie: BTS = {
  id: "plasturgie", code: "Plasturgie", secteur: "Industrie & Mécanique",
  libelle: "Plasturgie et Composites",
  libelleComplet: "BTS Plasturgie et Composites",
  couleur: "#0891b2", disponibleSully: false,
  lienOfficiel: lf("plasturgie composites"),
  statut: "à-vérifier",
  epreuves: [
    e("plast-e1","E1","Culture générale et expression",              3,"ecrit"),
    e("plast-e2","E2","Langue vivante étrangère",                    2,"ecrit"),
    e("plast-e3","E3","Mathématiques et sciences physiques",          3,"ecrit"),
    e("plast-e4","E4","Analyse et conception des systèmes de production",5,"ecrit"),
    e("plast-e5","E5","Mise en œuvre et contrôle",                   4,"pratique"),
    e("plast-e6","E6","Projet",                                       4,"oral"),
  ],
};

const btsMSMA: BTS = {
  id: "msma", code: "MSMA", secteur: "Industrie & Mécanique",
  libelle: "Moteurs et Systèmes Mécaniques Avancés",
  libelleComplet: "BTS MSMA",
  couleur: "#71717a", disponibleSully: false,
  lienOfficiel: lf("MSMA moteurs systemes mecaniques"),
  statut: "à-vérifier",
  epreuves: [
    e("msma-e1","E1","Culture générale et expression",            3,"ecrit"),
    e("msma-e2","E2","Langue vivante étrangère",                  2,"ecrit"),
    e("msma-e3","E3","Mathématiques et sciences physiques",        3,"ecrit"),
    e("msma-e4","E4","Analyse et conception de systèmes mécaniques",5,"ecrit"),
    e("msma-e5","E5","Réalisation et contrôle",                    5,"pratique"),
    e("msma-e6","E6","Épreuve de synthèse",                        3,"oral"),
  ],
};


// ════════════════════════════════════════════════════════════════════════════════
// SANITAIRE & SOCIAL
// ════════════════════════════════════════════════════════════════════════════════

const btsSP3S: BTS = {
  id: "sp3s", code: "SP3S", secteur: "Sanitaire & Social",
  libelle: "Services et Prestations des Secteurs Sanitaire et Social",
  libelleComplet: "BTS SP3S",
  couleur: "#f43f5e", disponibleSully: false,
  lienOfficiel: lf("services prestations sanitaire social"),
  statut: "à-vérifier",
  epreuves: [
    e("sp3s-e1","E1","Culture générale et expression",              3,"ecrit"),
    e("sp3s-e2","E2","Langue vivante étrangère",                    2,"ecrit"),
    e("sp3s-e3","E3","Sciences médico-sociales",                    4,"ecrit"),
    e("sp3s-e4","E4","Droit et économie des secteurs sanitaire et social",4,"ecrit"),
    e("sp3s-e5","E5","Communication et coordination",               4,"oral"),
    e("sp3s-e6","E6","Analyse de situations professionnelles",       4,"ccf"),
  ],
};

const btsASSP: BTS = {
  id: "assp", code: "ASSP", secteur: "Sanitaire & Social",
  libelle: "Accompagnement, Soins et Services à la Personne",
  libelleComplet: "BTS ASSP",
  couleur: "#fb7185", disponibleSully: false,
  lienOfficiel: lf("accompagnement soins services personne"),
  statut: "à-vérifier",
  epreuves: [
    e("assp-e1","E1","Culture générale et expression",    3,"ecrit"),
    e("assp-e2","E2","Langue vivante étrangère",          2,"ecrit"),
    e("assp-e3","E3","Sciences biologiques et médicales", 4,"ecrit"),
    e("assp-e4","E4","Soins et accompagnement",           5,"pratique"),
    e("assp-e5","E5","Communication et coordination",      3,"oral"),
    e("assp-e6","E6","Analyse de situations professionnelles",4,"ccf"),
  ],
};

const btsDietetique: BTS = {
  id: "dietetique", code: "Diét.", secteur: "Sanitaire & Social",
  libelle: "Diététique",
  libelleComplet: "BTS Diététique",
  couleur: "#4ade80", disponibleSully: false,
  lienOfficiel: lf("dietetique"),
  statut: "à-vérifier",
  epreuves: [
    e("diet-e1","E1","Culture générale et expression",            3,"ecrit"),
    e("diet-e2","E2","Langue vivante étrangère",                  2,"ecrit"),
    e("diet-e3","E3","Sciences biologiques et biochimiques",       4,"ecrit"),
    e("diet-e4","E4","Sciences de l'alimentation et de la nutrition",5,"ecrit"),
    e("diet-e5","E5","Conseil et accompagnement diététique",       4,"oral"),
    e("diet-e6","E6","Analyse de situations",                      3,"ccf"),
  ],
};

const btsOL: BTS = {
  id: "ol", code: "OL", secteur: "Sanitaire & Social",
  libelle: "Opticien Lunetier",
  libelleComplet: "BTS Opticien Lunetier",
  couleur: "#818cf8", disponibleSully: false,
  lienOfficiel: lf("opticien lunetier"),
  statut: "à-vérifier",
  epreuves: [
    e("ol-e1","E1","Culture générale et expression",          3,"ecrit"),
    e("ol-e2","E2","Sciences physiques et optiques",          5,"ecrit"),
    e("ol-e3","E3","Sciences de la vision",                   4,"ecrit"),
    e("ol-e4","E4","Technologie des équipements optiques",    4,"pratique"),
    e("ol-e5","E5","Réfraction et contactologie",             4,"pratique"),
    e("ol-e6","E6","Analyse et conseil optique",              3,"oral"),
  ],
};

const btsProthesiste: BTS = {
  id: "po", code: "PO", secteur: "Sanitaire & Social",
  libelle: "Prothésiste-Orthésiste",
  libelleComplet: "BTS Prothésiste-Orthésiste",
  couleur: "#c084fc", disponibleSully: false,
  lienOfficiel: lf("prothesiste orthesiste"),
  statut: "à-vérifier",
  epreuves: [
    e("po-e1","E1","Culture générale et expression",          3,"ecrit"),
    e("po-e2","E2","Sciences biologiques et médicales",       4,"ecrit"),
    e("po-e3","E3","Sciences et techniques des appareillages",5,"ecrit"),
    e("po-e4","E4","Réalisation d'appareillages",             5,"pratique"),
    e("po-e5","E5","Analyse de situations professionnelles",  3,"oral"),
  ],
};


// ════════════════════════════════════════════════════════════════════════════════
// COMMUNICATION & DESIGN
// ════════════════════════════════════════════════════════════════════════════════

const btsCommunication: BTS = {
  id: "communication", code: "Communication", secteur: "Communication & Design",
  libelle: "Communication",
  libelleComplet: "BTS Communication",
  couleur: "#e879f9", disponibleSully: false,
  lienOfficiel: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000047003649",
  statut: "à-vérifier",
  epreuves: [
    e("com-e1","E1","Cultures de la communication",                           3,"ecrit","Écrit — 4h"),
    e("com-e2","E2","Langue vivante étrangère",                               3,"ecrit","Écrit + oral"),
    e("com-e3","E3","Culture économique, juridique et managériale",            3,"ecrit","CEJM — 4h"),
    e("com-e4","E4","Stratégie et création en communication",                 5,"ecrit","Écrit — 4h"),
    e("com-e5","E5","Production en communication",                            4,"pratique","Épreuve pratique"),
    e("com-e6","E6","Projet de communication",                                3,"oral","Oral — soutenance"),
  ],
};

const btsDesignGr: BTS = {
  id: "design-gr", code: "Design Gr.", secteur: "Communication & Design",
  libelle: "Design Graphique (option CMI)",
  libelleComplet: "BTS Design Graphique – option A CMI",
  couleur: "#d946ef", disponibleSully: false,
  lienOfficiel: lf("design graphique"),
  statut: "à-vérifier",
  epreuves: [
    e("dg-e1","E1","Culture générale et expression",    3,"ecrit"),
    e("dg-e2","E2","Langue vivante étrangère",          2,"ecrit"),
    e("dg-e3","E3","Histoire des arts et du design",    3,"ecrit"),
    e("dg-e4","E4","Pratique du design graphique",      6,"pratique"),
    e("dg-e5","E5","Atelier de création",               4,"pratique"),
    e("dg-e6","E6","Bilan de compétences",              3,"oral"),
  ],
};

const btsPhoto: BTS = {
  id: "photo", code: "Photographie", secteur: "Communication & Design",
  libelle: "Photographie",
  libelleComplet: "BTS Photographie",
  couleur: "#a855f7", disponibleSully: false,
  lienOfficiel: lf("photographie"),
  statut: "à-vérifier",
  epreuves: [
    e("photo-e1","E1","Culture générale et expression",    3,"ecrit"),
    e("photo-e2","E2","Langue vivante étrangère",          2,"ecrit"),
    e("photo-e3","E3","Histoire de la photographie et des arts",3,"ecrit"),
    e("photo-e4","E4","Pratique photographique",           6,"pratique"),
    e("photo-e5","E5","Projet photographique",             4,"oral"),
    e("photo-e6","E6","Gestion de projet",                 3,"oral"),
  ],
};

const btsMetiersVerre: BTS = {
  id: "mv", code: "Métiers du Verre", secteur: "Communication & Design",
  libelle: "Métiers du Verre",
  libelleComplet: "BTS Métiers du Verre",
  couleur: "#7dd3fc", disponibleSully: false,
  lienOfficiel: lf("metiers du verre"),
  statut: "à-vérifier",
  epreuves: [
    e("mv-e1","E1","Culture générale et expression",             3,"ecrit"),
    e("mv-e2","E2","Langue vivante étrangère",                   2,"ecrit"),
    e("mv-e3","E3","Histoire des arts et des techniques du verre",3,"ecrit"),
    e("mv-e4","E4","Pratiques du verre",                         6,"pratique"),
    e("mv-e5","E5","Projet artistique et technique",             4,"oral"),
    e("mv-e6","E6","Analyse de démarche",                        3,"oral"),
  ],
};


// ════════════════════════════════════════════════════════════════════════════════
// AGRICULTURE & ENVIRONNEMENT
// ════════════════════════════════════════════════════════════════════════════════

const btsANABIOTECH: BTS = {
  id: "anabiotech", code: "Analyses Bio.", secteur: "Agriculture & Environnement",
  libelle: "Analyses Biologiques et Biotechnologiques",
  libelleComplet: "BTS Analyses de Biologie Médicale",
  couleur: "#34d399", disponibleSully: false,
  lienOfficiel: lf("analyses biologiques medicales"),
  statut: "à-vérifier",
  epreuves: [
    e("ana-e1","E1","Culture générale et expression",                3,"ecrit"),
    e("ana-e2","E2","Sciences biologiques et biochimiques",           5,"ecrit"),
    e("ana-e3","E3","Techniques biologiques et biotechnologiques",    5,"pratique"),
    e("ana-e4","E4","Hygiène, qualité, sécurité",                    3,"ecrit"),
    e("ana-e5","E5","Analyse de situations professionnelles",          3,"oral"),
  ],
};

const btsHPE: BTS = {
  id: "hpe", code: "HPE", secteur: "Agriculture & Environnement",
  libelle: "Hygiène Propreté Environnement",
  libelleComplet: "BTS Hygiène Propreté Environnement",
  couleur: "#2dd4bf", disponibleSully: false,
  lienOfficiel: lf("hygiene proprete environnement"),
  statut: "à-vérifier",
  epreuves: [
    e("hpe-e1","E1","Culture générale et expression",        3,"ecrit"),
    e("hpe-e2","E2","Langue vivante étrangère",              2,"ecrit"),
    e("hpe-e3","E3","Sciences biologiques et chimiques",     4,"ecrit"),
    e("hpe-e4","E4","Techniques de nettoyage et désinfection",5,"pratique"),
    e("hpe-e5","E5","Gestion d'une prestation de propreté",  4,"ecrit"),
    e("hpe-e6","E6","Analyse de situations",                  3,"oral"),
  ],
};

const btsBioQualite: BTS = {
  id: "bioqualite", code: "Bioqualité", secteur: "Agriculture & Environnement",
  libelle: "Bioqualité",
  libelleComplet: "BTS Bioqualité",
  couleur: "#059669", disponibleSully: false,
  lienOfficiel: lf("bioqualite"),
  statut: "à-vérifier",
  epreuves: [
    e("bq-e1","E1","Culture générale et expression",                   3,"ecrit"),
    e("bq-e2","E2","Sciences biologiques et biotechnologiques",         5,"ecrit"),
    e("bq-e3","E3","Systèmes qualité, hygiène, sécurité et environnement",4,"ecrit"),
    e("bq-e4","E4","Contrôles et analyses",                             5,"pratique"),
    e("bq-e5","E5","Analyse de situations",                             3,"oral"),
  ],
};


// ════════════════════════════════════════════════════════════════════════════════
// COMMUNICATION & DESIGN (suite) — ajouts manquants
// ════════════════════════════════════════════════════════════════════════════════

// ─── BTS MAV ──────────────────────────────────────────────────────────────────
// 5 options : A Gestion de production · B Techniques d'ingénierie · C Son · D Image · E Montage
// Source : arrêté du 13 mai 2013 — structure commune aux 5 options (coefficients indicatifs option D)
const btsMAV: BTS = {
  id: "mav", code: "MAV", secteur: "Communication & Design",
  libelle: "Métiers de l'Audiovisuel (option D – Image)",
  libelleComplet: "BTS Métiers de l'Audiovisuel – option D Métiers de l'image",
  couleur: "#dc2626", disponibleSully: false,
  lienOfficiel: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000027468479",
  statut: "à-vérifier",
  epreuves: [
    e("mav-e1","E1","Culture audiovisuelle et artistique",                           3,"ecrit","Écrit — 4h"),
    e("mav-e2","E2","Anglais technique",                                             2,"ccf",  "CCF — oral 45 min"),
    e("mav-e3","E3","Environnement économique, juridique et technologie des équipements",4,"ecrit","Écrit — 3h + 3h"),
    e("mav-e4","E4","Techniques et mise en œuvre – Image",                           4,"ccf",  "CCF pratique"),
    e("mav-e5","E5","Épreuve professionnelle de synthèse",                           4,"oral", "Oral — 45 min"),
    e("mav-e6","E6","Situation en milieu professionnel",                             1,"oral", "Oral — 30 min"),
  ],
};

const btsMAVson: BTS = {
  id: "mav-son", code: "MAV Son", secteur: "Communication & Design",
  libelle: "Métiers de l'Audiovisuel (option C – Son)",
  libelleComplet: "BTS Métiers de l'Audiovisuel – option C Métiers du son",
  couleur: "#b91c1c", disponibleSully: false,
  lienOfficiel: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000027468479",
  statut: "à-vérifier",
  epreuves: [
    e("mavson-e1","E1","Culture audiovisuelle et artistique",                         3,"ecrit","Écrit — 4h"),
    e("mavson-e2","E2","Anglais technique",                                           2,"ccf",  "CCF — oral 45 min"),
    e("mavson-e3","E3","Environnement économique, juridique et technologie des équipements",4,"ecrit","Écrit — 3h + 3h"),
    e("mavson-e4","E4","Techniques et mise en œuvre – Son",                           4,"ccf",  "CCF pratique"),
    e("mavson-e5","E5","Épreuve professionnelle de synthèse",                         4,"oral", "Oral — 45 min"),
    e("mavson-e6","E6","Situation en milieu professionnel",                           1,"oral", "Oral — 30 min"),
  ],
};

const btsMAVmontage: BTS = {
  id: "mav-montage", code: "MAV Montage", secteur: "Communication & Design",
  libelle: "Métiers de l'Audiovisuel (option E – Montage & Post-production)",
  libelleComplet: "BTS Métiers de l'Audiovisuel – option E Montage et post-production",
  couleur: "#991b1b", disponibleSully: false,
  lienOfficiel: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000027468479",
  statut: "à-vérifier",
  epreuves: [
    e("mavmont-e1","E1","Culture audiovisuelle et artistique",                        3,"ecrit","Écrit — 4h"),
    e("mavmont-e2","E2","Anglais technique",                                          2,"ccf",  "CCF — oral 45 min"),
    e("mavmont-e3","E3","Environnement économique, juridique et technologie des équipements",4,"ecrit","Écrit — 3h + 3h"),
    e("mavmont-e4","E4","Techniques et mise en œuvre – Montage",                      4,"ccf",  "CCF pratique"),
    e("mavmont-e5","E5","Épreuve professionnelle de synthèse",                        4,"oral", "Oral — 45 min"),
    e("mavmont-e6","E6","Situation en milieu professionnel",                          1,"oral", "Oral — 30 min"),
  ],
};

const btsMAVgp: BTS = {
  id: "mav-gp", code: "MAV GP", secteur: "Communication & Design",
  libelle: "Métiers de l'Audiovisuel (option A – Gestion de production)",
  libelleComplet: "BTS Métiers de l'Audiovisuel – option A Gestion de production",
  couleur: "#7f1d1d", disponibleSully: false,
  lienOfficiel: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000027468479",
  statut: "à-vérifier",
  epreuves: [
    e("mavgp-e1","E1","Culture audiovisuelle et artistique",                          3,"ecrit","Écrit — 4h"),
    e("mavgp-e2","E2","Anglais technique",                                            2,"ccf",  "CCF — oral 45 min"),
    e("mavgp-e3","E3","Environnement économique, juridique et technologie des équipements",4,"ecrit","Écrit — 3h + 3h"),
    e("mavgp-e4","E4","Techniques et mise en œuvre – Gestion de production",          4,"ccf",  "CCF pratique"),
    e("mavgp-e5","E5","Épreuve professionnelle de synthèse",                          4,"oral", "Oral — 45 min"),
    e("mavgp-e6","E6","Situation en milieu professionnel",                            1,"oral", "Oral — 30 min"),
  ],
};

// ─── BTS Édition ──────────────────────────────────────────────────────────────
const btsEdition: BTS = {
  id: "edition", code: "Édition", secteur: "Communication & Design",
  libelle: "Édition",
  libelleComplet: "BTS Édition",
  couleur: "#9333ea", disponibleSully: false,
  lienOfficiel: lf("edition"),
  statut: "à-vérifier",
  epreuves: [
    e("ed-e1","E1","Culture générale et expression",                3,"ecrit"),
    e("ed-e2","E2","Langue vivante étrangère",                      2,"ecrit"),
    e("ed-e3","E3","Histoire du livre et de l'édition",             3,"ecrit"),
    e("ed-e4","E4","Économie et gestion éditoriale",                4,"ecrit"),
    e("ed-e5","E5","Fabrication et production éditoriale",          4,"pratique"),
    e("ed-e6","E6","Développement commercial",                      3,"oral"),
  ],
};

// ─── BTS Design de mode ───────────────────────────────────────────────────────
const btsDesignMode: BTS = {
  id: "design-mode", code: "Design Mode", secteur: "Communication & Design",
  libelle: "Design de mode, textile et matériaux",
  libelleComplet: "BTS Design de mode, textile et matériaux",
  couleur: "#ec4899", disponibleSully: false,
  lienOfficiel: lf("design mode textile"),
  statut: "à-vérifier",
  epreuves: [
    e("dm-e1","E1","Culture générale et expression",       3,"ecrit"),
    e("dm-e2","E2","Langue vivante étrangère",             2,"ecrit"),
    e("dm-e3","E3","Histoire des arts et du design",       3,"ecrit"),
    e("dm-e4","E4","Pratique du design de mode",           6,"pratique"),
    e("dm-e5","E5","Communication professionnelle",        3,"oral"),
    e("dm-e6","E6","Projet de collection",                 4,"oral"),
  ],
};

// ─── BTS Esthétique-Cosmétique-Parfumerie ─────────────────────────────────────
const btsEsthetique: BTS = {
  id: "esthetique", code: "Esthétique", secteur: "Sanitaire & Social",
  libelle: "Métiers de l'Esthétique, Cosmétique, Parfumerie",
  libelleComplet: "BTS Métiers de l'Esthétique, Cosmétique, Parfumerie",
  couleur: "#f472b6", disponibleSully: false,
  lienOfficiel: lf("esthetique cosmetique parfumerie"),
  statut: "à-vérifier",
  epreuves: [
    e("esth-e1","E1","Culture générale et expression",             3,"ecrit"),
    e("esth-e2","E2","Langue vivante étrangère",                   2,"ecrit"),
    e("esth-e3","E3","Sciences biologiques et physico-chimiques",   4,"ecrit"),
    e("esth-e4","E4","Technologie cosmétique et parfumerie",        4,"ecrit"),
    e("esth-e5","E5","Soins esthétiques",                          5,"pratique"),
    e("esth-e6","E6","Communication et conseil",                    3,"oral"),
  ],
};


// ════════════════════════════════════════════════════════════════════════════════
// COMMERCE & GESTION (suite) — ajouts manquants
// ════════════════════════════════════════════════════════════════════════════════

// ─── BTS Technico-commercial ──────────────────────────────────────────────────
const btsTechnicoCommercial: BTS = {
  id: "technico-commercial", code: "TC", secteur: "Commerce & Gestion",
  libelle: "Technico-commercial",
  libelleComplet: "BTS Technico-commercial",
  couleur: "#0891b2", disponibleSully: false,
  lienOfficiel: lf("technico-commercial"),
  statut: "à-vérifier",
  epreuves: [
    e("tc-e1","E1","Culture générale et expression",               3,"ecrit"),
    e("tc-e2","E2","Langue vivante étrangère A",                   2,"ecrit"),
    e("tc-e3","E3","Langue vivante étrangère B",                   2,"ecrit"),
    e("tc-e4","E4","Culture économique et juridique",               3,"ecrit"),
    e("tc-e5","E5","Environnement technique de la spécialité",      4,"ecrit"),
    e("tc-e6","E6","Négociation technique et accompagnement client",5,"oral"),
    e("tc-e7","E7","Gestion et exploitation de l'activité commerciale",3,"oral"),
  ],
};

// ─── BTS Notariat ─────────────────────────────────────────────────────────────
const btsNotariat: BTS = {
  id: "notariat", code: "Notariat", secteur: "Commerce & Gestion",
  libelle: "Collaborateur Juriste Notarial",
  libelleComplet: "BTS Collaborateur Juriste Notarial",
  couleur: "#1e40af", disponibleSully: false,
  lienOfficiel: lf("collaborateur juriste notarial"),
  statut: "à-vérifier",
  epreuves: [
    e("not-e1","E1","Culture générale et expression",              3,"ecrit"),
    e("not-e2","E2","Langue vivante étrangère",                    2,"ecrit"),
    e("not-e3","E3","Droit civil et procédures",                   5,"ecrit"),
    e("not-e4","E4","Droit fiscal et droit de l'entreprise",       4,"ecrit"),
    e("not-e5","E5","Rédaction d'actes et de procédures",          5,"ecrit"),
    e("not-e6","E6","Activités professionnelles",                  3,"oral"),
  ],
};

// ─── BTS MOS ──────────────────────────────────────────────────────────────────
const btsMOS: BTS = {
  id: "mos", code: "MOS", secteur: "Commerce & Gestion",
  libelle: "Management Opérationnel de la Sécurité",
  libelleComplet: "BTS Management Opérationnel de la Sécurité",
  couleur: "#374151", disponibleSully: false,
  lienOfficiel: lf("management operationnel securite"),
  statut: "à-vérifier",
  epreuves: [
    e("mos-e1","E1","Culture générale et expression",              3,"ecrit"),
    e("mos-e2","E2","Langue vivante étrangère",                    2,"ecrit"),
    e("mos-e3","E3","Droit et sciences humaines appliqués à la sécurité",4,"ecrit"),
    e("mos-e4","E4","Management de la sécurité",                   5,"ecrit"),
    e("mos-e5","E5","Conduite d'opérations de sécurité",           5,"oral"),
    e("mos-e6","E6","Épreuve de professionnalisation",             3,"ccf"),
  ],
};


// ════════════════════════════════════════════════════════════════════════════════
// INDUSTRIE & MÉCANIQUE (suite) — ajouts manquants
// ════════════════════════════════════════════════════════════════════════════════

// ─── BTS Aéronautique ─────────────────────────────────────────────────────────
const btsAeronautique: BTS = {
  id: "aeronautique", code: "Aéro.", secteur: "Industrie & Mécanique",
  libelle: "Aéronautique",
  libelleComplet: "BTS Aéronautique",
  couleur: "#0369a1", disponibleSully: false,
  lienOfficiel: lf("aeronautique"),
  statut: "à-vérifier",
  epreuves: [
    e("aero-e1","E1","Culture générale et expression",              3,"ecrit"),
    e("aero-e2","E2","Langue vivante étrangère (anglais technique)",3,"ecrit"),
    e("aero-e3","E3","Mathématiques et physique appliquée",          4,"ecrit"),
    e("aero-e4","E4","Études des systèmes aéronautiques",            5,"ecrit"),
    e("aero-e5","E5","Maintenance aéronautique",                     5,"pratique"),
    e("aero-e6","E6","Épreuve professionnelle de synthèse",          2,"oral"),
  ],
};

// ─── BTS CRSA ─────────────────────────────────────────────────────────────────
const btsCRSA: BTS = {
  id: "crsa", code: "CRSA", secteur: "Industrie & Mécanique",
  libelle: "Conception et Réalisation de Systèmes Automatiques",
  libelleComplet: "BTS Conception et Réalisation de Systèmes Automatiques",
  couleur: "#7c3aed", disponibleSully: false,
  lienOfficiel: lf("conception realisation systemes automatiques"),
  statut: "à-vérifier",
  epreuves: [
    e("crsa-e1","E1","Culture générale et expression",              3,"ecrit"),
    e("crsa-e2","E2","Mathématiques et sciences physiques",          4,"ecrit"),
    e("crsa-e3","E3","Étude d'un système automatique",               5,"ecrit"),
    e("crsa-e4","E4","Conception et réalisation",                    5,"pratique"),
    e("crsa-e5","E5","Épreuve professionnelle de synthèse",          3,"oral"),
  ],
};


// ════════════════════════════════════════════════════════════════════════════════
// BÂTIMENT & TRAVAUX (suite) — ajouts manquants
// ════════════════════════════════════════════════════════════════════════════════

// ─── BTS Géomètre-Topographe ──────────────────────────────────────────────────
const btsGeometre: BTS = {
  id: "geometre", code: "Géomètre", secteur: "Bâtiment & Travaux",
  libelle: "Géomètre-Topographe",
  libelleComplet: "BTS Géomètre-Topographe",
  couleur: "#15803d", disponibleSully: false,
  lienOfficiel: lf("geometre topographe"),
  statut: "à-vérifier",
  epreuves: [
    e("geo-e1","E1","Culture générale et expression",               3,"ecrit"),
    e("geo-e2","E2","Langue vivante étrangère",                     2,"ecrit"),
    e("geo-e3","E3","Mathématiques et sciences physiques",           4,"ecrit"),
    e("geo-e4","E4","Mesures et traitements topographiques",         5,"ecrit"),
    e("geo-e5","E5","Projet topographique",                          5,"pratique"),
    e("geo-e6","E6","Épreuve professionnelle de synthèse",           3,"oral"),
  ],
};

// ─── BTS Développement Réalisation Bois ───────────────────────────────────────
const btsDRB: BTS = {
  id: "drb", code: "DRB", secteur: "Bâtiment & Travaux",
  libelle: "Développement et Réalisation Bois",
  libelleComplet: "BTS Développement et Réalisation Bois",
  couleur: "#92400e", disponibleSully: false,
  lienOfficiel: lf("developpement realisation bois"),
  statut: "à-vérifier",
  epreuves: [
    e("drb-e1","E1","Culture générale et expression",               3,"ecrit"),
    e("drb-e2","E2","Langue vivante étrangère",                     2,"ecrit"),
    e("drb-e3","E3","Mathématiques et sciences physiques",           3,"ecrit"),
    e("drb-e4","E4","Étude et conception d'ouvrages en bois",        5,"ecrit"),
    e("drb-e5","E5","Réalisation et contrôle",                       5,"pratique"),
    e("drb-e6","E6","Projet",                                        3,"oral"),
  ],
};


// ════════════════════════════════════════════════════════════════════════════════
// SANITAIRE & SOCIAL (suite) — ajouts manquants
// ════════════════════════════════════════════════════════════════════════════════

// ─── BTS ESF ──────────────────────────────────────────────────────────────────
const btsESF: BTS = {
  id: "esf", code: "ESF", secteur: "Sanitaire & Social",
  libelle: "Économie Sociale et Familiale",
  libelleComplet: "BTS Économie Sociale et Familiale",
  couleur: "#be185d", disponibleSully: false,
  lienOfficiel: lf("economie sociale familiale"),
  statut: "à-vérifier",
  epreuves: [
    e("esf-e1","E1","Culture générale et expression",               3,"ecrit"),
    e("esf-e2","E2","Langue vivante étrangère",                     2,"ecrit"),
    e("esf-e3","E3","Sciences médico-sociales",                     4,"ecrit"),
    e("esf-e4","E4","Habitat et cadre de vie",                      4,"ecrit"),
    e("esf-e5","E5","Alimentation et nutrition",                    4,"ecrit"),
    e("esf-e6","E6","Conseil et expertise technologiques",          4,"oral"),
  ],
};

// ─── BTS Podo-Orthésiste ──────────────────────────────────────────────────────
const btsPodoOrthesiste: BTS = {
  id: "podo-orthesiste", code: "Podo-Orth.", secteur: "Sanitaire & Social",
  libelle: "Podo-Orthésiste",
  libelleComplet: "BTS Podo-Orthésiste",
  couleur: "#9d174d", disponibleSully: false,
  lienOfficiel: lf("podo orthesiste"),
  statut: "à-vérifier",
  epreuves: [
    e("po2-e1","E1","Culture générale et expression",              3,"ecrit"),
    e("po2-e2","E2","Sciences biologiques et médicales",           4,"ecrit"),
    e("po2-e3","E3","Podologie et techniques orthopédiques",        5,"ecrit"),
    e("po2-e4","E4","Réalisation d'appareillages",                  5,"pratique"),
    e("po2-e5","E5","Analyse de situations professionnelles",       3,"oral"),
  ],
};


// ════════════════════════════════════════════════════════════════════════════════
// CATALOGUE
// ════════════════════════════════════════════════════════════════════════════════

export const catalogueBTS: BTS[] = [
  // Commerce & Gestion
  btsMCO, btsNDRC, btsCG, btsGPME, btsSAM, btsBanque, btsAssurance, btsPI, btsCI,
  btsTechnicoCommercial, btsNotariat, btsMOS,
  // Hôtellerie & Tourisme
  btsTourisme, btsMHR,
  // Transport & Logistique
  btsGTLA,
  // Informatique & Numérique
  btsSIOslam, btsSIOsisr, btsCIEL, btsSNir,
  // Électrotechnique & Énergie
  btsElectrotech, btsFEDa, btsFEDb, btsFEDd,
  // Bâtiment & Travaux
  btsBatiment, btsTP, btsEBFE, btsAmenagement, btsGeometre, btsDRB,
  // Industrie & Mécanique
  btsMS, btsATI, btsCPI, btsPlasturgie, btsMSMA, btsAeronautique, btsCRSA,
  // Sanitaire & Social
  btsSP3S, btsASSP, btsDietetique, btsOL, btsProthesiste, btsEsthetique, btsESF, btsPodoOrthesiste,
  // Communication & Design
  btsCommunication, btsDesignGr, btsPhoto, btsMetiersVerre,
  btsMAV, btsMAVson, btsMAVmontage, btsMAVgp, btsEdition, btsDesignMode,
  // Agriculture & Environnement
  btsANABIOTECH, btsHPE, btsBioQualite,
];

export const secteurs = Array.from(new Set(catalogueBTS.map((b) => b.secteur)));

export function getBTSById(id: string): BTS | undefined {
  return catalogueBTS.find((b) => b.id === id);
}

export function getTotalCoefficients(bts: BTS): number {
  return bts.epreuves.reduce((sum, e) => sum + e.coefficient, 0);
}

export function getBTSParSecteur(): Record<string, BTS[]> {
  return catalogueBTS.reduce((acc, bts) => {
    if (!acc[bts.secteur]) acc[bts.secteur] = [];
    acc[bts.secteur].push(bts);
    return acc;
  }, {} as Record<string, BTS[]>);
}
