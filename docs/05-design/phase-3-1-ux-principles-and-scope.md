# Phase 3.1 — Principes UX et périmètre de l'expérience Athena

* **Date :** 2026-08-06
* **Responsable :** Fondateur ABYSS
* **Statut :** Spécification proposée pour validation
* **Référence :** `d39757f5bb6aeb74d8dea58fd7633a5c5e49544e`

---

## 1. Objectif utilisateur

L'expérience Athena Beyond Odds au stade du prototype (Phase 3) a un objectif unique et délimité : permettre à l'utilisateur de **consulter les matchs programmés de la Ligue 1 (FL1)** et de **comprendre immédiatement l'état du service**.

Les attentes concrètes de l'utilisateur dans ce périmètre sont :

- Voir la liste des matchs `SCHEDULED` disponibles pour la compétition `FL1`.
- Comprendre sans effort si des matchs sont disponibles, si aucun n'est programmé, ou si le service est temporairement indisponible.
- Interpréter correctement les états vide et erreur sans ambiguïté ni frustration.
- Ne jamais être induit en erreur sur des fonctionnalités qui n'existent pas encore.

Ces objectifs découlent directement de la vision produit documentée dans `docs/01-product/user-problem.md` et `docs/01-product/product-vision.md`, ainsi que des principes produit définis dans `docs/08-product-blueprint/02-product-principles.md`.

---

## 2. Périmètre fonctionnel réel

Le périmètre UX du prototype est **strictement limité aux deux endpoints HTTP actuellement implémentés** :

```text
GET /health
GET /competitions/:code/matches
```

### Ce qui est disponible

| Capacité | Détail |
|---|---|
| Mode de consultation | Lecture seule — aucune action d'écriture |
| Compétition réelle | `FL1` (Ligue 1) uniquement |
| Type de matchs | Matchs au statut `SCHEDULED` dans la fenêtre de 7 jours UTC |
| Données par match | Équipes, date/heure UTC, statut, journée |
| État du service | Vérification via `GET /health` |

### Ce qui est absent — et ne doit pas être représenté

| Élément absent | Raison |
|---|---|
| Détail de match | `getMatchDetails()` non implémentée (`NotImplementedError`) |
| Compte utilisateur | Aucune authentification dans le prototype |
| Personnalisation | Aucun profil ni préférence |
| Prédictions | Hors périmètre prototype |
| Cotes sportives | Hors périmètre prototype |
| Fonctionnalités de pari | Hors périmètre prototype |
| Plusieurs compétitions réelles | Architecture prête, mais seule `FL1` est active |
| Historique persistant | Cache mémoire TTL 10 min uniquement |
| Classements | Hors périmètre prototype |
| Statistiques avancées | Hors périmètre prototype |

---

## 3. Principes UX

Les principes suivants gouvernent toutes les décisions de conception UX/UI de la Phase 3.1 :

### 3.1 Clarté avant densité

L'interface présente uniquement les informations disponibles. Aucun espace réservé ne suggère des données inexistantes. La densité d'information est ajustée à la réalité du contenu, pas à une vision future.

### 3.2 Retour d'état immédiat

Chaque transition entre états (chargement, données, vide, erreur) est communicée sans délai perceptible. L'utilisateur sait toujours dans quel état se trouve le service.

### 3.3 Absence de promesse non supportée

Aucun élément visuel ne suggère une fonctionnalité non implémentée. Les boutons, liens, onglets et menus correspondent à des actions réellement disponibles.

### 3.4 Langage compréhensible

Les messages d'interface utilisent un vocabulaire neutre, précis et non technique. Les codes d'erreur API (`COMPETITION_NOT_AVAILABLE`, `PROVIDER_RATE_LIMIT`, `PROVIDER_UNAVAILABLE`) sont traduits en langage compréhensible sans exposer la nomenclature interne.

### 3.5 Erreurs orientées vers l'action

Chaque état d'erreur indique clairement ce qui s'est passé et ce que l'utilisateur peut faire (ou ne peut pas faire). Les états d'erreur ne sont jamais des impasses.

### 3.6 Accessibilité dès la conception

L'accessibilité est une contrainte de conception, non un ajout postérieur. Chaque décision d'architecture, de hiérarchie et de composant intègre les besoins d'accessibilité dès la première itération (WCAG 2.1 AA comme objectif documentaire, conformément au Blueprint `docs/08-product-blueprint/23-accessibility.md`).

### 3.7 Mobile-first

La conception part de l'écran compact (360 px) et s'étend vers les formats plus larges. Aucune fonctionnalité n'est réservée au format desktop uniquement.

### 3.8 Performance perçue

L'interface communique activement l'état de chargement afin que l'attente soit intelligible. Les structures stables évitent les sauts de mise en page lors du chargement (pas de layout shift).

### 3.9 Cohérence des états

Les composants représentant les états (chargement, vide, erreur) sont cohérents dans leur structure visuelle et leurs messages. Une convention uniforme réduit la charge cognitive.

### 3.10 Absence de dark pattern

L'interface n'exerce aucune pression artificielle sur l'utilisateur. Il n'y a ni compte à rebours, ni urgence simulée, ni accès verrouillé artificiel.

### 3.11 Absence de pression commerciale

