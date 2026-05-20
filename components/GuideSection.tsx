"use client";

const SECTIONS = [
  {
    titre: "1. Épreuves générales vs Épreuves techniques : Une distinction majeure",
    contenu: (
      <div>
        <p style={p}>L'examen du BTS repose sur un équilibre rigoureux entre deux grands blocs d'enseignements&nbsp;:</p>
        <ul style={ul}>
          <li style={li}><strong style={strong}>Les épreuves générales :</strong>{" "}Elles évaluent vos compétences académiques, de communication et de réflexion (Culture Générale, Langues Vivantes, Économie-Droit-Management).</li>
          <li style={li}><strong style={strong}>Les épreuves techniques et professionnelles :</strong>{" "}Elles constituent le cœur même de votre spécialité (ateliers, projets, dossiers professionnels). Ce sont elles qui font de vous un expert immédiatement opérationnel.</li>
        </ul>
      </div>
    ),
  },
  {
    titre: "2. La règle de la moyenne et le seuil éliminatoire du bloc technique",
    contenu: (
      <div>
        <p style={p}>Si le calcul global du diplôme fonctionne par un système de compensation des notes, cette règle possède une limite stricte à Marseille comme ailleurs&nbsp;:</p>
        <ul style={ul}>
          <li style={li}>
            <strong style={strong}>La moyenne générale :</strong>{" "}
            Pour obtenir votre BTS, vous devez atteindre une{" "}
            <strong style={strong}>moyenne générale globale égale ou supérieure à 10/20</strong>{" "}
            sur l'ensemble de vos épreuves.
          </li>
          <li style={li}>
            <strong style={strong}>Le caractère éliminatoire du bloc technique :</strong>{" "}
            Le BTS valide votre aptitude à exercer un métier. Par conséquent,{" "}
            <strong style={strong}>les notes en dessous de la moyenne sur l'ensemble du bloc des épreuves techniques et professionnelles sont éliminatoires</strong>.
            Vous devez obligatoirement obtenir une moyenne minimale de{" "}
            <strong style={strong}>10/20 sur ce pôle technique</strong>.
            Si cette moyenne spécifique est inférieure à 10, le diplôme ne peut pas être délivré
            (même si d'excellentes notes en matières générales permettent d'atteindre 10/20 au global).
          </li>
        </ul>
      </div>
    ),
  },
  {
    titre: "3. Initiale vs Alternance : Deux rythmes et deux modes d'évaluation différents",
    contenu: (
      <div>
        <p style={p}>Le référentiel de l'examen national reste le même, mais la manière dont vous êtes évalué change radicalement selon votre statut&nbsp;:</p>
        <ul style={ul}>
          <li style={li}>
            <strong style={strong}>La modalité "Initiale" (Sully Enseignement Supérieur) :</strong>{" "}
            Les étudiants passent une grande partie de leurs examens sous forme de{" "}
            <strong style={strong}>CCF (Contrôle en Cours de Formation)</strong>.
            Ces évaluations régulières se déroulent tout au long de la deuxième année.
            Elles permettent de lisser le stress et de valider des blocs de compétences au fil de l'eau.
          </li>
          <li style={li}>
            <strong style={strong}>La modalité "Alternance" (Sully Business School) :</strong>{" "}
            Les apprentis partagent leur temps entre l'entreprise et le campus.
            En matière d'examen,{" "}
            <strong style={strong}>il n'y a pas de CCF : l'évaluation se fait exclusivement sous forme d'épreuves ponctuelles</strong>.
            Tout se joue lors des examens terminaux (écrits et oraux) aux mois de mai et juin.
            Le simulateur devient alors un outil indispensable pour se fixer des objectifs de notes précis avant le jour J.
          </li>
        </ul>
      </div>
    ),
  },
  {
    titre: "4. Viser plus haut : Le barème des mentions",
    contenu: (
      <div>
        <p style={p}>
          Ne vous contentez pas de viser le 10/20&nbsp;! Une mention sur un diplôme de BTS est un excellent atout
          sur un CV pour valoriser votre profil auprès des recruteurs ou pour intégrer des filières sélectives
          post-BTS (Licences Professionnelles, Bachelors, Grandes Écoles de Commerce).
        </p>
        <p style={{ ...p, marginBottom: "10px" }}>Le simulateur vous indique le palier atteint selon les règles académiques&nbsp;:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { mention: "Assez Bien ⭐", seuil: "12/20", color: "#1e40af", bg: "#eff6ff", border: "#93c5fd" },
            { mention: "Bien 🌟",       seuil: "14/20", color: "#166534", bg: "#f0fdf4", border: "#6ee7b7" },
            { mention: "Très Bien 🏆",  seuil: "16/20", color: "#854d0e", bg: "#fefce8", border: "#fcd34d" },
          ].map(({ mention, seuil, color, bg, border }) => (
            <div key={mention} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 14px", borderRadius: "8px",
              background: bg, border: `1px solid ${border}`,
            }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color }}>{mention}</span>
              <span style={{ fontSize: "13px", color, fontWeight: 600 }}>≥ {seuil}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    titre: "5. L'oral de contrôle : Le filet de sécurité du rattrapage",
    contenu: (
      <div>
        <p style={p}>
          Le BTS intègre des épreuves de rattrapage, appelées{" "}
          <strong style={strong}>&quot;oral de contrôle&quot;</strong>.
          Vous êtes autorisé à vous y présenter si et seulement si vous remplissez ces deux critères cumulatifs&nbsp;:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <span style={numBadge}>1</span>
            <p style={{ ...p, margin: 0 }}>
              Votre moyenne générale globale se situe{" "}
              <strong style={strong}>entre 8/20 et 9,9/20</strong>.
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <span style={numBadge}>2</span>
            <p style={{ ...p, margin: 0 }}>
              <strong style={strong}>ET</strong> votre moyenne spécifique au bloc des épreuves professionnelles
              et techniques est{" "}
              <strong style={strong}>égale ou supérieure à 10/20</strong>{" "}
              (pas de rattrapage possible si le bloc technique est manqué).
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    titre: "💡 Comment utiliser ce simulateur à bon escient ?",
    contenu: (
      <div>
        <p style={p}>
          Utilisez cet outil comme un véritable{" "}
          <strong style={strong}>tableau de bord de votre réussite</strong>{" "}
          à différents moments de votre parcours&nbsp;:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            {
              label: "En formation initiale",
              icon: "🏫",
              text: "Intégrez vos notes de CCF déjà obtenues au cours de l'année pour évaluer sereinement ce qu'il vous reste à assurer lors des épreuves écrites finales.",
            },
            {
              label: "En alternance",
              icon: "🏢",
              text: "Simulez différents scénarios réalistes pour mesurer le poids de chaque épreuve ponctuelle. Cela vous permettra de cibler vos révisions sur les matières à fort coefficient et de sécuriser votre bloc technique pour écarter tout risque éliminatoire.",
            },
            {
              label: "Au rattrapage (oral de contrôle)",
              icon: "🎯",
              text: "Pas de panique, rien n'est perdu ! Saisissez vos notes réelles obtenues aux examens pour identifier exactement le nombre de points manquants. Testez différentes hypothèses de notes sur les matières que vous envisagez de repasser à l'oral. Vous saurez instantanément quelle note viser pour franchir la barre des 10/20.",
            },
          ].map(({ label, icon, text }) => (
            <div key={label} style={{
              display: "flex", gap: "12px", alignItems: "flex-start",
              padding: "12px 14px", borderRadius: "10px",
              background: "#f8fafc", border: "1px solid #e2e8f0",
            }}>
              <span style={{ fontSize: "22px", lineHeight: 1, flexShrink: 0, marginTop: "1px" }}>{icon}</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", marginBottom: "3px" }}>{label}</div>
                <div style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6 }}>{text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

// Styles partagés
const p:    React.CSSProperties = { fontSize: "14px", color: "#475569", lineHeight: 1.7, margin: "0 0 10px" };
const ul:   React.CSSProperties = { margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" };
const li:   React.CSSProperties = { fontSize: "14px", color: "#475569", lineHeight: 1.7, paddingLeft: "16px", borderLeft: "2px solid #e2e8f0" };
const strong: React.CSSProperties = { color: "#1e293b", fontWeight: 700 };
const numBadge: React.CSSProperties = {
  flexShrink: 0, width: "24px", height: "24px", borderRadius: "50%",
  background: "#eff6ff", color: "#1e3799", fontSize: "12px", fontWeight: 800,
  display: "flex", alignItems: "center", justifyContent: "center",
  marginTop: "1px",
};

export default function GuideSection() {
  return (
    <section style={{ marginTop: "40px" }}>

      {/* En-tête de section */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: "6px" }}>
          Ressource pédagogique
        </div>
        <h2 style={{
          fontSize: "clamp(18px, 3vw, 22px)", fontWeight: 800,
          color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.2,
          margin: "0 0 8px",
        }}>
          Réussir son BTS&nbsp;: Comprendre les principes généraux de l'examen
        </h2>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0, lineHeight: 1.6 }}>
          Aborder les examens du Brevet de Technicien Supérieur avec sérénité demande de bien en comprendre
          les règles du jeu. Voici le récapitulatif des grands principes, préparé par les équipes pédagogiques
          de <strong style={{ color: "#475569" }}>Sully Enseignement Supérieur et Sully Business School à Marseille</strong>.
        </p>
      </div>

      {/* Accordéons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {SECTIONS.map(({ titre, contenu }) => (
          <details key={titre} style={{
            background: "#fff",
            borderRadius: "12px",
            border: "1px solid #e8eef5",
            boxShadow: "0 1px 4px rgba(0,0,0,.05)",
            overflow: "hidden",
          }}>
            <summary style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 18px",
              fontSize: "14px", fontWeight: 700, color: "#1e293b",
              cursor: "pointer",
              listStyle: "none",
              userSelect: "none",
              gap: "12px",
            }}>
              <span>{titre}</span>
              {/* Chevron animé via CSS open selector */}
              <span style={{
                flexShrink: 0, width: "20px", height: "20px",
                borderRadius: "50%", background: "#f1f5f9",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg style={{ width: "12px", height: "12px", color: "#64748b" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div style={{
              padding: "0 18px 18px",
              borderTop: "1px solid #f1f5f9",
              paddingTop: "14px",
            }}>
              {contenu}
            </div>
          </details>
        ))}
      </div>

      {/* Citation équipe pédagogique */}
      <div style={{
        marginTop: "20px",
        padding: "20px 24px",
        borderRadius: "14px",
        background: "linear-gradient(135deg, #0c1f4d 0%, #1e3799 60%, #0c2461 100%)",
        boxShadow: "0 4px 14px rgba(30,55,153,.2)",
      }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "#93c5fd", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: "10px" }}>
          Le mot de l'équipe pédagogique
        </div>
        <blockquote style={{ margin: 0, fontSize: "14px", color: "#e2e8f0", lineHeight: 1.75, fontStyle: "italic" }}>
          &quot;Le BTS est un parcours exigeant, mais la clé du succès réside dans la régularité du travail et
          la stratégie. Ce simulateur est là pour transformer le stress des examens en un plan d'action clair,
          mesurable et motivant. Toute l'équipe de notre campus de Marseille croit fermement en vos capacités
          et reste à vos côtés à chaque étape. Donnez le meilleur de vous-mêmes, croyez en votre potentiel,
          et nous vous souhaitons la plus belle des réussites&nbsp;!&quot;
        </blockquote>
        <div style={{ marginTop: "12px", fontSize: "12px", color: "#93c5fd", fontWeight: 600 }}>
          — Sully Enseignement Supérieur &amp; Sully Business School, Marseille
        </div>
      </div>

    </section>
  );
}
