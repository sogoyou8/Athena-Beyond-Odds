# Phase 3.1 — Wireframes basse fidélité Athena

* **Date :** 2026-08-06
* **Responsable :** Fondateur ABYSS
* **Statut :** Proposition documentaire pour validation
* **Référence :** `d39757f5bb6aeb74d8dea58fd7633a5c5e49544e`
* **Fidélité :** Basse fidélité

---

## 1. Format et conventions

Les wireframes sont produits exclusivement en :
- **Markdown** (structure et annotations)
- **Tableaux** (matrice de mise en page)
- **Diagrammes Mermaid** (flux et transitions)
- **Blocs monospace ASCII** (représentation schématique des écrans)

Aucune image binaire, maquette haute fidélité, fichier Figma, export graphique ou outil de prototypage n'est produit.

### Conventions des wireframes ASCII

```text
┌─────────────────────┐  = Bord de l'écran
│ TEXT                │  = Zone de contenu
├─────────────────────┤  = Séparateur de zone
[   BTN   ]           = Bouton
{ placeholder }       = Contenu dynamique
░░░░░░░░░░░░░░░       = Squelette de chargement
─────                 = Séparateur visuel
```

---

## 2. Wireframe 1 — Chargement initial

**État API :** Requête en cours — aucune réponse reçue.

### 2.1 Format compact — 360 px

```text
┌────────────────────────────────────────┐
│ ◈ Athena              [●] Service OK   │  ← AppHeader
├────────────────────────────────────────┤
│ Ligue 1 (FL1)  |  7 prochains jours   │  ← CompetitionHeader
├────────────────────────────────────────┤
│                                        │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← Squelette MatchCard
│  ░░░░░░░░  vs  ░░░░░░░░              │
│  ░░░░░░░   ░░░░░░░░░░░░░░░░░         │
│                                        │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← Squelette MatchCard
│  ░░░░░░░░  vs  ░░░░░░░░              │
│  ░░░░░░░   ░░░░░░░░░░░░░░░░░         │
│                                        │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← Squelette MatchCard
│                                        │
└────────────────────────────────────────┘
```

### 2.2 Format large — 1280 px

```text
┌──────────────────────────────────────────────────────────────────┐
│ ◈ Athena Beyond Odds                         [●] Service actif   │
├──────────────────────────────────────────────────────────────────┤
│  Ligue 1 (FL1)              Matchs programmés  |  7 jours UTC    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────┐  ┌─────────────────────┐               │
│  │ ░░░░  vs  ░░░░░░░  │  │ ░░░░  vs  ░░░░░░░  │               │
│  │ ░░░░░░░  ░░░░░░░░  │  │ ░░░░░░░  ░░░░░░░░  │               │
│  └─────────────────────┘  └─────────────────────┘               │
│                                                                  │
│  ┌─────────────────────┐  ┌─────────────────────┐               │
│  │ ░░░░  vs  ░░░░░░░  │  │ ░░░░  vs  ░░░░░░░  │               │
│  │ ░░░░░░░  ░░░░░░░░  │  │ ░░░░░░░  ░░░░░░░░  │               │
│  └─────────────────────┘  └─────────────────────┘               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Annotations :**
- Hiérarchie : AppHeader → CompetitionHeader → MatchList (squelettes)
- Ordre de lecture : haut → bas, gauche → droite
- Responsive : 1 colonne (compact) → 2 colonnes (large)
- Clavier : pas d'élément interactif pendant le chargement
- Région lecteur d'écran : `aria-label="Chargement en cours"` sur la zone principale
- État API correspondant : requête en transit
- Éléments volontairement absents : données réelles, actions utilisateur

---

## 3. Wireframe 2 — Liste de matchs non vide

**État API :** HTTP 200 — `matches.length > 0`

### 3.1 Format compact — 360 px

```text
┌────────────────────────────────────────┐
│ ◈ Athena              [●] Service OK   │
├────────────────────────────────────────┤
│ Ligue 1 (FL1)  |  7 prochains jours   │
│                         3 matchs       │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ Paris SG      vs   Marseille     │  │  ← Équipes
│  │ Mer. 13 août    21h00 UTC        │  │  ← Date / Heure
│  │ J3              [Programmé]      │  │  ← Journée / Statut
│  └──────────────────────────────────┘  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ Lyon          vs   Monaco        │  │
│  │ Jeu. 14 août    19h00 UTC        │  │
│  │ J3              [Programmé]      │  │
│  └──────────────────────────────────┘  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ Lille         vs   Lens          │  │
│  │ Sam. 16 août    15h00 UTC        │  │
│  │ J3              [Programmé]      │  │
│  └──────────────────────────────────┘  │
│                                        │
└────────────────────────────────────────┘
```

### 3.2 Format large — 1280 px

```text
┌──────────────────────────────────────────────────────────────────┐
│ ◈ Athena Beyond Odds                         [●] Service actif   │
├──────────────────────────────────────────────────────────────────┤
│  Ligue 1 (FL1)    Matchs programmés  |  7 jours UTC  |  3 matchs │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────┐  ┌────────────────────────┐         │
│  │ Paris SG vs Marseille  │  │ Lyon     vs Monaco      │         │
│  │ 13/08  21h00 UTC  J3   │  │ 14/08  19h00 UTC  J3    │         │
│  │ [Programmé]            │  │ [Programmé]             │         │
│  └────────────────────────┘  └────────────────────────┘         │
│                                                                  │
│  ┌────────────────────────┐                                      │
│  │ Lille    vs Lens        │                                      │
│  │ 16/08  15h00 UTC  J3   │                                      │
│  │ [Programmé]            │                                      │
│  └────────────────────────┘                                      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Annotations :**
- Hiérarchie : AppHeader → CompetitionHeader (avec compteur) → MatchList → MatchCard × N
- Ordre de lecture : chronologique (plus proche → plus éloigné)
- Responsive : cartes empilées (compact) → grille 2 colonnes (large)
- Clavier : focus sur chaque MatchCard (Tab), lecture des infos
- Région lecteur d'écran : `aria-live="polite"` annonce « 3 matchs disponibles »
- État API : HTTP 200, `matches.length = 3` (exemple)
- Éléments volontairement absents : lien vers détail, score, cote, prédiction, bouton de pari, favori, partage

