# Phase 3.1 — Fondations UX/UI et Design System Athena

* **Date :** 2026-08-06
* **Responsable :** Fondateur ABYSS
* **Statut :** Approuvé par le Fondateur
* **Commit d'approbation :** `d39757f5bb6aeb74d8dea58fd7633a5c5e49544e`
* **Référence technique :** `3ce6e204fc6acffb1ffde03cda78bcf8875e02fa`
* **Phase précédente :** Phase 2 — Clôturée

---

## 1. Métadonnées de Cadrage

| Champ | Valeur |
|---|---|
| Projet | Athena Beyond Odds |
| Phase de cadrage | Phase 3.1 — Fondations UX/UI et Design System |
| Date de proposition | 2026-08-06 |
| Responsable | Fondateur ABYSS |
| Référence d'ancrage technique | Commit `3ce6e204fc6acffb1ffde03cda78bcf8875e02fa` (HEAD Phase 2) |
| Phase précédente | Phase 2 (Architecture technique) — Officiellement clôturée |
| Statut | Documentaire — Aucune implémentation frontend autorisée |

---

## 2. Objet de la Phase 3.1

La Phase 3.1 a pour objet d'établir les fondations documentaires UX/UI de la plateforme Athena: Beyond Odds, en assurant une continuité stricte avec la vision produit (Phase 1) et l'architecture technique stabilisée (Phase 2).

Ce cadrage prépare les travaux futurs en définissant :
- L'inventaire consolidé des spécifications produit et design existantes.
- L'analyse documentaire des questions ouvertes utilisateur `OQ-001` à `OQ-006`.
- Les principes d'architecture de l'information et de navigation.
- Les états de l'interface utilisateur alignés sur les réponses de l'API Athena.
- Les fondations du Design System et les exigences minimales d'ergonomie, de responsive design et d'accessibilité.

---

## 3. Sources Obligatoires de la Documentation Existante

Le travail de conception de la Phase 3.1 s'appuie sur la cartographie documentaire validée suivante :

1. **[docs/01-product/user-problem.md](../01-product/user-problem.md) & [docs/01-product/product-vision.md](../01-product/product-vision.md) :** Vision du produit, réduction de la surcharge d'information et besoin d'explicabilité.
2. **[docs/02-product-management/product-requirements-document.md](../02-product-management/product-requirements-document.md) :** PRD initial définissant les fonctionnalités clés (`FEAT-001` à `FEAT-020`) et la transition vers la Phase 3 (§2.3).
3. **[docs/02-product-management/phase-1-validation-report.md](../02-product-management/phase-1-validation-report.md) :** Rapport de validation du PRD et gouvernance des questions ouvertes `OQ-001` à `OQ-006`.
4. **[docs/02-product-management/user-stories.md](../02-product-management/user-stories.md) & [user-personas.md](../02-product-management/user-personas.md) :** Stories et personas cibles (`PER-001` à `PER-005`).
5. **[docs/08-product-blueprint/00-readme.md](../08-product-blueprint/00-readme.md) :** Blueprint produit, cartes de domaine (`05-domain-map.md`), architecture de l'information (`06-information-architecture.md`) et navigation (`07-navigation.md`).
6. **[docs/03-technical-architecture/technical-architecture-overview.md](../03-technical-architecture/technical-architecture-overview.md) :** Architecture hexagonale et contrats d'API.
7. **[docs/06-operations/open-questions.md](../06-operations/open-questions.md) :** Registre officiel des questions ouvertes.
8. **[docs/06-operations/decision-log.md](../06-operations/decision-log.md) :** Registre des décisions `DEC-001` à `DEC-011`.

---

## 4. Analyse des Questions Ouvertes OQ-001 à OQ-006

Afin de préparer le design sans inventer de règles arbitraires, les questions ouvertes sont répertoriées selon leur formulation officielle exacte :

