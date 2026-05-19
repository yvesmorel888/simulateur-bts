"use client";

import { useState, useRef, useEffect } from "react";
import { BTS, catalogueBTS, getTotalCoefficients } from "@/data/bts";

interface Props {
  value: BTS;
  onChange: (bts: BTS) => void;
}

export default function BTSCombobox({ value, onChange }: Props) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");
  const inputRef          = useRef<HTMLInputElement>(null);
  const containerRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const q = query.toLowerCase().trim();

  const filtered = q
    ? catalogueBTS.filter(
        (b) =>
          b.code.toLowerCase().includes(q) ||
          b.libelle.toLowerCase().includes(q) ||
          b.secteur.toLowerCase().includes(q)
      )
    : catalogueBTS;

  const grouped: Record<string, BTS[]> = {};
  filtered.forEach((bts) => {
    if (!grouped[bts.secteur]) grouped[bts.secteur] = [];
    grouped[bts.secteur].push(bts);
  });

  function select(bts: BTS) {
    onChange(bts);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>

      {/* ── Carte de sélection ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%", textAlign: "left", cursor: "pointer",
          padding: "14px 16px",
          borderRadius: "12px",
          border: open ? "2px solid #1e3799" : "2px solid #e2e8f0",
          background: open ? "#f8faff" : "#fff",
          boxShadow: open
            ? "0 0 0 4px rgba(30,55,153,.08)"
            : "0 1px 4px rgba(0,0,0,.06)",
          transition: "all .18s",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>

          {/* Infos BTS */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", minWidth: 0, flex: 1 }}>
            {/* Pastille couleur */}
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: `${value.couleur}20`,
              border: `2px solid ${value.couleur}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, marginTop: "1px",
            }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: value.couleur }} />
            </div>

            <div style={{ minWidth: 0 }}>
              {/* Code + libelle */}
              <div style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                BTS {value.code}
              </div>
              <div style={{ fontSize: "13px", color: "#475569", marginTop: "2px", lineHeight: 1.4 }}>
                {value.libelle}
              </div>
              {/* Méta */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px", flexWrap: "wrap" }}>
                <span style={{
                  fontSize: "11px", fontWeight: 600, color: value.couleur,
                  background: `${value.couleur}15`, padding: "2px 8px", borderRadius: "20px",
                }}>
                  {value.secteur}
                </span>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                  {value.epreuves.length} épreuves · coeff {getTotalCoefficients(value)}
                </span>
              </div>
            </div>
          </div>

          {/* CTA Changer */}
          <div style={{
            flexShrink: 0, display: "flex", flexDirection: "column",
            alignItems: "flex-end", gap: "4px",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              padding: "6px 12px", borderRadius: "8px",
              background: open ? "#1e3799" : "#eff6ff",
              color: open ? "#fff" : "#1e3799",
              fontSize: "12px", fontWeight: 700,
              transition: "all .18s",
            }}>
              <svg style={{ width: "12px", height: "12px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
              Changer de BTS
            </div>
            <span style={{ fontSize: "10px", color: "#94a3b8" }}>
              {catalogueBTS.length} formations dispo
            </span>
          </div>

        </div>
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div style={{
          position: "absolute", zIndex: 50, top: "calc(100% + 6px)",
          left: 0, right: 0,
          borderRadius: "12px",
          border: "1.5px solid #e2e8f0",
          background: "#fff",
          boxShadow: "0 8px 30px rgba(0,0,0,.12)",
          overflow: "hidden",
        }}>
          {/* Recherche */}
          <div style={{ padding: "8px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "8px 12px", background: "#f8fafc",
              borderRadius: "8px", border: "1px solid #e2e8f0",
            }}>
              <svg style={{ width: "14px", height: "14px", color: "#94a3b8", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Rechercher par nom, code ou secteur…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") { setOpen(false); setQuery(""); }
                  if (e.key === "Enter" && filtered.length === 1) select(filtered[0]);
                }}
                style={{
                  flex: 1, background: "transparent",
                  border: "none", outline: "none",
                  fontSize: "13px", color: "#1e293b",
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}
                >
                  <svg style={{ width: "14px", height: "14px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Liste */}
          <div style={{ maxHeight: "320px", overflowY: "auto" }}>
            {Object.keys(grouped).length === 0 ? (
              <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "14px", padding: "24px" }}>
                Aucun BTS trouvé
              </p>
            ) : (
              Object.entries(grouped).map(([secteur, liste]) => (
                <div key={secteur}>
                  <p style={{
                    padding: "10px 16px 4px",
                    fontSize: "10px", fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: ".1em",
                    color: "#94a3b8", margin: 0,
                  }}>
                    {secteur}
                  </p>
                  {liste.map((bts) => {
                    const isActive = bts.id === value.id;
                    return (
                      <button
                        key={bts.id}
                        onClick={() => select(bts)}
                        style={{
                          width: "100%", display: "flex", alignItems: "center", gap: "10px",
                          padding: "9px 16px", textAlign: "left", cursor: "pointer",
                          background: isActive ? "#eff6ff" : "transparent",
                          border: "none", fontFamily: "'Inter', system-ui, sans-serif",
                          transition: "background .1s",
                        }}
                        onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#f8fafc"; }}
                        onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        <span style={{
                          width: "8px", height: "8px", borderRadius: "50%",
                          background: bts.couleur, flexShrink: 0,
                          opacity: isActive ? 1 : 0.6,
                        }} />
                        <span style={{ fontSize: "13px", fontWeight: isActive ? 700 : 500, color: isActive ? "#1e3799" : "#334155" }}>
                          BTS {bts.code}
                        </span>
                        <span style={{ fontSize: "12px", color: "#94a3b8", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {bts.libelle}
                        </span>
                        {bts.disponibleSully && (
                          <span style={{
                            fontSize: "10px", color: "#1e3799", flexShrink: 0,
                            border: "1px solid #bfdbfe", padding: "1px 6px", borderRadius: "4px",
                            background: "#eff6ff",
                          }}>
                            Sully
                          </span>
                        )}
                        {isActive && (
                          <svg style={{ width: "14px", height: "14px", color: "#1e3799", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div style={{
            borderTop: "1px solid #f1f5f9", padding: "8px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>{filtered.length} BTS disponibles</span>
            {filtered.length < catalogueBTS.length && (
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>{catalogueBTS.length - filtered.length} masqués</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
