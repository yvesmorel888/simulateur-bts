import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",          // génère un dossier /out statique
  basePath: "/simulateur-bts", // chemin GitHub Pages
  images: { unoptimized: true }, // pas d'API d'images dans le mode export
};

export default nextConfig;
