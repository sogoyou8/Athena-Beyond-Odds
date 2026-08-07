# Phase 3.1 — Plan d'implémentation frontend Athena

* **Date :** 2026-08-07
* **Responsable :** Fondateur ABYSS
* **Statut :** Cadrage proposé pour validation
* **Référence :** `88184110dbff27d695728900c0c2635bd8c7d956`
* **Technologie :** HTML sémantique + CSS natif + TypeScript client minimal

---

## 1. Objectif

Ce document définit le plan d'implémentation d'une première tranche frontend minimale pour l'application Athena: Beyond Odds.

Le périmètre de cette tranche est **strictement limité aux capacités réellement disponibles** de l'API Phase 2 :

```text
GET /health
GET /competitions/:code/matches
```

Avec les conditions de cadrage suivantes :
- Compétition réelle : `FL1` (Ligue 1) uniquement.
- Mode de fonctionnement : Lecture seule absolue.
- Architecture d'interface : Une seule vue principale responsive.
- Hébergement : Intégration Same-Origin directe avec le serveur Express existant.

---

## 2. Non-objectifs (Exclusions strictes)

Sont **explicitement exclus** de la première tranche d'implémentation frontend :

```text
Aucune page de détail de match (getMatchDetails() non implémentée)
Aucun compte utilisateur ni profil
Aucune authentification (mot de passe, MFA, OAuth)
Aucun plan commercial (Free, Premium, tarification)
Aucun tunnel de paiement ou d'abonnement
Aucune prédiction probabiliste
Aucune cote sportive
Aucune fonctionnalité de pari
Aucun classement de compétition
Aucun historique persistant
Aucun gestionnaire de favoris
Aucun système de notification push
Aucun outil d'analytics ou de tracking
Aucune communication temps réel (WebSocket, Server-Sent Events)
```

---

## 3. Structure future proposée

Afin d'intégrer le frontend dans le dépôt actuel sans perturber la structure backend existante, la structure documentaire suivante est **proposée pour une future autorisation** :

```text
Athena-Beyond-Odds/
├── src/
│   ├── frontend/                         [FUTUR — NOUVEAU REPERTOIRE]
│   │   ├── public/
│   │   │   └── index.html                [FUTUR — HTML sémantique source]
│   │   ├── styles/
│   │   │   └── main.css                  [FUTUR — CSS natif & variables tokens]
│   │   └── ts/
│   │       ├── main.ts                   [FUTUR — Point d'entrée TS client]
│   │       ├── api-client.ts             [FUTUR — Client Fetch HTTP same-origin]
│   │       └── render.ts                 [FUTUR — Rendu DOM & gestion des états]
│   ├── app.ts                            [FUTUR — Modification minimale : express.static]
│   └── ... (backend existant inchangé)
├── dist/                                 [SORTIE DE BUILD]
│   ├── public/                           [FUTUR — Assets copiés index.html, main.css, main.js]
│   └── ... (JS backend compilé)
└── scripts/
    └── copy-assets.js                    [FUTUR — Script Node.js natif de copie]
```

> **IMPORTANT :** Cette structure est une **PROPOSITION DOCUMENTAIRE**. Aucun fichier sous `src/frontend/`, `dist/public/` ou `scripts/copy-assets.js` n'est créé pendant cette mission.

### Détail des futurs fichiers proposés

| Futur fichier | Responsabilité | Statut proposé | Contenu conceptuel |
|---|---|---|---|
| `src/frontend/public/index.html` | Squelette HTML5 sémantique | Nouveau | Document HTML, landmarks, titre, conteneurs live |
| `src/frontend/styles/main.css` | Styles CSS natifs & tokens | Nouveau | Variables CSS tokens, layouts Grid/Flex, thème clair/sombre |
| `src/frontend/ts/main.ts` | Orchestration & démarrage client | Nouveau | Initialisation thème, boucle d'appel Fetch, gestion d'états |
| `src/frontend/ts/api-client.ts` | Client HTTP same-origin | Nouveau | Wrappers `fetch('/health')` et `fetch('/competitions/FL1/matches')` |
| `src/frontend/ts/render.ts` | Rendu DOM textuel sécurisé | Nouveau | Insertion sécurisée `textContent` des MatchCards et états |
| `scripts/copy-assets.js` | Copie des assets statiques | Nouveau | Copie de `index.html` et `main.css` vers `dist/public/` |
| `src/app.ts` | Middleware statique Express | Modifié | Ajout de `app.use(express.static('dist/public'))` |