---

## 4. Wireframe 3 — Tableau vide

**État API :** HTTP 200 — `matches: []`

### 4.1 Format compact — 360 px

```text
┌────────────────────────────────────────┐
│ ◈ Athena              [●] Service OK   │
├────────────────────────────────────────┤
│ Ligue 1 (FL1)  |  7 prochains jours   │
├────────────────────────────────────────┤
│                                        │
│         ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌         │
│                                        │
│    Aucun match programmé sur la        │
│    période disponible.                 │
│                                        │
│         ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌         │
│                                        │
└────────────────────────────────────────┘
```

**Annotations :**
- Ce n'est pas un état d'erreur — ton neutre et informatif
- Aucune suggestion de compétition alternative
- Aucun bouton d'action (HTTP 200 est une réponse valide)
- Accessible : `aria-live="polite"` : « Aucun match disponible pour la période »
- Éléments absents : icône illustrative (optionnelle à valider), action de rechargement

---

## 5. Wireframe 4 — Compétition indisponible (HTTP 404)

**État API :** HTTP 404 — `COMPETITION_NOT_AVAILABLE`

### 5.1 Format compact — 360 px

```text
┌────────────────────────────────────────┐
│ ◈ Athena              [●] Service OK   │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐  │
│  │  ⚠  Compétition non disponible   │  │  ← Titre erreur
│  │                                  │  │
│  │  Cette compétition n'est pas     │  │
│  │  prise en charge par le          │  │
│  │  prototype. Seule la Ligue 1     │  │
│  │  (FL1) est disponible.           │  │
│  └──────────────────────────────────┘  │
│                                        │
└────────────────────────────────────────┘
```

**Annotations :**
- Code technique `COMPETITION_NOT_AVAILABLE` non affiché à l'utilisateur
- Aucune suggestion de compétition non disponible
- Accessible : `role="alert"`, annonce immédiate
- Éléments absents : sélecteur d'autres compétitions, liens non supportés

---

## 6. Wireframe 5 — Limite fournisseur atteinte (HTTP 429)

**État API :** HTTP 429 — `PROVIDER_RATE_LIMIT`

### 6.1 Format compact — 360 px

```text
┌────────────────────────────────────────┐
│ ◈ Athena              [●] Service OK   │
├────────────────────────────────────────┤
│ Ligue 1 (FL1)  |  7 prochains jours   │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐  │
│  │  ⚠  Données temporairement       │  │
│  │     inaccessibles                │  │
│  │                                  │  │
│  │  Les données ne peuvent pas      │  │
│  │  être actualisées pour           │  │
│  │  l'instant. Veuillez réessayer   │  │
│  │  dans quelques instants.         │  │
│  │                                  │  │
│  │  [  Réessayer  ]  ← (optionnel) │  │
│  └──────────────────────────────────┘  │
│                                        │
└────────────────────────────────────────┘
```

**Annotations :**
- `PROVIDER_RATE_LIMIT` non affiché à l'utilisateur
- Le quota exact du fournisseur n'est pas exposé
- Bouton « Réessayer » : action manuelle uniquement (à valider), déclenche une nouvelle requête utilisateur
- Aucun retry automatique
- Accessible : `role="alert"`, bouton accessible au clavier (≥ 44×44 px)

