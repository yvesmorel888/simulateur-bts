import SimulateurBTS from "@/components/SimulateurBTS";

export const metadata = {
  title: "Simulateur BTS — Vais-je réussir mon BTS ? | Sully",
  description:
    "Calcule ta moyenne BTS en temps réel. Saisis tes notes, découvre si tu es admis, ta mention et ce qu'il te manque pour passer. Outil gratuit par Sully Marseille.",
};

export default function Home() {
  return <SimulateurBTS />;
}
