"use client";

export default function IntroSection() {
  return (
    <section style={{
      background: "#fff",
      borderRadius: "16px",
      border: "1px solid #e8eef5",
      boxShadow: "0 1px 6px rgba(0,0,0,.06)",
      padding: "28px 28px 24px",
      marginBottom: "24px",
    }}>
      {/* Label */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        background: "#eff6ff", border: "1px solid #bfdbfe",
        borderRadius: "20px", padding: "4px 12px",
        fontSize: "11px", fontWeight: 700, color: "#1e3799",
        textTransform: "uppercase", letterSpacing: ".08em",
        marginBottom: "14px",
      }}>
        <svg style={{ width: "12px", height: "12px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        Outil officiel Sully
      </div>

      <h2 style={{
        fontSize: "clamp(18px, 3vw, 22px)", fontWeight: 800,
        color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.25,
        margin: "0 0 14px",
      }}>
        Anticipez votre réussite&nbsp;: Le Simulateur de Notes BTS de&nbsp;
        <span style={{ color: "#1e3799" }}>Sully Enseignement Supérieur</span>
        {" "}et{" "}
        <span style={{ color: "#1e3799" }}>Sully Business School</span>
      </h2>

      <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.7, margin: "0 0 12px" }}>
        Bienvenue sur notre <strong style={{ color: "#1e293b" }}>simulateur de réussite au BTS</strong>, un outil exclusif conçu par{" "}
        <strong style={{ color: "#1e293b" }}>Sully Enseignement Supérieur et Sully Business School à Marseille</strong>{" "}
        pour vous accompagner vers l'obtention de votre diplôme.
      </p>

      <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.7, margin: "0 0 14px" }}>
        Parce que l'innovation pédagogique est au cœur de la mission de notre campus marseillais,
        nous mettons à votre disposition cet outil interactif simple et rapide.
        Que vous suiviez votre cursus en <strong style={{ color: "#1e293b" }}>formation initiale</strong> (avec validation en CCF)
        ou en <strong style={{ color: "#1e293b" }}>alternance</strong> (avec épreuves ponctuelles),
        ce simulateur vous permet de{" "}
        <strong style={{ color: "#1e293b" }}>piloter vos révisions de manière stratégique</strong>.
        En saisissant vos estimations de notes, vous pourrez en un clic&nbsp;:
      </p>

      {/* Points forts */}
      <ul style={{ margin: "0 0 18px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
        {[
          "Calculer instantanément votre moyenne générale globale pondérée par les coefficients.",
          "Vérifier votre éligibilité au diplôme selon les exigences réglementaires.",
          "Visualiser la mention (Assez Bien, Bien, Très Bien) à votre portée.",
        ].map((item) => (
          <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <span style={{
              flexShrink: 0, marginTop: "3px",
              width: "18px", height: "18px", borderRadius: "50%",
              background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg style={{ width: "10px", height: "10px", color: "#1e3799" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6 }}>{item}</span>
          </li>
        ))}
      </ul>

      {/* CTA texte */}
      <div style={{
        background: "linear-gradient(135deg, #eff6ff, #f0f9ff)",
        border: "1px solid #bfdbfe",
        borderRadius: "10px",
        padding: "12px 16px",
        fontSize: "14px", color: "#1e3799", fontWeight: 600,
      }}>
        🎯 <strong>À vous de jouer&nbsp;:</strong>{" "}
        <span style={{ fontWeight: 400, color: "#334155" }}>
          Entrez vos projections, ajustez vos objectifs et donnez-vous les moyens de vos ambitions&nbsp;!
        </span>
      </div>
    </section>
  );
}