---

## 7. Wireframe 6 — Fournisseur indisponible (HTTP 503)

**État API :** HTTP 503 — `PROVIDER_UNAVAILABLE`

### 7.1 Format compact — 360 px

```text
┌────────────────────────────────────────┐
│ ◈ Athena              [●] Service OK   │
├────────────────────────────────────────┤
│ Ligue 1 (FL1)  |  7 prochains jours   │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐  │
│  │  ✕  Service indisponible         │  │
│  │                                  │  │
│  │  Le service est temporairement   │  │
│  │  indisponible. Veuillez          │  │
│  │  recharger plus tard.            │  │
│  │                                  │  │
│  │  [  Réessayer  ]  ← (à étudier) │  │
│  └──────────────────────────────────┘  │
│                                        │
└────────────────────────────────────────┘
```

**Annotations :**
- `PROVIDER_UNAVAILABLE` non affiché à l'utilisateur
- Bouton « Réessayer » distinct d'un retry automatique backend
- Accessible : `role="alert"`, focus géré vers le message d'erreur
- Éléments absents : détails techniques, stack trace, message d'erreur backend brut

---

## 8. Wireframe 7 — Réseau local indisponible

**Signal :** `NetworkError` / `TypeError: Failed to fetch` — distinct de HTTP 503.

### 8.1 Format compact — 360 px

```text
┌────────────────────────────────────────┐
│ ◈ Athena              [?] Non connecté │  ← État réseau dans header
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐  │
│  │  ✕  Connexion indisponible       │  │
│  │                                  │  │
│  │  Vérifiez votre connexion        │  │
│  │  internet et réessayez.          │  │
│  │                                  │  │
│  │  [  Réessayer  ]                 │  │
│  └──────────────────────────────────┘  │
│                                        │
└────────────────────────────────────────┘
```

**Annotations :**
- Distinction explicite avec HTTP 503 : le problème est local, pas le service Athena
- Indicateur de connexion dans l'en-tête (non intrusif)
- Bouton « Réessayer » : relance la requête après reconnexion
- Accessible : `role="alert"`, annonce immédiate
- Éléments absents : détails techniques réseau

---

## 9. Wireframe 8 — Service de santé indisponible

**Signal :** `GET /health` retourne non-200 ou ne répond pas.

### 9.1 Format compact — 360 px

```text
┌────────────────────────────────────────┐
│ ◈ Athena              [!] Maintenance  │  ← Indicateur dans AppHeader
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐  │
│  │  ℹ  Service en maintenance       │  │  ← Bannière InlineFeedback
│  │  Athena rencontre une difficulté │  │
│  │  technique. Certaines données    │  │
│  │  peuvent être indisponibles.     │  │
│  └──────────────────────────────────┘  │
│                                        │
│  [Zone principale : état potentiel     │
│   de la liste de matchs si le backend │
│   répond quand même]                   │
│                                        │
└────────────────────────────────────────┘
```

**Annotations :**
- Expérience dégradée, non bloquante si le backend répond partiellement
- Indicateur discret dans l'en-tête plutôt que modal bloquant
- Accessible : `role="status"` ou `aria-live="polite"` (non urgent)
- Ton non alarmiste
- Éléments absents : stack trace, détails du service de santé

---

## 10. Checklist de validation des wireframes

| Critère | W1 | W2 | W3 | W4 | W5 | W6 | W7 | W8 |
|---|---|---|---|---|---|---|---|---|
| Aucune fonctionnalité inexistante | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Aucune page non supportée | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Aucune valeur graphique définitive | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Aucune technologie mentionnée | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Conformité à l'état API correspondant | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Cohérence mobile (360 px) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Cohérence large (1280 px) | ✓ | ✓ | — | — | — | — | — | — |
| Accessibilité conceptuelle | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

> Les wireframes 3 à 8 sont prioritairement spécifiés en format compact. Le format large sera cadré à l'itération suivante sur validation du Fondateur.

---

## 11. Textes de travail

Les textes présents dans les wireframes sont **provisoires** et rédigés en français, langue de référence initiale du projet (Blueprint `docs/08-product-blueprint/02-product-principles.md`).

> Ces textes ne résolvent pas `OQ-004` et ne décident pas de la stratégie linguistique finale du MVP.

---

```text
WIREFRAMES BASSE FIDÉLITÉ PHASE 3.1 PRODUITS — MAQUETTES VISUELLES DÉFINITIVES ET CODE FRONTEND ENCORE INTERDITS
```

---

> Made in Abyss : Spark by the King
