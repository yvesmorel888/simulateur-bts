"use client";

import { ResultatSimulation } from "@/lib/calcul";
import { BTS } from "@/data/bts";

interface Props {
  resultat: ResultatSimulation | null;
  bts: BTS;
  notesSaisies: number;
  totalEpreuves: number;
}

const MENTION_LABELS: Record<string, {
  label: string; emoji: string;
  bg: string; color: string; border: string;
  barColor: string; barWidth: string;
}> = {
  passable:     { label: "Passable",    emoji: "🎓", bg: "#f8fafc", color: "#475569", border: "#cbd5e1", barColor: "#94a3b8", barWidth: "25%" },
  "assez-bien": { label: "Assez bien", emoji: "⭐", bg: "#eff6ff", color: "#1e40af", border: "#93c5fd", barColor: "#3b82f6", barWidth: "50%" },
  bien:         { label: "Bien",        emoji: "🌟", bg: "#f0fdf4", color: "#166534", border: "#6ee7b7", barColor: "#10b981", barWidth: "75%" },
  "très-bien":  { label: "Très bien",  emoji: "🏆", bg: "#fefce8", color: "#854d0e", border: "#fcd34d", barColor: "#f59e0b", barWidth: "100%" },
};

export default function ResultatPanel({ resultat, bts, notesSaisies, totalEpreuves }: Props) {
  const isComplet    = notesSaisies === totalEpreuves && notesSaisies > 0;
  const hasSomething = notesSaisies > 0;

  if (!resultat || !hasSomething) {
    return (
      <div style={{
        background: "#fff", borderRadius: "16px",
        border: "1px solid #e8eef5", boxShadow: "0 1px 6px rgba(0,0,0,.06)",
        padding: "32px 24px",
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", minHeight: "200px", gap: "12px", justifyContent: "center",
      }}>
        <div style={{ fontSize: "36px", opacity: 0.15 }}>📊</div>
        <p style={{ fontSize: "14px", color: "#94a3b8", maxWidth: "180px", lineHeight: 1.6, margin: 0 }}>
          Saisis tes notes pour voir ton résultat ici
        </p>
      </div>
    );
  }

  const {
    statut, mention, moyenneGenerale, moyennePro, moyenneGen,
    totalPoints, totalCoefficients, totalCoeffPro,
    epreuvesEliminatoires, epreuvesRisque,
    epreuvesProSousMoyenne, noteManquantePourPasser,
    epreuvesManquantes, accesCourante,
  } = resultat;

  const isAdmis   = statut === "admis";
  const isElim    = statut === "ajourné-eliminatoire";
  const isAjourne = statut === "ajourné";

  const statusConfig = isAdmis
    ? { bg: "#f0fdf4", border: "#86efac", accent: "#16a34a", label: "Admis ✓",   labelBg: "#dcfce7", labelColor: "#15803d" }
    : isElim
    ? { bg: "#fef2f2", border: "#fca5a5", accent: "#dc2626", label: "Ajourné ⚠", labelBg: "#fee2e2", labelColor: "#b91c1c" }
    : isAjourne
    ? { bg: "#fff7ed", border: "#fdba74", accent: "#ea580c", label: "Ajourné",    labelBg: "#ffedd5", labelColor: "#c2410c" }
    : { bg: "#f8fafc", border: "#e2e8f0", accent: "#475569", label: "En cours…", labelBg: "#f1f5f9", labelColor: "#64748b" };

  return (
    <div style={{
      background: statusConfig.bg, borderRadius: "16px",
      border: `1px solid ${statusConfig.border}`,
      boxShadow: "0 1px 6px rgba(0,0,0,.06)",
      overflow: "hidden",
    }}>

      {/* ── Verdict ── */}
      <div style={{ padding: "20px 20px 16px" }}>
        <div style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: "12px" }}>
          {isComplet ? "Résultat final" : `Estimation · ${notesSaisies}/${totalEpreuves} épreuves`}
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", padding: "5px 16px", borderRadius: "50px", background: statusConfig.labelBg, color: statusConfig.labelColor, fontSize: "16px", fontWeight: 800 }}>
            {statusConfig.label}
          </div>
          {moyenneGenerale !== null && (
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <span style={{ fontSize: "42px", fontWeight: 900, lineHeight: 1, color: statusConfig.accent, letterSpacing: "-0.04em" }}>
                {moyenneGenerale.toFixed(2).replace(".", ",")}
              </span>
              <span style={{ color: "#94a3b8", fontSize: "15px", marginLeft: "3px" }}>/20</span>
            </div>
          )}
        </div>

        {/* Mention */}
        {mention && MENTION_LABELS[mention] && (
          <div style={{
            marginTop: "14px",
            padding: "14px 16px",
            borderRadius: "12px",
            background: MENTION_LABELS[mention].bg,
            border: `1.5px solid ${MENTION_LABELS[mention].border}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "22px", lineHeight: 1 }}>{MENTION_LABELS[mention].emoji}</span>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 600, color: MENTION_LABELS[mention].color, textTransform: "uppercase", letterSpacing: ".08em", opacity: 0.7 }}>
                    Mention obtenue
                  </div>
                  <div style={{ fontSize: "20px", fontWeight: 900, color: MENTION_LABELS[mention].color, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                    {MENTION_LABELS[mention].label}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "10px", color: MENTION_LABELS[mention].color, opacity: 0.6, marginBottom: "2px" }}>Niveau</div>
                <div style={{ fontSize: "13px", fontWeight: 800, color: MENTION_LABELS[mention].color }}>
                  {mention === "passable" ? "10–11" : mention === "assez-bien" ? "12–13" : mention === "bien" ? "14–15" : "16+"}
                </div>
              </div>
            </div>
            {/* Barre de niveau */}
            <div style={{ height: "5px", borderRadius: "3px", background: `${MENTION_LABELS[mention].barColor}25`, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: "3px",
                background: MENTION_LABELS[mention].barColor,
                width: MENTION_LABELS[mention].barWidth,
                transition: "width .6s cubic-bezier(.4,0,.2,1)",
              }} />
            </div>
          </div>
        )}
      </div>

      {/* ── Stats : 3 colonnes ── */}
      {totalPoints !== null && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: `1px solid ${statusConfig.border}` }}>
          <StatBox label="Moyenne" value={moyenneGenerale?.toFixed(2).replace(".", ",") ?? "—"} sub="/20" bg={statusConfig.bg} border={statusConfig.border} />
          <StatBox label="Moy. Tech." value={moyennePro?.toFixed(2).replace(".", ",") ?? "—"} sub="/20" bg={statusConfig.bg} border={statusConfig.border} />
          <StatBox label="Moy. Gén." value={moyenneGen?.toFixed(2).replace(".", ",") ?? "—"} sub="/20" bg={statusConfig.bg} border={statusConfig.border} last />
        </div>
      )}

      {/* ── Accès rattrapage ── */}
      {accesCourante && (
        <div style={{ margin: "12px 16px 0", padding: "10px 14px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "10px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#1e40af", margin: "0 0 2px" }}>
            ✓ Accès aux épreuves de contrôle
          </p>
          <p style={{ fontSize: "11px", color: "#3b82f6", margin: 0 }}>
            Moyenne générale ≥ 8 et moyenne Technique ≥ 10 — tu peux passer le rattrapage
          </p>
        </div>
      )}

      {/* ── Note manquante ── */}
      {isAjourne && noteManquantePourPasser !== null && isComplet && (
        <div style={{ margin: "12px 16px 0", padding: "12px 14px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "10px" }}>
          <div style={{ fontSize: "11px", color: "#9a3412", marginBottom: "3px" }}>Il te manque</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#ea580c", letterSpacing: "-0.03em" }}>
            {noteManquantePourPasser.toFixed(1).replace(".", ",")} pt{noteManquantePourPasser > 1 ? "s" : ""}
          </div>
          <div style={{ fontSize: "11px", color: "#c2410c", marginTop: "2px" }}>pour atteindre 10/20 de moyenne</div>
        </div>
      )}

      {/* ── Matières pro sous la moyenne ── */}
      {epreuvesProSousMoyenne.length > 0 && !isElim && (
        <div style={{ margin: "12px 16px 0", padding: "12px 14px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "10px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#c2410c", margin: "0 0 6px" }}>
            ⚠ Matière{epreuvesProSousMoyenne.length > 1 ? "s" : ""} technique{epreuvesProSousMoyenne.length > 1 ? "s" : ""} sous la moyenne
          </p>
          <p style={{ fontSize: "11px", color: "#9a3412", margin: "0 0 8px", lineHeight: 1.5 }}>
            Une moyenne Technique &lt; 10/20 bloque l'accès au rattrapage (épreuves de contrôle).
          </p>
          {epreuvesProSousMoyenne.map(({ epreuve, note }) => (
            <div key={epreuve.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontSize: "12px", color: "#92400e", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: "8px" }}>
                {epreuve.libelle}
              </span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#b45309", flexShrink: 0 }}>{note}/20</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Notes éliminatoires ── */}
      {epreuvesEliminatoires.length > 0 && (
        <div style={{ margin: "12px 16px 0", padding: "12px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#b91c1c", margin: "0 0 6px" }}>
            ⛔ Note{epreuvesEliminatoires.length > 1 ? "s" : ""} éliminatoire{epreuvesEliminatoires.length > 1 ? "s" : ""}
          </p>
          {epreuvesEliminatoires.map((e) => (
            <p key={e.id} style={{ fontSize: "12px", color: "#dc2626", margin: "3px 0 0", paddingLeft: "8px" }}>
              · {e.libelle}
            </p>
          ))}
        </div>
      )}

      {/* ── Points de vigilance ── */}
      {epreuvesRisque.filter(r => !epreuvesProSousMoyenne.find(p => p.epreuve.id === r.epreuve.id)).length > 0 && !isElim && (
        <div style={{ margin: "12px 16px 0", padding: "12px 14px", background: "rgba(0,0,0,.025)", borderRadius: "10px", border: "1px solid rgba(0,0,0,.06)" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: ".07em", margin: "0 0 8px" }}>
            Points de vigilance
          </p>
          {epreuvesRisque
            .filter(r => !epreuvesProSousMoyenne.find(p => p.epreuve.id === r.epreuve.id))
            .map(({ epreuve, note, impact }) => (
            <div key={epreuve.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ fontSize: "12px", color: "#64748b", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: "8px" }}>
                {epreuve.libelle}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                <span style={{
                  padding: "2px 7px", borderRadius: "6px", fontSize: "11px", fontWeight: 600,
                  background: impact === "fort" ? "#fef2f2" : impact === "moyen" ? "#fff7ed" : "#fefce8",
                  color:      impact === "fort" ? "#b91c1c" : impact === "moyen" ? "#c2410c" : "#854d0e",
                }}>
                  ×{epreuve.coefficient}
                </span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>{note}/20</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Épreuves manquantes ── */}
      {!isComplet && epreuvesManquantes.length > 0 && (
        <p style={{ fontSize: "11px", color: "#94a3b8", padding: "12px 20px 16px", margin: 0 }}>
          + {epreuvesManquantes.length} épreuve{epreuvesManquantes.length > 1 ? "s" : ""} non renseignée{epreuvesManquantes.length > 1 ? "s" : ""}
        </p>
      )}

      <div style={{ height: "4px" }} />
    </div>
  );
}

function StatBox({ label, value, sub, bg, border, last }: {
  label: string; value: string; sub?: string;
  bg: string; border: string; last?: boolean;
}) {
  return (
    <div style={{ padding: "10px 14px", background: bg, borderRight: last ? "none" : `1px solid ${border}` }}>
      <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "3px" }}>
        {label}
      </div>
      <div style={{ fontSize: "15px", fontWeight: 800, color: "#1e293b" }}>
        {value}
        {sub && <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 400, marginLeft: "3px" }}>{sub}</span>}
      </div>
    </div>
  );
}
