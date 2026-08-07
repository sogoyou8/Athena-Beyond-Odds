# Phase 3.1 — Spécification des fondations du Design System Athena

* **Date :** 2026-08-06
* **Responsable :** Fondateur ABYSS
* **Statut :** Spécification proposée pour validation
* **Référence :** `d39757f5bb6aeb74d8dea58fd7633a5c5e49544e`

---

## 1. Niveau d'autorisation et périmètre

Ce document définit la **structure documentaire** du Design System Athena. Il établit une taxonomie de tokens, une anatomie de composants et des principes d'accessibilité et de responsive design **sans sélectionner définitivement** :

- une palette de marque ;
- une famille de police ;
- une bibliothèque UI (Tailwind, Bootstrap, Material UI, Shadcn, etc.) ;
- un framework frontend (React, Vue, Svelte, etc.) ;
- un pack d'icônes ;
- aucune technologie d'implémentation.

Ces choix sont soumis à arbitrage futur du Fondateur (voir section 9 — Décisions encore nécessaires).

---

## 2. Taxonomie des tokens de design

Les tokens constituent la couche sémantique du Design System. Ils définissent **des rôles**, pas des valeurs définitives.

### 2.1 Couleurs sémantiques

| Token | Rôle |
|---|---|
| `surface.base` | Fond principal de l'application |
| `surface.elevated` | Fond des éléments en surélévation (cartes, dialogues) |
| `surface.subtle` | Fond des zones secondaires, sections en retrait |
| `text.primary` | Texte principal — fort contraste |
| `text.secondary` | Texte secondaire — contraste modéré |
| `text.muted` | Texte tertiaire, métadonnées, labels discrets |
| `border.default` | Bordure de séparation standard |
| `border.strong` | Bordure forte — emphase structurelle |
| `status.success` | Succès, état opérationnel |
| `status.warning` | Avertissement, dégradation partielle |
| `status.error` | Erreur, état critique |
| `status.information` | Information neutre, contexte |
| `focus.ring` | Anneau de focus — conformité WCAG 2.1 AA |

> **Aucune valeur hexadécimale définitive.** Les couleurs candidates (ex. : les tokens du Blueprint `docs/08-product-blueprint/25-design-tokens.md`) sont documentées comme options non validées, soumises à validation de contraste et à arbitrage de direction visuelle.

### 2.2 Typographie — Rôles

| Token | Rôle |
|---|---|
| `typography.display` | Titre d'application, accroche principale |
| `typography.heading.1` | Titre de section principal (`h1`) |
| `typography.heading.2` | Titre de sous-section (`h2`) |
| `typography.heading.3` | Titre de groupe ou composant (`h3`) |
| `typography.body` | Corps de texte standard |
| `typography.body.compact` | Corps de texte compact — cartes, listes denses |
| `typography.label` | Étiquette de champ ou composant |
| `typography.caption` | Légende, métadonnée secondaire |
| `typography.code` | Valeurs techniques, codes, horaires ISO |

> **Aucune famille de police sélectionnée.** Les candidates documentées dans `docs/08-product-blueprint/25-design-tokens.md` (Inter, IBM Plex Sans, JetBrains Mono) sont des options à valider, non des décisions approuvées.

### 2.3 Échelle d'espacement

L'échelle est basée sur une unité conceptuelle de **4 px**, cohérente avec les pratiques standard de Design System.

| Token | Valeur conceptuelle |
|---|---|
| `space.0` | 0 px |
| `space.1` | 4 px |
| `space.2` | 8 px |
| `space.3` | 12 px |
| `space.4` | 16 px |
| `space.6` | 24 px |
| `space.8` | 32 px |
| `space.12` | 48 px |
| `space.16` | 64 px |

> L'échelle devra être **validée visuellement** sur les wireframes haute fidélité avant implémentation.

### 2.4 Rayons de bordure — Rôles

| Token | Rôle |
|---|---|
| `radius.none` | Aucun arrondi — éléments tabulaires, séparateurs |
| `radius.small` | Arrondi léger — badges, étiquettes |
| `radius.medium` | Arrondi standard — cartes, boutons |
| `radius.large` | Arrondi marqué — panneaux, modales |
| `radius.round` | Arrondi complet — avatars, indicateurs circulaires |