Le prototype n'affiche aucun message d'incitation à l'abonnement, aucun badge Premium, aucun tunnel de conversion. Cela sera cadré lors de phases ultérieures une fois que OQ-001 et OQ-002 seront résolues.

### 3.12 Confidentialité par défaut

L'interface ne collecte aucune donnée personnelle. Aucun formulaire, aucun cookie de traçage, aucun système d'analytics n'est prévu dans le prototype.

---

## 4. Langue des spécifications de travail

Les textes d'interface présents dans les wireframes et spécifications de la Phase 3.1 sont rédigés en **français**, langue de référence initiale du projet (Blueprint `docs/08-product-blueprint/02-product-principles.md`).

> **Important :** L'utilisation du français dans les spécifications de travail ne résout pas OQ-004 et ne décide pas de la stratégie linguistique finale du MVP.

La décision sur la langue initiale du produit livré (FR uniquement, FR+EN, autre) reste une question ouverte (OQ-004) soumise à arbitrage du Fondateur avant implémentation.

---

## 5. Questions ouvertes et leurs implications UX

Les questions ouvertes suivantes ont un impact direct sur les décisions de conception. Leur statut exact est repris ci-dessous sans résolution arbitraire.

| Question | Statut officiel | Implication UX concrète |
|---|---|---|
| **OQ-001** — Quotas Free | **Ouverte** | Aucun indicateur de quota ni compteur d'usage ne peut être conçu |
| **OQ-002** — Tarifaire Premium | **Ouverte** | Aucune page de pricing ni tunnel d'abonnement |
| **OQ-003** — Fournisseurs de données | **Partiellement résolue** (DEC-002/DEC-006) | `football-data.org` pour le prototype ; extensibilité multi-sources cadrée |
| **OQ-004** — Langue(s) initiale(s) | **Ouverte** | Les wireframes en français sont provisoires |
| **OQ-005** — MFA utilisateurs | **Ouverte** | Aucun parcours de connexion MFA ne peut être conçu |
| **OQ-006** — Compétitions MVP | **Décision conditionnelle** (DEC-001/DEC-005) | Seule `FL1` est disponible ; sélecteur multi-compétitions non activé |

### Pourquoi certaines interfaces sont impossibles à concevoir maintenant

- **Interfaces liées aux plans (Free/Premium) :** OQ-001 et OQ-002 non résolues — aucune valeur de quota ni de prix n'est disponible pour concevoir les éléments associés.
- **Interfaces de compte et d'authentification :** OQ-005 non résolue, et aucune authentification n'est implémentée dans le prototype.
- **Interfaces MFA :** OQ-005 non résolue — le niveau de sécurité du prototype reste `mot de passe simple`.
- **Interfaces de paiement :** OQ-002 non résolue — aucun modèle tarifaire validé.

---

## 6. Hors périmètre Phase 3.1

Les éléments suivants sont **explicitement hors du périmètre** de la présente spécification et de toute future implémentation Phase 3.1 :

```text
Code frontend (HTML, CSS, JavaScript, TypeScript, React, Vue, Svelte, etc.)
Bibliothèques de composants (Tailwind, Bootstrap, Material UI, Shadcn, etc.)
Maquettes graphiques haute fidélité ou prototypes exécutables
Choix de framework frontend ou d'outil de build
Connexion de l'interface à l'API backend
Modification du code backend, des domaines ou des ports
Création de nouveaux endpoints HTTP ou nouvelles APIs
Authentification des utilisateurs, comptes, mots de passe, MFA
Paiements, abonnements, tunnels d'achat
Prédictions, algorithmes probabilistes, cotes sportives, paris
Page de détail de match (getMatchDetails() non implémentée)
Plusieurs compétitions réelles supplémentaires (non encore disponibles)
Classements, statistiques avancées, historique persistant
Déploiement public, hébergement cloud, analytics, tracking
Collecte de données personnelles
Résolution arbitraire des questions ouvertes OQ-001 à OQ-006
```

---

## 7. Critères de conformité UX

Les critères suivants permettent de vérifier qu'un écran ou une spécification reste dans le périmètre autorisé :

| Critère | Test |
|---|---|
| **C-01** | L'écran ne présente aucune fonctionnalité non supportée par l'API actuelle |
| **C-02** | Aucun lien ou bouton ne pointe vers une page inexistante dans le périmètre |
| **C-03** | Les données affichées correspondent aux champs réellement disponibles dans la réponse API |
| **C-04** | Aucun quota, prix ou offre commerciale n'est affiché |
| **C-05** | Aucune prédiction, cote ou fonctionnalité de pari n'est représentée |
| **C-06** | Le texte provisoire en français ne prétend pas résoudre OQ-004 |
| **C-07** | Chaque état d'erreur correspond exactement à un code HTTP documenté |
| **C-08** | Aucune navigation ne pointe vers une page de détail de match |
| **C-09** | Seule `FL1` est représentée comme compétition réelle active |
| **C-10** | L'accessibilité est intégrée dès la conception, pas ajoutée en fin de process |

---

```text
PÉRIMÈTRE UX PHASE 3.1 SPÉCIFIÉ — AUCUNE FONCTIONNALITÉ NON SUPPORTÉE AUTORISÉE
```

---

> Made in Abyss : Spark by the King