---

## 4. Frontière Frontend / Backend

La frontière de responsabilité est strictement établie comme suit :

### Frontend (Client Navigateur)
- Rendu visuel HTML/CSS responsive.
- Exécution du Fetch initial vers l'origine unique.
- Gestion des 8 états d'interface (chargement, données, vide, erreurs).
- Gestion de la bascule d'apparence (thème clair/sombre).
- Garanties d'accessibilité (labels ARIA, focus, régions `aria-live`).

### Backend (Serveur Express)
- API REST existante (`/health` et `/competitions/:code/matches`).
- Télémétrie, observabilité, cache mémoire (TTL 10 min), adapter provider.
- Service des assets statiques compilés (`express.static`).
- **Aucune duplication de logique métier, de cache ou de provider côté client.**

---

## 5. Vue unique et composants documentaires

La vue principale unique s'articule autour des 13 composants documentaires définis dans la Phase 3.1 :

```text
┌──────────────────────────────────────────────────────────┐
│ AppShell                                                 │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ AppHeader                     [ServiceStatus (health)]│ │
│ ├──────────────────────────────────────────────────────┤ │
│ │ CompetitionHeader (Ligue 1 - FL1)                    │ │
│ ├──────────────────────────────────────────────────────┤ │
│ │ MatchList (ou LoadingState / EmptyState / ErrorState)│ │
│ │ ┌──────────────────────────────────────────────────┐ │ │
│ │ │ MatchCard (Équipes, Heure UTC, Journée, Statut)  │ │ │
│ │ └──────────────────────────────────────────────────┘ │ │
│ ├──────────────────────────────────────────────────────┤ │
│ │ InlineFeedback / ManualRetryAction (si applicable)    │ │
│ └──────────────────────────────────────────────────────┘ │
│ AccessibleAnnouncementRegion (aria-live)                 │
└──────────────────────────────────────────────────────────┘
```

---

## 6. Séquence de démarrage du client

Le flux conceptuel lors de l'ouverture du document navigateur est le suivant :

```text
1. Chargement du document index.html
2. Exécution du script client TypeScript compilé (main.js)
3. Détermination immédiate du thème visuel via prefers-color-scheme
4. Affichage de la structure stable et du LoadingState (squelettes)
5. Envoi simultané des requêtes :
   ├── GET /health (vérification silencieuse d'état de service)
   └── GET /competitions/FL1/matches
6. Traitement des réponses :
   ├── Si /health est dégradé : affichage discret dans ServiceStatus
   └── Si matches réussit (200) : rendu des MatchCards (ou EmptyState si [])
   └── Si matches échoue (404/429/503/Réseau) : affichage d'ErrorState
```

---

## 7. Gestion du Thème (Apparence)

- **Valeur initiale :** Détectée automatiquement via la media query CSS `prefers-color-scheme: dark`.
- **Bascule manuelle :** Un bouton dans `AppHeader` permet à l'utilisateur d'alterner entre mode clair et mode sombre.
- **Politique de persistance :** **Aucune persistance entre sessions n'est décidée** (aucun `localStorage`, aucun cookie, aucun serveur de préférences). La bascule s'applique uniquement à la session courante en mémoire.

---

## 8. Modèle d'état client

Le client gère un état explicite simple représenté par l'union suivante :

```text
type ClientState =
  | { status: 'initial' }
  | { status: 'loading' }
  | { status: 'matches'; data: MatchDTO[] }
  | { status: 'empty' }
  | { status: 'competitionUnavailable' }
  | { status: 'rateLimited' }
  | { status: 'providerUnavailable' }
  | { status: 'networkUnavailable' }
  | { status: 'healthUnavailable' };
```

---

## 9. Mapping des réponses HTTP vers les états d'interface