### 2.5 Élévation

| Token | Rôle |
|---|---|
| `elevation.none` | Pas d'ombre — surface de base |
| `elevation.low` | Ombre légère — cartes standard |
| `elevation.medium` | Ombre modérée — éléments en surplomb |

> **Règle absolue :** L'élévation ne doit **jamais être le seul indicateur de séparation**. Toute distinction repose aussi sur le contraste de surface, la bordure ou l'espacement.

### 2.6 Principes de mouvement

| Principe | Spécification |
|---|---|
| Mouvement fonctionnel | Toute animation communique un changement d'état ou guide l'attention |
| Durées courtes | Transitions entre 150 ms et 300 ms — jamais au-delà sans justification |
| Absence d'animation obligatoire | Aucune animation décorative n'est requise |
| `prefers-reduced-motion` | À respecter lors de l'implémentation (réduction ou suppression des animations) |
| Aucun blocage | Aucune animation ne doit bloquer l'accès au contenu |

---

## 3. Composants documentaires

Les composants suivants sont définis à titre **documentaire uniquement**. Leurs noms ne constituent pas une API de code approuvée ni un choix de bibliothèque.

### 3.1 AppShell

| Attribut | Détail |
|---|---|
| **Objectif** | Conteneur structurel de toute l'application |
| **Contenu** | AppHeader + zone de contenu principal + informations secondaires |
| **Anatomie** | En-tête fixe, zone principale scrollable, pied optionnel |
| **Variantes** | Compact (mobile) / Large (desktop) |
| **États** | Normal, dégradé (service de santé indisponible) |
| **Responsive** | Réorganisation de la mise en page selon la largeur de référence |
| **Accessible** | `<header>`, `<main>`, `<footer>` sémantiques, ordre de lecture DOM = ordre visuel |
| **Interdit** | Barre latérale de navigation avec fonctions inexistantes |

---

### 3.2 AppHeader

| Attribut | Détail |
|---|---|
| **Objectif** | Identité et état global du service |
| **Contenu** | Logotype ou nom « Athena », indicateur ServiceStatus discret |
| **Anatomie** | Bande horizontale pleine largeur |
| **Variantes** | Normal / dégradé |
| **États** | Service opérationnel / Service dégradé |
| **Responsive** | Compact (360 px) : texte concis ; large (1280 px) : espace aéré |
| **Accessible** | `role="banner"`, titre de page cohérent |
| **Interdit** | Bouton de connexion / menu compte / notifications |

---

### 3.3 ServiceStatus

| Attribut | Détail |
|---|---|
| **Objectif** | Indiquer discrètement l'état du service `GET /health` |
| **Contenu** | Indicateur visuel + texte optionnel |
| **Anatomie** | Badge discret ou bandeau subtil |
| **Variantes** | Opérationnel (discret) / Dégradé (visible) |
| **États** | OK / dégradé / inaccessible |
| **Accessible** | `role="status"` ou `aria-live="polite"` |
| **Interdit** | Exposer les détails techniques du service de santé |

---

### 3.4 CompetitionHeader

| Attribut | Détail |
|---|---|
| **Objectif** | Contextualiser les données de la compétition affichée |
| **Contenu** | Nom de la compétition (`Ligue 1`), période couverte (7 jours UTC), nombre de matchs si disponible |
| **Anatomie** | Bandeau contextuel sous l'AppHeader |
| **Variantes** | Avec données / Sans données |
| **Accessible** | Titre `h2` ou équivalent — hiérarchie préservée |
| **Interdit** | Sélecteur de compétitions supplémentaires non disponibles |

---

### 3.5 MatchList

