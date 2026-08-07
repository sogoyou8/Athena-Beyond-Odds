# Phase 3.1 — Sélection technologique frontend Athena

* **Date :** 2026-08-07
* **Responsable :** Fondateur ABYSS
* **Statut :** Approuvée par le Fondateur
* **Référence :** `5723698f82dcd9298a1f9e12ba00ddd208de7610`

---

## 1. Contexte et décision

À la suite du dossier d'arbitrage présenté au Fondateur ABYSS, la décision technologique officielle pour l'architecture frontend initiale de la plateforme Athena: Beyond Odds est arrêtée comme suit :

* **Choix approuvé :** `OPTION 1 — HTML SÉMANTIQUE + CSS NATIF + TYPESCRIPT CLIENT MINIMAL SERVI PAR EXPRESS`

Cette décision privilégie une approche minimaliste, robuste et directement proportionnée au périmètre réel du prototype Athena.

---

## 2. Architecture cible et principes

L'architecture du futur frontend reposera sur les piliers technologiques suivants :

| Composant | Technologie retenue | Justification |
|---|---|---|
| **Structure** | HTML5 sémantique | Accessibilité native WCAG 2.1 AA, temps de rendu instantané, zéro surcoût de framework |
| **Stylos** | CSS natif (Variables CSS / Flexbox / Grid) | Définition des tokens du Design System en variables CSS natifs sans préprocesseur |
| **Logique Client** | TypeScript strict minimal | Interactions et requêtes API typées sans duplication arbitraire de contrat |
| **Client HTTP** | API `fetch` native du navigateur | Consommation directe des endpoints `/health` et `/competitions/:code/matches` |
| **Hébergement** | Same-Origin avec l'application Express | Serveur Node.js/Express unique pour l'API et les ressources statiques |

---

## 3. Justifications du choix

Le choix de l'Option 1 s'appuie sur les critères de décision validés suivants :

1. **Périmètre réduit du prototype :** Une seule vue principale en lecture seule consommant deux endpoints (`GET /health` et `GET /competitions/:code/matches`).
2. **Absence de complexité d'état :** Aucune mutation, aucun formulaire complexe, aucun compte utilisateur, aucun paiement, aucun temps réel.
3. **Simplicité d'intégration (Same-Origin) :** Servir l'interface directement depuis l'application Express existante élimine les contraintes CORS, le besoin de proxy de développement et les déploiements d'infrastructures séparées.
4. **Accessibilité et performance maximales :** Temps de chargement quasi-instantané (0 KB de framework client), prise en charge native des lecteurs d'écran.
5. **Prévention de la surarchitecture :** Refus d'introduire des bundlers complexes, des single-page applications (SPA) lourdes ou des frameworks SSR (Next.js/Nuxt) non justifiés par le besoin.
6. **Budget et maintenance :** Budget 0 €, maintenance minimale sans risque de cassure de version majeure de framework.

---

## 4. Choix explicitement NON retenus pour la première implémentation

Les technologies et outils suivants sont **explicitement écartés** pour l'implémentation initiale du prototype :

```text
Aucun framework SPA (React, Vue, Angular, Svelte)
Aucun framework SSR / Meta-framework (Next.js, Nuxt, Remix)
Aucune bibliothèque de composants UI (Tailwind, Bootstrap, Material UI, Shadcn)
Aucun gestionnaire d'état global (Redux, Zustand, Pinia)
Aucun routeur client (React Router, Vue Router)
Aucun microfrontend ni architecture distribuée
Aucun moteur de templates serveur supplémentaire (EJS, Pug, Handlebars)
Aucun bundler frontend complexe additionnel
```

> **Note d'évolution :** Ces technologies ne sont pas proscrites de manière permanente. Elles pourront être réévaluées uniquement si l'évolution future du périmètre produit (ex: authentification, formulaires interactifs complexes, tableaux de bord interactifs) le justifie formellement.

---

## 5. Compatibilité avec le périmètre réel

Le frontend minimal retenu s'interface exclusivement avec le domaine et les endpoints stabilisés en Phase 2 :

- `GET /health` — Vérification discrète de l'état du service.
- `GET /competitions/:code/matches` — Consultation en lecture seule des matchs au statut `SCHEDULED` (Ligue 1 `FL1` uniquement).

Sont maintenus hors du périmètre technique frontend :

- Aucun détail de match (`getMatchDetails()` non implémentée).
- Aucun compte utilisateur ni authentification (OQ-005 ouverte).
- Aucune offre commerciale ni paiement (OQ-001 / OQ-002 ouvertes).
- Aucune prédiction, cote sportive ou fonction de pari.

---

## 6. Prochaines étapes documentaires

La présente sélection technologique constitue un cadre d'orientation. Avant toute écriture de code frontend, la prochaine étape devra faire l'objet d'un **cadrage d'implémentation frontend** définissant :

- La structure exacte des fichiers statiques dans le projet.
- La stratégie de compilation TypeScript client et d'intégration avec l'application Express existante.
- Le harnais de test d'interface.
- Les critères d'acceptation de l'implémentation.

---

```text
TECHNOLOGIE FRONTEND PHASE 3.1 APPROUVÉE — HTML, CSS ET TYPESCRIPT MINIMAL PRIVILÉGIÉS, IMPLÉMENTATION ENCORE NON AUTORISÉE
```

---

> Made in Abyss : Spark by the King