| Réponse HTTP Backend | État Client | Rendu Visuel |
|---|---|---|
| Requête en cours | `loading` | Squelettes de cartes stables (`LoadingState`) |
| HTTP 200 + `matches.length > 0` | `matches` | Grille/liste de `MatchCard` |
| HTTP 200 + `matches: []` | `empty` | Composant `EmptyState` ("Aucun match programmé sur la période disponible.") |
| HTTP 404 (`COMPETITION_NOT_AVAILABLE`) | `competitionUnavailable` | Message d'information ("Seule la Ligue 1 FL1 est disponible au prototype.") |
| HTTP 429 (`PROVIDER_RATE_LIMIT`) | `rateLimited` | Avertissement ("Données temporairement inaccessibles. Réessayez dans un instant.") |
| HTTP 503 (`PROVIDER_UNAVAILABLE`) | `providerUnavailable` | Erreur ("Service temporairement indisponible.") + bouton manuel "Réessayer" |
| `TypeError: Failed to fetch` | `networkUnavailable` | Message ("Connexion indisponible. Vérifiez votre connexion internet.") |
| `/health` non-200 | `healthUnavailable` | Bannière discrète ("Service en maintenance.") |

---

## 10. Politique de réessai et de rafraîchissement

- **Aucun polling automatique :** L'interface n'effectue aucun rafraîchissement périodique en arrière-plan.
- **Aucun retry automatique :** Toute logique de retry appartient au backend.
- **Réessai manuel :** Pour les états `503`, `429` ou `networkUnavailable`, l'utilisateur peut cliquer manuellement sur un bouton "Réessayer" qui déclenche une nouvelle requête `fetch`.

---

## 11. Sécurité et confidentialité

- **Aucun secret dans le client :** Le frontend ne manipule ni ne stocke aucune clé API (`FOOTBALL_DATA_API_KEY`), aucun token, aucun secret.
- **Requêtes Same-Origin :** Les appels `fetch` utilisent exclusivement des URLs relatives (`/health`, `/competitions/FL1/matches`). Aucune requête directe vers `football-data.org` n'est effectuée par le navigateur.
- **Rendu textuel sécurisé :** L'insertion de données dynamiques dans le DOM utilise exclusivement `textContent` pour prévenir toute vulnérabilité XSS. Aucun `innerHTML` non nettoyé.
- **Aucune donnée personnelle :** Aucune collecte de données, aucun analytics, aucun cookie de traçage.

---

## 12. Exigences d'accessibilité (WCAG 2.1 AA)

- **Titre principal unique :** `<h1>` unique dans l'en-tête/vue principale.
- **Landmarks HTML5 :** `<header>`, `<main>`, `<footer>`, `<section>`.
- **Focus visible :** Contour de focus distinct conforme aux critères WCAG.
- **Annonces dynamique :** Conteneur `aria-live="polite"` pour annoncer la mise à jour des matchs ou les erreurs.
- **Cible tactile :** Taille minimale de 44 × 44 px pour tout élément cliquable.
- **Mouvement :** Désactivation/simplification des animations si `prefers-reduced-motion: reduce` est actif.

---

## 13. Références Responsive

L'intégration CSS natif valide les trois références de largeur de travail :
- **360 px (Compact) :** Disposition verticale mobile, 1 colonne.
- **768 px (Intermédiaire) :** Disposition tablette fluide.
- **1280 px (Large) :** Disposition desktop en grille multi-colonnes.

---

## 14. Analyse des risques

1. **Surarchitecture :** Tentative de réintroduire des frameworks JS lourds au moment de l'implémentation.
2. **Synchronisation du Build :** Risque que les assets HTML/CSS ne soient pas correctement copiés dans `dist/public/` lors du build.
3. **Chemin d'assets relatif :** Risque de mauvaise résolution si le serveur Express est démarré depuis un répertoire de travail (CWD) différent.

---

```text
PLAN D'IMPLÉMENTATION FRONTEND PHASE 3.1 CADRÉ — CODE ENCORE NON AUTORISÉ
```

---

> Made in Abyss : Spark by the King