### OQ-001 — Quotas du compte Free
- **Formulation officielle :** *"Quels sont les quotas numériques exacts appliqués aux utilisateurs du plan Free ?"* (`docs/06-operations/open-questions.md`)
- **Impact UX/UI :** Détermine l'affichage du compteur d'usage et les déclencheurs visuels de conversion Premium (`FEAT-016`, `US-016`).
- **Options documentées :** Limite quotidienne (ex : 5 consultations/jour) ou mensuelle.
- **Statut :** **Ouverte** (En attente d'arbitrage du Fondateur avant maquettage final).

### OQ-002 — Structure tarifaire Premium
- **Formulation officielle :** *"Quelle est la structure tarifaire exacte du plan Premium ?"* (`docs/06-operations/open-questions.md`)
- **Impact UX/UI :** Conditionne le contenu informatif des pages de pricing et du tunnel d'abonnement (`pricing.md`).
- **Options documentées :** Mensuel sans engagement vs Annuel avec réduction.
- **Statut :** **Ouverte** (En attente d'arbitrage du Fondateur).

### OQ-003 — Fournisseurs de données sportives
- **Formulation officielle :** *"Quels fournisseurs de données sportives sont utilisés aux différentes phases du produit ?"* (`docs/06-operations/open-questions.md`)
- **Impact UX/UI :** Mentions de la source de données et crédits fournisseurs dans le pied de page (`FEAT-019`).
- **Statut :** **Partiellement résolue par DEC-002 / DEC-006** (`football-data.org` retenu pour le prototype ; extensibilité multi-sources cadrée).

### OQ-004 — Langue(s) initiale(s) du produit
- **Formulation officielle :** *"Quelles sont les langues initiales supportées à la livraison du MVP ?"* (`docs/06-operations/open-questions.md`)
- **Impact UX/UI :** Sélecteur de langue, stratégie d'i18n et mise en page des textes UI.
- **Option documentée :** Français (FR) comme langue initiale avec architecture i18n sans texte dur.
- **Statut :** **Ouverte** (Version FR monolingue admise pour le design initial).

### OQ-005 — MFA obligatoire pour les utilisateurs finaux
- **Formulation officielle :** *"Le MFA est-il obligatoire pour tous les utilisateurs finaux dès le MVP ?"* (`docs/06-operations/open-questions.md`)
- **Impact UX/UI :** Complexité du parcours de connexion et d'onboarding (`FEAT-002`).
- **Statut :** **Ouverte** (Sécurité par mot de passe simple jugée suffisante pour le prototype).

### OQ-006 — Périmètre des compétitions couvertes au MVP
- **Formulation officielle :** *"Quel est le périmètre exact des compétitions sportives couvertes au lancement ?"* (`docs/06-operations/open-questions.md`)
- **Impact UX/UI :** Nombre d'options dans le menu de sélection de compétition.
- **Statut :** **Résolue par DEC-001 / DEC-005** (Ligue 1 `FL1` active pour le prototype, extension vers Premier League et Champions League cadrée).

---

## 5. Architecture de l'Information et Vues à Étudier

Le travail UX/UI examinera l'organisation de l'information pour les fonctionnalités autorisées de l'API Athena :

1. **Vue Synthèse / Accueil :** État général du service, recherche de matchs, accès rapide à la compétition active.
2. **Vue Compétition (`FL1`) :** En-tête de la compétition, sélection de la journée, filtre de calendrier.
3. **Vue Liste de Matchs (`GET /competitions/:code/matches`) :** Carte de match normalisée (Équipes, Heure UTC, Journée, Statut `SCHEDULED`).
4. **Composants d'États d'Interface :**
   - État de chargement (Squelettes de cartes).
   - État vide (Aucun match programmé sur la période).
   - État d'erreur / Feedback.

---

## 6. Fondations du Design System à Cadrer

La Phase 3.1 posera les principes documentaires du Design System Athena sans imposer de choix technique prématuré :

- **Principes Ergonomiques :** Clarté, lisibilité maximale, zéro surcharge visuelle, explicabilité des données.
- **Tokens de Design (Conceptuels) :** Échelle typographique, grille d'espacement (base 8px), rayons de bordure, élévations.
- **Palette de Couleurs (Principes sémantiques) :** Neutres de fond, couleur d'accent Athena, couleurs d'état (Succès, Avertissement, Erreur, Information).
- **Accessibilité (WCAG 2.1 AA) :** Contrastes de texte conformes, navigation au clavier, étiquettes ARIA explicites.
- **Responsive Design :** Approche Mobile-First, points de rupture standards (Mobile < 768px, Tablette 768px-1024px, Desktop > 1024px).

---

## 7. Représentation des États API HTTP

L'interface utilisateur devra refléter fidèlement l'ensemble des réponses HTTP de l'API Athena (Phase 2) :

| Code HTTP / Erreur API | État d'Interface Utilisateur Associé |
|---|---|
| **HTTP 200 (Données non vides)** | Liste de cartes de matchs `SCHEDULED` correctement mises en page. |
| **HTTP 200 (`matches: []`)** | Composant "Aucun match programmé sur la période courante". |
| **HTTP 404 (`COMPETITION_NOT_AVAILABLE`)** | Message d'information "Compétition non disponible au prototype (Seule la Ligue 1 FL1 est disponible)". |
| **HTTP 429 (`PROVIDER_RATE_LIMIT`)** | Bandeau d'avertissement temporaire "Limite de requêtes atteinte. Réessayez dans un instant." |
| **HTTP 503 (`PROVIDER_UNAVAILABLE`)** | Composant d'erreur "Service temporairement indisponible. Veuillez recharger plus tard." |

---

## 8. Livrables Proposés pour la Phase 3.1

Après validation officielle de ce cadrage, la Phase 3.1 pourra produire les documents suivants :

1. **Pack documentaire Design System Athena** (`docs/05-design/design-system-specifications.md`).
2. **Spécifications d'Architecture de l'Information et Navigation** (`docs/05-design/information-architecture.md`).
3. **Catalogue des Wireframes et États d'Interface** (`docs/05-design/wireframes-catalog.md`).

---

## 9. Périmètre Strictement Exclu

Sont explicitement hors du périmètre de la Phase 3.1 :

```text
Code frontend (HTML, CSS, JavaScript, TypeScript, React, Vue, Svelte, etc.)
Bibliothèques de composants (Tailwind, Bootstrap, Material UI, Shadcn, etc.)
Maquettes graphiques ou prototypes exécutables
Modification du code backend Express ou du domaine Athena
Création de nouveaux endpoints HTTP ou nouvelles APIs
Authentification des utilisateurs, comptes, mots de passe, MFA
Paiements, abonnements Stripe, tunnels d'achat
Prédictions, algorithmes probabilistes, cotes sportives, pari
Déploiement public, hébergement cloud, SaaS, analytics
```

---

## 10. Garde de Décision

- Aucune maquette visuelle détaillée ni composant frontend ne sera produit avant l'approbation et la fusion du présent cadrage documentaire.
- Aucune question ouverte (`OQ-001` à `OQ-006`) ne sera considérée comme résolue sans une décision explicite du Fondateur consignée dans le Decision Log.
- Aucun choix de framework ou outil frontend ne sera effectué durant la Phase 3.1.

---

## 11. Verdict Canonique

```text
CADRAGE PHASE 3.1 APPROUVÉ — PRODUCTION DOCUMENTAIRE DÉTAILLÉE AUTORISÉE, IMPLÉMENTATION FRONTEND INTERDITE
```

---

> Made in Abyss : Spark by the King