| Attribut | Détail |
|---|---|
| **Objectif** | Présenter l'ensemble des MatchCards de manière lisible |
| **Contenu** | Collection de MatchCard |
| **Anatomie** | Conteneur liste ordonné chronologiquement |
| **Variantes** | Pleine / Vide (→ EmptyState) |
| **États** | Chargement (→ LoadingState) / Peuplée / Vide |
| **Responsive** | 360 px : 1 colonne ; 768 px : 1 colonne large ; 1280 px : 2-3 colonnes |
| **Accessible** | `<ul>` ou `<ol>` selon la logique d'ordre, `role="list"` |
| **Interdit** | Pagination ou tri si non supporté par l'API |

---

### 3.6 MatchCard

| Attribut | Détail |
|---|---|
| **Objectif** | Représenter un match individuel de manière claire |
| **Contenu** | Équipe domicile, équipe extérieure, date/heure UTC, statut `SCHEDULED`, journée |
| **Anatomie** | Bloc délimité avec zones équipes / heure / statut / journée |
| **Variantes** | Standard |
| **États** | Par défaut uniquement (pas d'état interactif défini à ce stade) |
| **Responsive** | Compact : empilé vertical ; large : horizontal avec infos en ligne |
| **Accessible** | `<li>` ou `<article>`, intitulé accessible (équipes + date), heure lisible |
| **Interdit** | Lien vers détail de match / score / cote / prédiction / favori / partage |

---

### 3.7 StatusBadge

| Attribut | Détail |
|---|---|
| **Objectif** | Afficher le statut d'un match ou d'un état de service |
| **Contenu** | Texte de statut (`Programmé`, etc.) |
| **Variantes** | Selon les tokens `status.*` |
| **Accessible** | Couleur + texte (jamais couleur seule) |
| **Interdit** | Statuts non définis par le domaine |

---

### 3.8 LoadingState

| Attribut | Détail |
|---|---|
| **Objectif** | Communiquer le chargement sans layout shift |
| **Contenu** | Squelettes de MatchCards |
| **Variantes** | Compact / Large |
| **Accessible** | `aria-label="Chargement en cours"`, squelettes `aria-hidden="true"` |
| **Interdit** | Faux contenu, spinner sans contexte, animation bloquante |

---

### 3.9 EmptyState

| Attribut | Détail |
|---|---|
| **Objectif** | Communiquer l'absence de données sans alarmisme |
| **Contenu** | Titre informatif, message neutre, illustration optionnelle |
| **Message type** | « Aucun match programmé sur la période disponible. » |
| **Action** | Aucune action requise |
| **Accessible** | Annoncé via `aria-live` |
| **Interdit** | Présenter l'état vide comme une erreur |

---

### 3.10 ErrorState

| Attribut | Détail |
|---|---|
| **Objectif** | Communiquer une erreur récupérable de manière claire |
| **Contenu** | Titre d'erreur, message compréhensible, action si applicable |
| **Variantes** | 404 / 429 / 503 / Réseau / Santé |
| **Action** | ManualRetryAction (optionnel selon l'état) |
| **Accessible** | `role="alert"` pour les erreurs critiques |
| **Interdit** | Exposer les codes techniques à l'utilisateur final |

---

### 3.11 InlineFeedback

| Attribut | Détail |
|---|---|
| **Objectif** | Communiquer des états intermédiaires ou avertissements non bloquants |
| **Contenu** | Message court, icône sémantique |
| **Variantes** | Information / Avertissement / Erreur légère |
| **Accessible** | `role="status"` ou `aria-live="polite"` |

---

### 3.12 ManualRetryAction

| Attribut | Détail |
|---|---|
| **Objectif** | Permettre à l'utilisateur de relancer manuellement une requête |
| **Contenu** | Bouton « Réessayer » |
| **Condition d'affichage** | États 429 et 503 uniquement (étude) |
| **Distinction** | Clairement distingué d'un retry automatique backend |
| **Accessible** | Label explicite, accessible au clavier, taille cible ≥ 44×44 px |
| **Interdit** | Déclencher un retry automatique en boucle |

---

### 3.13 AccessibleAnnouncementRegion

| Attribut | Détail |
|---|---|
| **Objectif** | Annoncer les changements d'état aux technologies d'assistance |
| **Contenu** | Texte dynamique d'annonce |
| **Anatomie** | `aria-live="polite"` (non urgent) ou `aria-live="assertive"` (urgent) |
| **Règle** | Une seule région par type d'urgence dans l'application |
| **Interdit** | Announcer des informations techniques internes |

---

## 4. Accessibilité — Objectif documentaire

L'objectif d'accessibilité documentaire minimal retenu est :

```text
WCAG 2.1 niveau AA
```

### Exigences documentaires

| Critère | Description |
|---|---|
| **Contraste** | Ratio ≥ 4,5:1 pour le texte normal, ≥ 3:1 pour le texte large |
| **Navigation clavier** | Toutes les zones interactives accessibles sans souris |
| **Focus visible** | Indicateur de focus conforme WCAG 2.1 AA |
| **Taille de cible tactile** | Minimum 44 × 44 px pour les éléments interactifs |
| **Contenu sans couleur** | Toute information transmise par couleur est doublée par texte ou forme |
| **Lecteurs d'écran** | Structure sémantique conforme, labels ARIA explicites |
| **Réduction du mouvement** | `prefers-reduced-motion` respecté à l'implémentation |
| **Zoom à 200 %** | Contenu lisible et fonctionnel à 200 % de zoom |
| **Ordre de lecture** | DOM cohérent avec l'ordre visuel |
| **Messages d'erreur** | Compréhensibles, identifiés, liés au champ ou composant concerné |

> Cette cible devra être **vérifiée lors d'une future implémentation** par audit automatisé et manuel.

---

## 5. Responsive — Principes documentaires

| Principe | Description |
|---|---|
| **Contenu fluide** | Les largeurs s'adaptent au viewport, pas de largeur fixe rigide |
| **Mobile-first** | La conception part du format compact (360 px) |
| **Pas de scroll horizontal fonctionnel** | L'interface ne requiert jamais de scroll horizontal pour fonctionner |
| **Regroupement progressif** | Les informations secondaires se condensent ou se masquent sur petits écrans |
| **Lisibilité heures et équipes** | Les données clés (horaires, noms d'équipes) restent lisibles à toutes tailles |
| **Actions accessibles** | Les éléments interactifs maintiennent leur taille minimale (44×44 px) quelle que soit la largeur |

---

## 6. Composants hors périmètre Phase 3.1

Les composants suivants **ne doivent pas être spécifiés ou implémentés** dans le cadre de la Phase 3.1 :

```text
AuthForm (connexion / inscription / MFA)
UserMenu / UserProfile
PremiumBadge / UpgradePrompt
PricingCard / SubscriptionFlow
MatchDetailView (getMatchDetails() non implémentée)
PredictionCard / OddsDisplay
BettingSlip / BetBuilder
CompetitionSelector (multi-compétitions réelles non disponibles)
NotificationCenter
FavoritesManager
HistoryTimeline
LeagueStanding
```

---

## 7. Design System — Décisions encore nécessaires

Les décisions visuelles et technologiques suivantes restent **ouvertes et soumises à arbitrage du Fondateur** :

| Décision | Options envisageables | Statut |
|---|---|---|
| **Direction visuelle** | Mode sombre / Mode clair / Adaptatif | Non décidée |
| **Palette de marque** | Options documentées dans Blueprint `25-design-tokens.md` | Non décidée |
| **Typographie principale** | Inter, IBM Plex Sans, Outfit, Geist, autre | Non décidée |
| **Mode par défaut** | Clair par défaut / Sombre par défaut / Système | Non décidée |
| **Densité d'information** | Compacte / Standard / Aérée | Non décidée |
| **Iconographie** | Lucide, Heroicons, Phosphor, Material Symbols, autre | Non décidée |
| **Tonalité rédactionnelle** | Neutre informatif / Chaleureux / Expert technique | Non décidée |

> Aucune option de ce tableau n'est déclarée choisie. Toute décision future sera consignée dans le Decision Log avant implémentation.

---

```text
FONDATIONS DU DESIGN SYSTEM PHASE 3.1 SPÉCIFIÉES — VALEURS DE MARQUE ET TECHNOLOGIES ENCORE À ARBITRER
```

---

> Made in Abyss : Spark by the King
