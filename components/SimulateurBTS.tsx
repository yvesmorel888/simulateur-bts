"use client";

import { useState, useMemo } from "react";
import { catalogueBTS, BTS } from "@/data/bts";
import { calculerResultat, NoteEpreuve } from "@/lib/calcul";
import ResultatPanel from "@/components/ResultatPanel";
import NoteInput, { Modalite } from "@/components/NoteInput";
import BTSCombobox from "@/components/BTSCombobox";

function initNotes(bts: BTS): NoteEpreuve[] {
  return bts.epreuves.map((e) => ({ epreuveId: e.id, note: 10 }));
}

function StepLabel({ n, text }: { n: number; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
      <span style={{
        width: "22px", height: "22px", borderRadius: "50%",
        background: "#eff6ff", color: "#1e3799",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "12px", fontWeight: 800, flexShrink: 0,
      }}>
        {n}
      </span>
      <span style={{
        fontSize: "11px", fontWeight: 700, color: "#475569",
        textTransform: "uppercase", letterSpacing: ".07em",
      }}>
        {text}
      </span>
    </div>
  );
}

export default function SimulateurBTS() {
  const [btsActif, setBtsActif] = useState<BTS>(catalogueBTS[0]);
  const [modalite, setModalite] = useState<Modalite>("initial");
  const [notesParBTS, setNotesParBTS] = useState<Record<string, NoteEpreuve[]>>(
    () => Object.fromEntries(catalogueBTS.map((b) => [b.id, initNotes(b)]))
  );

  const notes = notesParBTS[btsActif.id] ?? initNotes(btsActif);

  function changerBTS(bts: BTS) { setBtsActif(bts); }

  function mettreAJourNote(epreuveId: string, note: number | null) {
    setNotesParBTS((prev) => ({
      ...prev,
      [btsActif.id]: (prev[btsActif.id] ?? initNotes(btsActif)).map((n) =>
        n.epreuveId === epreuveId ? { ...n, note } : n
      ),
    }));
  }

  function reinitialiserNotes() {
    setNotesParBTS((prev) => ({ ...prev, [btsActif.id]: initNotes(btsActif) }));
  }

  const resultat = useMemo(() => calculerResultat(btsActif, notes), [btsActif, notes]);

  const notesSaisies  = notes.filter((n) => n.note !== null).length;
  const totalEpreuves = btsActif.epreuves.length;
  const progression   = totalEpreuves > 0 ? Math.round((notesSaisies / totalEpreuves) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header style={{ background: "linear-gradient(135deg, #0c1f4d 0%, #1e3799 60%, #0c2461 100%)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {/* Barre top */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "8px",
                background: "rgba(255,255,255,.12)", display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span style={{ fontWeight: 700, color: "#fff", fontSize: "14px", letterSpacing: "-0.01em" }}>
                Simulateur BTS
              </span>
              <span style={{ color: "rgba(255,255,255,.3)", fontSize: "13px" }} className="hidden sm:inline">
                · Sully Marseille
              </span>
            </div>
            <a
              href="https://www.ltpsully.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "12px", color: "rgba(255,255,255,.4)" }}
              className="hover:text-white/70 transition-colors"
            >
              ltpsully.com ↗
            </a>
          </div>

          {/* Hero */}
          <div style={{ paddingBottom: "32px", paddingTop: "8px" }}>
            <div style={{
              fontSize: "10px", fontWeight: 700, color: "#93c5fd",
              textTransform: "uppercase", letterSpacing: ".12em", marginBottom: "6px",
            }}>
              Sully Business School
            </div>
            <h1 style={{
              margin: 0, fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 800,
              color: "#fff", lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: "8px",
            }}>
              Vais-je réussir mon BTS ?
            </h1>
            <p style={{ color: "#bfdbfe", fontSize: "14px", margin: 0 }}>
              Saisis tes notes et découvre instantanément ton résultat, ta mention, et ce qu'il te manque.
            </p>
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">

          {/* ── Colonne gauche : saisie ──────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-4">

            {/* Carte 1 — Choix du BTS */}
            <div style={{
              background: "#fff", borderRadius: "16px",
              border: "1px solid #e8eef5", boxShadow: "0 1px 6px rgba(0,0,0,.06)",
              padding: "20px",
            }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{
                    width: "22px", height: "22px", borderRadius: "50%",
                    background: "#eff6ff", color: "#1e3799",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", fontWeight: 800, flexShrink: 0,
                  }}>1</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".07em" }}>
                    Ta formation
                  </span>
                </div>
                <span style={{ fontSize: "12px", color: "#1e3799", fontWeight: 600 }}>
                  {catalogueBTS.length} BTS disponibles
                </span>
              </div>

              <BTSCombobox value={btsActif} onChange={changerBTS} />

              <p style={{ fontSize: "12px", color: "#64748b", margin: "10px 0 4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <svg style={{ width: "13px", height: "13px", color: "#1e3799", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                </svg>
                Clique sur la carte ci-dessus pour changer de BTS — tu peux aussi taper le nom ou le code pour filtrer.
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                <svg style={{ width: "13px", height: "13px", color: "#cbd5e1", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <a
                  href={btsActif.lienOfficiel}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "12px", color: "#1e3799", textDecoration: "none" }}
                  className="hover:underline"
                >
                  Arrêté officiel — règlement d'examen ↗
                </a>
              </div>
            </div>

            {/* Carte 2 — Notes */}
            <div style={{
              background: "#fff", borderRadius: "16px",
              border: "1px solid #e8eef5", boxShadow: "0 1px 6px rgba(0,0,0,.06)",
              padding: "20px",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0" }}>
                <StepLabel n={2} text="Mes notes" />
                {notesSaisies > 0 && (
                  <button
                    onClick={reinitialiserNotes}
                    style={{
                      fontSize: "12px", color: "#94a3b8", background: "none",
                      border: "none", cursor: "pointer", padding: 0,
                    }}
                    className="hover:text-slate-500 transition-colors"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>

              {/* ── Toggle modalité pédagogique ── */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: ".06em" }}>
                  Modalité pédagogique
                </div>
                <div style={{
                  display: "inline-flex", borderRadius: "10px",
                  border: "1px solid #e2e8f0", background: "#f8fafc",
                  padding: "3px", gap: "2px",
                }}>
                  {(["initial", "alternance"] as Modalite[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setModalite(m)}
                      style={{
                        padding: "6px 14px", borderRadius: "8px",
                        fontSize: "12px", fontWeight: 700,
                        border: "none", cursor: "pointer",
                        transition: "all .18s",
                        background: modalite === m ? "#1e3799" : "transparent",
                        color:      modalite === m ? "#fff"    : "#64748b",
                        boxShadow:  modalite === m ? "0 1px 4px rgba(30,55,153,.25)" : "none",
                      }}
                    >
                      {m === "initial" ? "Formation initiale" : "Alternance / Apprentissage"}
                    </button>
                  ))}
                </div>
                {modalite === "alternance" && (
                  <p style={{ fontSize: "11px", color: "#64748b", margin: "6px 0 0", lineHeight: 1.5 }}>
                    ⓘ En alternance, les épreuves CCF deviennent des épreuves ponctuelles terminales.
                  </p>
                )}
              </div>

              {/* Barre de progression */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>
                    {notesSaisies} / {totalEpreuves} épreuves renseignées
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#1e3799" }}>
                    {progression}%
                  </span>
                </div>
                <div style={{ height: "6px", borderRadius: "3px", background: "#e2e8f0", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: "3px",
                    background: "linear-gradient(90deg, #1e3799, #3b82f6)",
                    width: `${progression}%`,
                    transition: "width 0.5s cubic-bezier(.4,0,.2,1)",
                  }} />
                </div>
              </div>

              {/* Liste épreuves */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {btsActif.epreuves.map((epreuve) => {
                  const noteData = notes.find((n) => n.epreuveId === epreuve.id);
                  return (
                    <NoteInput
                      key={`${btsActif.id}-${epreuve.id}`}
                      epreuve={epreuve}
                      note={noteData?.note ?? null}
                      onChange={(note) => mettreAJourNote(epreuve.id, note)}
                      couleurBTS={btsActif.couleur}
                      modalite={modalite}
                    />
                  );
                })}
              </div>

              <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "14px", lineHeight: 1.5 }}>
                ⓘ Coefficients indicatifs — vérifiés avec les arrêtés officiels MENJ. Non officiel.
              </p>
            </div>

          </div>

          {/* ── Colonne droite : résultat sticky ──────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-6 space-y-3">
              <ResultatPanel
                resultat={resultat}
                bts={btsActif}
                notesSaisies={notesSaisies}
                totalEpreuves={totalEpreuves}
              />

              {/* CTA Sully */}
              {btsActif.disponibleSully && (
                <a
                  href="https://www.ltpsully.com/bts/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%", padding: "12px 16px",
                    borderRadius: "12px", border: "1px solid #e8eef5",
                    background: "#fff", textDecoration: "none",
                    boxShadow: "0 1px 4px rgba(0,0,0,.05)",
                    transition: "all .18s",
                  }}
                  className="hover:border-blue-200 hover:bg-blue-50 group"
                >
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#1e3799", margin: 0 }}>
                      BTS {btsActif.code} à Sully Marseille
                    </p>
                    <p style={{ fontSize: "11px", color: "#94a3b8", margin: "2px 0 0" }}>
                      Formation initiale &amp; alternance
                    </p>
                  </div>
                  <span style={{ color: "#1e3799", fontSize: "18px" }}>→</span>
                </a>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid #e2e8f0", background: "#fff", padding: "20px 0" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6" style={{ fontSize: "12px", color: "#94a3b8" }}>

          {/* Ligne principale */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2" style={{ marginBottom: "10px" }}>
            <span>
              <strong style={{ color: "#64748b" }}>Sully Business School</strong>
              {" · "}Simulateur BTS · {catalogueBTS.length} BTS disponibles · Données indicatives
            </span>
            <a
              href="https://www.ltpsully.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#94a3b8", textDecoration: "none" }}
              className="hover:text-slate-600 transition-colors"
            >
              © {new Date().getFullYear()} Sully Lycée &amp; Business School, Marseille
            </a>
          </div>

          {/* Ligne suggestion */}
          <div style={{ textAlign: "center", paddingTop: "10px", borderTop: "1px solid #f1f5f9" }}>
            <span>Une suggestion ou une correction ?&nbsp;</span>
            <a
              href="mailto:contact@esully.fr?subject=Simulateur BTS — suggestion"
              style={{ color: "#1e3799", textDecoration: "none", fontWeight: 600 }}
              className="hover:underline"
            >
              contact@esully.fr
            </a>
            <span style={{ margin: "0 8px", color: "#cbd5e1" }}>·</span>
            <a
              href="https://www.ltpsully.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1e3799", textDecoration: "none", fontWeight: 600 }}
              className="hover:underline"
            >
              ltpsully.com ↗
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}
