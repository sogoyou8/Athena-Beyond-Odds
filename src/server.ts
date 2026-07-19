/**
 * Point d'entrée du serveur HTTP — Athena Beyond Odds.
 *
 * Démarre le serveur Express sur le port configuré.
 * Séparé de app.ts pour permettre le test de l'application sans écoute réseau.
 *
 * PHASE 2.6 — Squelette technique minimal.
 */

import { createApp } from './app.js';

const PORT = Number(process.env['PORT'] ?? 3000);

const app = createApp();

app.listen(PORT, () => {
  console.log(`[Athena] Serveur démarré sur http://localhost:${PORT}`);
  console.log(`[Athena] Phase 2.6 — Squelette technique initial`);
});
