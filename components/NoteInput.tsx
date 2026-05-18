"use client";

import { Epreuve, getTypeMatiere } from "@/data/bts";

export type Modalite = "initial" | "alternance";

interface Props {
  epreuve: Epreuve;
  note: number | null;
  onChange: (note: number | null) => void;
  couleurBTS: string;
  modalite: Modalite;
}

const NATURE_LABELS: Record<string, string> = {
  ecrit:      "Écrit",
  oral:       "Oral",
  ccf:        "CCF",
  pratique:   "Pratique",
  ponctuelle: "Ponctuelle",
};

const NATURE_COLORS: Record<string, { bg: string; color: string }> = {
  ecrit:      { bg: "#eff6ff", color: "#1e40af" },
  oral:       { bg: "#f0fdf4", color: "#166534" },
  ccf:        { bg: "#fefce8", color: "#854d0e" },
  pratique:   { bg: "#fdf4ff", color: "#701a75" },
  ponctuelle: { bg: "#f0f9ff", color: "#0369a1" },
};

export default function NoteInput({ epreuve, note, onChange, couleurBTS, modalite }: Props) {
  const noteNum = note ?? 0;
  const estSaisie       = note !== null;
  const type            = getTypeMatiere(epreuve);
  const isTechnique     = type === "professionnelle";

  // En alternance, le CCF devient épreuve ponctuelle terminale
  const natureEffective = (modalite === "alternance" && epreuve.nature === "ccf")
    ? "ponctuelle"
    : epreuve.nature;

  // Niveaux d'alerte
  const seuilElim    = epreuve.noteEliminatoire ?? 6;
  const estElim      = estSaisie && noteNum < seuilElim;
  const estTechBas   = estSaisie && isTechnique && noteNum < 10 && !estElim;
  const estFaible    = estSaisie && noteNum < 8 && !estElim && !estTechBas;
  const estBonne     = estSaisie && noteNum >= 14;
  const estPassable  = estSaisie && noteNum >= 10 && noteNum < 14;

  function handleChange(val: string) {
    if (val === "" || val === null) { onChange(null); return; }
    const n = parseFloat(val);
    if (!isNaN(n)) onChange(Math.min(20, Math.max(0, n)));
  }

  // Styles de la carte
  const cardBorder = estElim    ? "#fca5a5"
    : estTechBas                ? "#fdba74"
    : estFaible                 ? "#fde68a"
    : estBonne                  ? "#86efac"
    : estPassable               ? "#bfdbfe"
    : estSaisie                 ? "#e8eef5"
    : "#f1f5f9";

  const cardBg = estElim        ? "#fef2f2"
    : estTechBas                ? "#fff7ed"
    : estFaible                 ? "#fefce8"
    : estBonne                  ? "#f0fdf4"
    : estPassable               ? "#eff6ff"
    : "#fff";

  const noteColor = estElim     ? "#dc2626"
    : estTechBas                ? "#ea580c"
    : estFaible                 ? "#b45309"
    : estBonne                  ? "#16a34a"
    : estPassable               ? "#1e3799"
    : "#334155";

  const nature = NATURE_COLORS[natureEffective] ?? { bg: "#f1f5f9", color: "#64748b" };

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "12px",
      padding: "11px 14px", borderRadius: "12px",
      border: `1px solid ${cardBorder}`,
      background: cardBg,
      transition: "border-color .15s, background .15s",
    }}>
      {/* Badge coefficient */}
      <div style={{
        flexShrink: 0, width: "34px", height: "34px", borderRadius: "8px",
        background: `${couleurBTS}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "12px", fontWeight: 800, color: couleurBTS,
      }}>
        ×{epreuve.coefficient}
      </div>

      {/* Infos épreuve */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Ligne badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>
            {epreuve.code}
          </span>

          {/* Nature effective */}
          <span style={{
            fontSize: "10px", fontWeight: 600,
            padding: "1px 6px", borderRadius: "20px",
            background: nature.bg, color: nature.color,
          }}>
            {NATURE_LABELS[natureEffective]}
          </span>

          {/* Type matière */}
          <span style={{
            fontSize: "10px", fontWeight: 600,
            padding: "1px 6px", borderRadius: "20px",
            background: isTechnique ? "#f5f3ff" : "#f0f9ff",
            color: isTechnique ? "#6d28d9" : "#0369a1",
            border: isTechnique ? "1px solid #ddd6fe" : "1px solid #bae6fd",
          }}>
            {isTechnique ? "Technique" : "Général"}
          </span>

          {/* Alertes */}
          {estElim && (
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#dc2626" }}>
              ⛔ Note éliminatoire
            </span>
          )}
          {estTechBas && (
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#ea580c" }}>
              ⚠ Sous la moyenne (Tech.)
            </span>
          )}
        </div>

        {/* Libellé */}
        <div style={{
          fontSize: "13px", fontWeight: 500, color: "#1e293b",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {epreuve.libelle}
        </div>

        {/* Description */}
        {epreuve.description && (
          <div style={{
            fontSize: "11px", color: "#94a3b8", marginTop: "1px",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}
            className="hidden sm:block">
            {epreuve.description}
          </div>
        )}
      </div>

      {/* Saisie note */}
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Slider desktop */}
        <div className="hidden sm:block" style={{ width: "90px" }}>
          <input
            type="range" min={0} max={20} step={0.5}
            value={estSaisie ? noteNum : 0}
            onChange={(e) => handleChange(e.target.value)}
            style={{
              WebkitAppearance: "none",
              width: "100%", height: "5px", borderRadius: "3px",
              background: estSaisie
                ? `linear-gradient(90deg, ${noteColor} ${noteNum * 5}%, #e2e8f0 ${noteNum * 5}%)`
                : "#e2e8f0",
              outline: "none", cursor: "pointer",
            }}
          />
        </div>

        {/* Champ numérique */}
        <div style={{ position: "relative" }}>
          <input
            type="number" min={0} max={20} step={0.5}
            placeholder="—"
            value={estSaisie ? noteNum : ""}
            onChange={(e) => handleChange(e.target.value)}
            style={{
              width: "58px", textAlign: "center",
              fontSize: "14px", fontWeight: 700,
              padding: "7px 4px",
              borderRadius: "8px",
              border: `1.5px solid ${estSaisie ? cardBorder : "#e2e8f0"}`,
              background: estSaisie ? "transparent" : "#f8fafc",
              color: estSaisie ? noteColor : "#94a3b8",
              outline: "none",
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          />
          {estSaisie && (
            <span style={{
              position: "absolute", bottom: "-14px",
              left: 0, right: 0, textAlign: "center",
              fontSize: "10px", color: "#94a3b8",
            }}>
              /20
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
